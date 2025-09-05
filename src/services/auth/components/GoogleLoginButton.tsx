"use client"

import { Button } from "@/components/ui/button"
import { oAuthSignIn } from "@/services/auth/functions/actions"
import { useState } from "react"
import Image from "next/image"

export function GoogleLoginButton() {
    const [isLoading, setIsLoading] = useState(false)

    const handleGoogleSignIn = async () => {
        setIsLoading(true)
        try {
            await oAuthSignIn("google")
        } catch (error) {
            if (error instanceof Error && !error.message.includes('NEXT_REDIRECT')) {
                console.error('Google sign-in error:', error)
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button type="button" variant="outline" className="w-full flex items-center justify-center gap-2" onClick={handleGoogleSignIn} disabled={isLoading}>
            <Image src="/icons/auth/google.svg" alt="Google logo" width={24} height={24} priority />
            {isLoading ? "Redirecting..." : "Continue with Google"}
        </Button>
    )
} 