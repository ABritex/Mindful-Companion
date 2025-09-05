import { NextResponse, type NextRequest } from "next/server"
import { updateUserSessionExpiration } from "./services/auth/functions/session"

const privateRoutes = ["/private", "/profile/completion", "/chat"]
const adminRoutes = ["/admin"]

export async function middleware(request: NextRequest) {
    const response = (await middlewareAuth(request)) ?? NextResponse.next()

    // Update session expiration
    try {
        await updateUserSessionExpiration()
    } catch (error) {
        console.error("Failed to update session expiration:", error)
    }

    return response
}

async function middlewareAuth(request: NextRequest) {
    const { pathname } = request.nextUrl

    if (pathname === "/api/oauth/reset-password" && request.method === "GET") {
        const token = request.nextUrl.searchParams.get("token")
        if (token) {
            return NextResponse.redirect(new URL(`/reset-password?token=${token}`, request.url))
        }
    }

    if (privateRoutes.includes(pathname)) {
        // For middleware, we need to check cookies from the request
        const sessionId = request.cookies.get("session-id")?.value
        if (!sessionId) {
            return NextResponse.redirect(new URL("/sign-in", request.url))
        }
    }

    if (adminRoutes.includes(pathname)) {
        const sessionId = request.cookies.get("session-id")?.value
        if (!sessionId) {
            return NextResponse.redirect(new URL("/sign-in", request.url))
        }
        // Note: Full role check would require database access, which middleware can't do
        // This is a basic check - the actual role verification happens in the page components
    }
}

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    ],
}