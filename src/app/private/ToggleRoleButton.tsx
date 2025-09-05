"use client"

import { toggleRole } from "@/services/auth/functions/toggleRole"
import { Button } from "@/components/ui/button"

export function ToggleRoleButton() {
    return <Button onClick={toggleRole}>Toggle Role</Button>
}