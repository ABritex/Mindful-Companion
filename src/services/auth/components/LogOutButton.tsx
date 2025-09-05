"use client"

import { Button } from "@/components/ui/button"
import { logOut } from "@/services/auth/functions/actions"

export function LogOutButton() {
    return (
        <Button variant="destructive" onClick={async () => await logOut()}>
            Log Out
        </Button>
    )
} 