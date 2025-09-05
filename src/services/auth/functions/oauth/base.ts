import { env } from "@/data/env/server"
import { z } from "zod"
import crypto from "crypto"
import { OAuthProvider } from "@/drizzle/schema"
import { createDiscordOAuthClient } from "./discord"
import { createGithubOAuthClient } from "./github"
import { createGoogleOAuthClient } from "./google"

const STATE_COOKIE_KEY = "oAuthState"
const CODE_VERIFIER_COOKIE_KEY = "oAuthCodeVerifier"
const COOKIE_EXPIRATION_SECONDS = 60 * 10

export class OAuthClient<T> {
    private readonly provider: OAuthProvider
    private readonly clientId: string
    private readonly clientSecret: string
    private readonly scopes: string[]
    private readonly urls: {
        auth: string
        token: string
        user: string
    }
    private readonly userInfo: {
        schema: z.ZodSchema<T>
        parser: (data: T) => { id: string; email: string; name: string }
    }
    private readonly tokenSchema = z.object({
        access_token: z.string(),
        token_type: z.string(),
    })

    constructor({
        provider,
        clientId,
        clientSecret,
        scopes,
        urls,
        userInfo,
    }: {
        provider: OAuthProvider
        clientId: string
        clientSecret: string
        scopes: string[]
        urls: {
            auth: string
            token: string
            user: string
        }
        userInfo: {
            schema: z.ZodSchema<T>
            parser: (data: T) => { id: string; email: string; name: string }
        }
    }) {
        this.provider = provider
        this.clientId = clientId
        this.clientSecret = clientSecret
        this.scopes = scopes
        this.urls = urls
        this.userInfo = userInfo
    }

    private get redirectUrl() {
        return new URL(this.provider, env.OAUTH_REDIRECT_URL_BASE)
    }

    createAuthUrl(cookies: any) {
        const state = createState(cookies)
        const codeVerifier = createCodeVerifier(cookies)
        const url = new URL(this.urls.auth)
        url.searchParams.set("client_id", this.clientId)
        url.searchParams.set("redirect_uri", this.redirectUrl.toString())
        url.searchParams.set("response_type", "code")
        url.searchParams.set("scope", this.scopes.join(" "))
        url.searchParams.set("state", state)
        url.searchParams.set("code_challenge_method", "S256")
        url.searchParams.set("code_challenge", crypto.hash("sha256", codeVerifier, "base64url"))
        return url.toString()
    }

    async fetchUser(code: string, state: string, cookies: any) {
        const isValidState = await validateState(state, cookies)
        if (!isValidState) throw new InvalidStateError()

        const tokenData = await this.fetchToken(
            code,
            getCodeVerifier(cookies)
        )
        const { access_token: accessToken, token_type: tokenType } = tokenData

        const user = await fetch(this.urls.user, {
            headers: {
                Authorization: `${tokenType} ${accessToken}`,
            },
        })
            .then(res => res.json())
            .then(rawData => {
                const { data, success, error } = this.userInfo.schema.safeParse(rawData)
                if (!success) throw new InvalidUserError(error)

                return data
            })

        return this.userInfo.parser(user)
    }

    private async fetchToken(code: string, codeVerifier: string) {
        const response = await fetch(this.urls.token, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: this.clientId,
                client_secret: this.clientSecret,
                code,
                code_verifier: codeVerifier,
                grant_type: "authorization_code",
                redirect_uri: this.redirectUrl.toString(),
            }),
        })

        if (!response.ok) {
            throw new TokenFetchError(
                `Failed to fetch token: ${response.status} ${response.statusText}`
            )
        }

        const rawData = await response.json()
        const { data, success, error } = this.tokenSchema.safeParse(rawData)
        if (!success) throw new TokenParseError(error)

        return data
    }
}

export function getOAuthClient(provider: OAuthProvider) {
    switch (provider) {
        case "google":
            return createGoogleOAuthClient()
        case "github":
            return createGithubOAuthClient()
        case "discord":
            return createDiscordOAuthClient()
        default:
            throw new Error(`Unsupported OAuth provider: ${provider}`)
    }
}

function createState(cookies: any) {
    const state = crypto.randomBytes(32).toString("hex")
    cookies.set(STATE_COOKIE_KEY, state, {
        secure: true,
        httpOnly: true,
        sameSite: "lax",
        expires: Date.now() + COOKIE_EXPIRATION_SECONDS * 1000,
    })
    return state
}

function createCodeVerifier(cookies: any) {
    const codeVerifier = crypto.randomBytes(32).toString("base64url")
    cookies.set(CODE_VERIFIER_COOKIE_KEY, codeVerifier, {
        secure: true,
        httpOnly: true,
        sameSite: "lax",
        expires: Date.now() + COOKIE_EXPIRATION_SECONDS * 1000,
    })
    return codeVerifier
}

async function validateState(state: string, cookies: any) {
    const storedState = cookies.get(STATE_COOKIE_KEY)?.value
    if (!storedState) return false

    cookies.delete(STATE_COOKIE_KEY)
    return state === storedState
}

function getCodeVerifier(cookies: any) {
    const codeVerifier = cookies.get(CODE_VERIFIER_COOKIE_KEY)?.value
    if (!codeVerifier) throw new MissingCodeVerifierError()

    cookies.delete(CODE_VERIFIER_COOKIE_KEY)
    return codeVerifier
}

export class InvalidStateError extends Error {
    constructor() {
        super("Invalid OAuth state")
        this.name = "InvalidStateError"
    }
}

export class InvalidUserError extends Error {
    constructor(error: z.ZodError) {
        super(`Invalid user data: ${error.message}`)
        this.name = "InvalidUserError"
    }
}

export class TokenFetchError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "TokenFetchError"
    }
}

export class TokenParseError extends Error {
    constructor(error: z.ZodError) {
        super(`Invalid token data: ${error.message}`)
        this.name = "TokenParseError"
    }
}

export class MissingCodeVerifierError extends Error {
    constructor() {
        super("Missing OAuth code verifier")
        this.name = "MissingCodeVerifierError"
    }
}