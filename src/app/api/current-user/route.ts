import { getCurrentUser } from "@/services/auth/functions/currentUser"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const user = await getCurrentUser({ withFullUser: true })

        if (!user) {
            return NextResponse.json({ user: null }, { status: 401 })
        }

        return NextResponse.json({ user })
    } catch (error) {
        console.error("Error fetching current user:", error)
        return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 })
    }
}
