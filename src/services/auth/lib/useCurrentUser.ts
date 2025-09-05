"use client"

import { useEffect, useState } from "react"

export interface User {
    id: string
    email: string
    name: string | null
    role: string
    employeeId: string | null
    campus: "Main" | "North" | "South" | "East" | "West" | null
    officeOrDept: string | null
    profilePicture: string | null
    isProfileComplete: "true" | "false"
    hasCompletedPreAssessment: "true" | "false"
}

export function useCurrentUser() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("/api/current-user")
            .then((res) => res.json())
            .then((data) => {
                if (data.user) {
                    setUser(data.user)
                }
            })
            .catch((error) => {
                console.error("Error fetching user:", error)
            })
            .finally(() => setLoading(false))
    }, [])

    return { user, loading }
}
