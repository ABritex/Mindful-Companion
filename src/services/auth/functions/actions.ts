"use server"

import { z } from "zod"
import { redirect } from "next/navigation"
import { signInSchema, signUpSchema } from "./schemas"
import { db } from "@/drizzle/db"
import { OAuthProvider, UserTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { comparePasswords, generateSalt, hashPassword, } from "./passwordHasher"
import { cookies } from "next/headers"
import { createUserSession, removeUserFromSession } from "./session"
import { getOAuthClient } from "./oauth/base"
import { redisClient } from "@/lib/redis"

export async function signIn(unsafeData: z.infer<typeof signInSchema>) {
    const { success, data, error } = signInSchema.safeParse(unsafeData)

    if (!success) {
        console.error("Sign in validation error:", error.errors)
        return "Invalid input. Please check your credentials and try again."
    }

    try {
        const user = await db.query.UserTable.findFirst({
            columns: { password: true, salt: true, id: true, email: true, role: true },
            where: eq(UserTable.email, data.email),
        })

        if (user == null || user.password == null || user.salt == null) {
            return "Invalid email or password"
        }

        const isCorrectPassword = await comparePasswords({
            hashedPassword: user.password,
            password: data.password,
            salt: user.salt,
        })

        if (!isCorrectPassword) {
            return "Invalid email or password"
        }

        await createUserSession(user)
    } catch (error) {
        console.error("Sign in error:", error)
        return "An error occurred during sign in. Please try again."
    }

    redirect("/")
}

export async function signUp(unsafeData: z.infer<typeof signUpSchema> & { code?: string }) {
    const { success, data, error } = signUpSchema.safeParse(unsafeData)

    if (!success) {
        console.error("Sign up validation error:", error.errors)
        return "Invalid input. Please check all fields and try again."
    }

    try {
        const existingUser = await db.query.UserTable.findFirst({
            where: eq(UserTable.email, data.email),
        })
        if (existingUser != null) {
            return "An account already exists for this email address"
        }
        const redisKey = `verification:${data.email}`
        const storedCode = await redisClient.get(redisKey)
        if (!storedCode) {
            return "Please click 'Send Verification Code' first"
        }
        if (!unsafeData.code) {
            return "Please enter the verification code sent to your email"
        }
        const normalizedStoredCode = String(storedCode)
        const normalizedProvidedCode = String(unsafeData.code.trim())
        if (normalizedStoredCode !== normalizedProvidedCode) {
            return "Invalid verification code. Please check and try again."
        }
        const salt = generateSalt()
        const hashedPassword = await hashPassword(data.password, salt)
        const [user] = await db
            .insert(UserTable)
            .values({
                name: data.name.trim(),
                email: data.email.toLowerCase().trim(),
                password: hashedPassword,
                salt,
                employeeId: crypto.randomUUID(),
                authType: "password",
                isProfileComplete: "false",
                campus: "Main",
                officeOrDept: "Unassigned",
            })
            .returning({ id: UserTable.id, role: UserTable.role })
        if (user == null) {
            throw new Error("Failed to create user record")
        }
        try {
            await redisClient.del(redisKey)
        } catch (cleanupError) {
            console.error("Failed to clean up verification code from Redis:", cleanupError)
        }
        await createUserSession(user)
        return null

    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('unique constraint')) {
                return "An account already exists for this email address"
            }
            if (error.message.includes('network') || error.message.includes('connection')) {
                return "Network error. Please check your connection and try again."
            }
        }
        return "Unable to create account. Please try again later."
    }
}

export async function logOut() {
    try {
        await removeUserFromSession()
    } catch (error) {
        console.error("Logout error:", error)
    }
    redirect("/")
}

export async function oAuthSignIn(provider: OAuthProvider) {
    const oAuthClient = getOAuthClient(provider)
    redirect(oAuthClient.createAuthUrl(await cookies()))
}