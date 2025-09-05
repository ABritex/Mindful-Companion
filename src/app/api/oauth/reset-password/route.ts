import { NextResponse } from "next/server"
import { z } from "zod"
import { redisClient } from "@/lib/redis"
import { db } from "@/drizzle/db"
import { UserTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { hashPassword, generateSalt } from "@/services/auth/functions/passwordHasher"

const resetPasswordSchema = z.object({
    token: z.string(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
})

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const token = searchParams.get("token")

        if (!token) {
            return NextResponse.redirect(new URL("/sign-in", request.url))
        }

        const email = await redisClient.get(`reset:${token}`)
        if (!email) {
            return NextResponse.redirect(new URL("/sign-in", request.url))
        }

        return NextResponse.redirect(new URL(`/reset-password?token=${token}`, request.url))
    } catch (error) {
        console.error("Reset password validation error:", error)
        return NextResponse.redirect(new URL("/sign-in", request.url))
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { token, password } = resetPasswordSchema.parse(body)

        const email = await redisClient.get(`reset:${token}`)
        if (!email) {
            return NextResponse.json(
                { error: "Invalid or expired reset token" },
                { status: 400 }
            )
        }

        const salt = generateSalt()
        const hashedPassword = await hashPassword(password, salt)

        await db.update(UserTable)
            .set({
                password: hashedPassword,
                salt,
                updatedAt: new Date(),
                authType: "password"
            })
            .where(eq(UserTable.email, email as string))

        await Promise.all([
            redisClient.del(`reset:${token}`),
            redisClient.del(`password_reset_link_opened:${token}`)
        ])

        await Promise.all([
            redisClient.set(`password_reset_completed:${token}`, "true", { ex: 300 }), // 5 minutes expiry
            redisClient.set(`password_reset_completed:${email}`, "true", { ex: 300 }) // 5 minutes expiry
        ])

        return NextResponse.json({ success: true })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid request data" },
                { status: 400 }
            )
        }

        console.error("Reset password error:", error)
        return NextResponse.json(
            { error: "Failed to reset password" },
            { status: 500 }
        )
    }
} 