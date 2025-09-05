"use server"

import { db } from "@/drizzle/db"
import { UserTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { getCurrentUser } from "@/services/auth/functions/currentUser"
import { profileFormSchema, type ProfileFormData } from "./schemas"

export async function updateProfile(data: ProfileFormData) {
    const { success } = profileFormSchema.safeParse(data)
    if (!success) {
        return { error: "Invalid form data" }
    }

    const currentUser = await getCurrentUser({ redirectIfNotFound: true })
    const user = await db.query.UserTable.findFirst({
        where: eq(UserTable.id, currentUser.id),
    })

    if (!user) {
        return { error: "User not found" }
    }

    try {
        // Check if employee ID is already taken
        if (data.employeeId !== user.employeeId) {
            const existingUser = await db
                .select()
                .from(UserTable)
                .where(eq(UserTable.employeeId, data.employeeId))
                .limit(1)

            if (existingUser.length > 0) {
                return { error: "Employee ID is already taken" }
            }
        }

        await db
            .update(UserTable)
            .set({
                employeeId: data.employeeId,
                name: data.name,
                campus: data.campus,
                officeOrDept: data.officeOrDept,
                profilePicture: data.profilePicture,
                isProfileComplete: "true",
            })
            .where(eq(UserTable.id, user.id))

        return { success: true }
    } catch (error) {
        console.error("Error updating profile:", error)
        return { error: "Failed to update profile" }
    }
}

export async function getProfile() {
    const user = await getCurrentUser({ redirectIfNotFound: true })

    try {
        const profile = await db
            .select()
            .from(UserTable)
            .where(eq(UserTable.id, user.id))
            .limit(1)

        if (!profile.length) {
            return { error: "Profile not found" }
        }

        return { data: profile[0] }
    } catch (error) {
        console.error("Error fetching profile:", error)
        return { error: "Failed to fetch profile" }
    }
}

export async function deleteProfilePicture() {
    const user = await getCurrentUser({ redirectIfNotFound: true })

    try {
        await db
            .update(UserTable)
            .set({
                profilePicture: null,
            })
            .where(eq(UserTable.id, user.id))

        return { success: true }
    } catch (error) {
        console.error("Error deleting profile picture:", error)
        return { error: "Failed to delete profile picture" }
    }
}

export async function validateEmployeeId(employeeId: string) {
    try {
        const existingUser = await db
            .select()
            .from(UserTable)
            .where(eq(UserTable.employeeId, employeeId))
            .limit(1)

        return {
            isValid: existingUser.length === 0,
            message: existingUser.length > 0 ? "Employee ID already exists" : "Employee ID is available"
        }
    } catch (error) {
        console.error("Error validating employee ID:", error)
        return { error: "Failed to validate employee ID" }
    }
} 