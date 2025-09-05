import { NextResponse } from "next/server"
import { z } from "zod"
import { redisClient } from "@/lib/redis"
import { sendVerificationEmail } from "@/lib/email/sendVerificationEmail"
import crypto from "crypto"

const sendCodeSchema = z.object({
    email: z.string().email("Invalid email address"),
})

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email } = sendCodeSchema.parse(body)
        const code = crypto.randomInt(100000, 999999).toString()
        const redisKey = `verification:${email}`

        await redisClient.set(redisKey, String(code), { ex: 600 })

        await sendVerificationEmail({
            to: email,
            code,
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Send code error:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid request data" },
                { status: 400 }
            )
        }
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to send verification code" },
            { status: 500 }
        )
    }
}