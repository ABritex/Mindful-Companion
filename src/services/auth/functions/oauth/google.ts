import { env } from "@/data/env/server"
import { OAuthClient } from "./base"
import { z } from "zod"

export function createGoogleOAuthClient() {
    console.log('OAUTH_REDIRECT_URL_BASE:', env.OAUTH_REDIRECT_URL_BASE)
    console.log('Google Client ID:', env.GOOGLE_CLIENT_ID)
    return new OAuthClient({
        provider: "google",
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        scopes: ["openid", "profile", "email"],
        urls: {
            auth: "https://accounts.google.com/o/oauth2/v2/auth",
            token: "https://oauth2.googleapis.com/token",
            user: "https://www.googleapis.com/oauth2/v2/userinfo",
        },
        userInfo: {
            schema: z.object({
                id: z.string(),
                email: z.string().email(),
                name: z.string(),
            }),
            parser: (user) => ({
                id: user.id,
                email: user.email,
                name: user.name,
            }),
        },
    })
}
