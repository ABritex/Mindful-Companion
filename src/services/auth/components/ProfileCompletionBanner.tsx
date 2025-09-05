"use client"

import { StickyBanner } from "@/components/ui/sticky-banner"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCurrentUser } from "@/services/auth/lib/useCurrentUser"

export function ProfileCompletionBanner() {
    const pathname = usePathname()
    const { user, loading } = useCurrentUser()
    if (loading || !user || user.isProfileComplete === "true" || pathname === "/profile/completion") {
        return null
    }

    return (
        <StickyBanner className="bg-gradient-to-b from-blue-500 to-blue-600">
            <div className="mx-0 max-w-[90%] text-white drop-shadow-md">
                <p>
                    Complete your profile to access all features.{" "}
                    <Button asChild variant="link" className="text-white hover:text-white/90">
                        <Link href="/profile/completion">
                            Complete Profile
                        </Link>
                    </Button>
                </p>
            </div>
        </StickyBanner>
    )
} 