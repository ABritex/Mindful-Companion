import { userRoles } from "@/drizzle/schema"
import { z } from "zod"
import { redisClient } from "@/lib/redis"
import { cookies } from "next/headers"

const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7
const COOKIE_SESSION_KEY = "session-id"

const sessionSchema = z.object({
    id: z.string(),
    role: z.enum(userRoles),
})

type UserSession = z.infer<typeof sessionSchema>

export async function getUserFromSession() {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get(COOKIE_SESSION_KEY)?.value
    if (sessionId == null) return null
    return getUserSessionById(sessionId)
}

export async function updateUserSessionData(user: UserSession) {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get(COOKIE_SESSION_KEY)?.value
    if (sessionId == null) return null
    await redisClient.set(`session:${sessionId}`, sessionSchema.parse(user), {
        ex: SESSION_EXPIRATION_SECONDS,
    })
}

export async function createUserSession(user: UserSession) {
    const sessionId = crypto.randomUUID()
    await redisClient.set(`session:${sessionId}`, sessionSchema.parse(user), {
        ex: SESSION_EXPIRATION_SECONDS,
    })

    await setCookie(sessionId)
}

export async function updateUserSessionExpiration() {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get(COOKIE_SESSION_KEY)?.value
    if (sessionId == null) return null
    const user = await getUserSessionById(sessionId)
    if (user == null) return
    await redisClient.set(`session:${sessionId}`, user, {
        ex: SESSION_EXPIRATION_SECONDS,
    })
    await setCookie(sessionId)
}

export async function removeUserFromSession() {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get(COOKIE_SESSION_KEY)?.value
    if (sessionId == null) return null
    await redisClient.del(`session:${sessionId}`)

    // Delete the cookie
    cookieStore.delete(COOKIE_SESSION_KEY)
}

async function setCookie(sessionId: string) {
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_SESSION_KEY, sessionId, {
        secure: true,
        httpOnly: true,
        sameSite: "lax",
        expires: Date.now() + SESSION_EXPIRATION_SECONDS * 1000,
    })
}

async function getUserSessionById(sessionId: string) {
    const rawUser = await redisClient.get(`session:${sessionId}`)
    const { success, data: user } = sessionSchema.safeParse(rawUser)
    return success ? user : null
}
