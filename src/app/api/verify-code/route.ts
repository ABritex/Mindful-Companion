import { NextResponse } from "next/server"
import { z } from "zod"
import { redisClient } from "@/lib/redis"

const verifyCodeSchema = z.object({
    email: z.string().email("Invalid email address"),
    code: z.string().min(6).max(6),
})

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, code } = verifyCodeSchema.parse(body)

        const redisKey = `verification:${email}`
        const storedCode = await redisClient.get(redisKey)

        if (!storedCode) {
            return NextResponse.json(
                { error: "Verification code has expired or is invalid" },
                { status: 400 }
            )
        }

        // Convert both codes to strings for comparison
        const normalizedStoredCode = String(storedCode)
        const normalizedProvidedCode = String(code)

        if (normalizedStoredCode !== normalizedProvidedCode) {
            return NextResponse.json(
                { error: "Invalid verification code" },
                { status: 400 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid request data" },
                { status: 400 }
            )
        }
        return NextResponse.json(
            { error: "An error occurred while verifying the code" },
            { status: 500 }
        )
    }
}