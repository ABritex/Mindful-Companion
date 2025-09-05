"use server"

import { updateUserSessionData } from "@/services/auth/functions/session"
import { getCurrentUser } from "@/services/auth/functions/currentUser"
import { db } from "@/drizzle/db"
import { UserTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"


export async function toggleRole() {
    const user = await getCurrentUser({ redirectIfNotFound: true })
    const [updatedUser] = await db
        .update(UserTable)
        .set({ role: user.role === "admin" ? "user" : "admin" })
        .where(eq(UserTable.id, user.id))
        .returning({ id: UserTable.id, role: UserTable.role })
    await updateUserSessionData(updatedUser)
}