import { NextResponse } from "next/server"
import { redisClient } from "@/lib/redis"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const token = searchParams.get("token")

        if (!token) {
            return NextResponse.json(
                { error: "Token is required" },
                { status: 400 }
            )
        }

        const keys = await redisClient.keys("password_reset_completed:*")

        const isCompleted = keys.some(key => {
            const value = key.split(":")[1]
            return value === token
        })

        if (isCompleted) {
            await Promise.all(
                keys.filter(key => key.split(":")[1] === token)
                    .map(key => redisClient.del(key))
            )

            return NextResponse.json({ status: "completed" })
        }

        return NextResponse.json({ status: "pending" })
    } catch (error) {
        console.error("Error checking reset status:", error)
        return NextResponse.json(
            { error: "Failed to check reset status" },
            { status: 500 }
        )
    }
} 