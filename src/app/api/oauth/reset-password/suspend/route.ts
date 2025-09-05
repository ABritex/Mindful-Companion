import { NextResponse } from "next/server"
import { redisClient } from "@/lib/redis"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { token } = body

        if (!token) {
            return NextResponse.json(
                { error: "Token is required" },
                { status: 400 }
            )
        }

        await redisClient.set(`password_reset_suspended:${token}`, "true", { ex: 300 })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error setting suspended state:", error)
        return NextResponse.json(
            { error: "Failed to set suspended state" },
            { status: 500 }
        )
    }
} 