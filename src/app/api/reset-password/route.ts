import { NextResponse } from "next/server"
import { z } from "zod"
import { redisClient } from "@/lib/redis"
import { sendPasswordResetEmail } from "@/lib/email/sendPasswordResetEmail"
import crypto from "crypto"
import { db } from "@/drizzle/db"
import { UserTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"

const resetPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
})

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email } = resetPasswordSchema.parse(body)

        const user = await db.query.UserTable.findFirst({
            where: eq(UserTable.email, email),
        })

        if (!user) {
            return NextResponse.json({
                success: true,
                message: "If an account exists with that email, you will receive a password reset link shortly."
            })
        }

        const keys = await redisClient.keys("reset:*")
        for (const key of keys) {
            const storedEmail = await redisClient.get(key)
            if (storedEmail === email) {
                await redisClient.del(key)
                const token = key.replace("reset:", "")
                await redisClient.del(`password_reset_link_opened:${token}`)
            }
        }

        const resetToken = crypto.randomBytes(32).toString("hex")

        await redisClient.set(`reset:${resetToken}`, email, {
            ex: 3600
        })

        await sendPasswordResetEmail({
            to: email,
            resetToken,
        })

        return NextResponse.json({
            success: true,
            message: "Password reset link has been sent to your email."
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid request data" },
                { status: 400 }
            )
        }

        console.error("Password reset error:", error)
        return NextResponse.json(
            { error: "Failed to send reset email" },
            { status: 500 }
        )
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }
    const user = await db.query.UserTable.findFirst({
        where: eq(UserTable.email, email),
    })
    return NextResponse.json({ exists: !!user })
} 