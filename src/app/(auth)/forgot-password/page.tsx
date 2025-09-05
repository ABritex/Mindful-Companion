"use client"

import { useSearchParams } from "next/navigation"
import { ForgotPasswordForm } from "@/services/auth/components/forms/ForgotPasswordForm"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { AuthLayout } from "@/services/auth/components/AuthLayout"

export default function ForgotPasswordPage() {
    const searchParams = useSearchParams()
    const email = searchParams.get("email") || undefined
    return (
        <AuthLayout title="Forgot Password" subtitle="Enter your email address and we'll send you a link to reset your password." backHref="/sign-in"
            topRightContent={
                <>
                    Remember your password?{' '}
                    <Link href="/sign-in" className="text-[var(--color-primary)] font-semibold hover:underline">Sign in</Link>
                </>
            } mode="forgot">
            <Card className="shadow-none border-0 p-0 bg-transparent">
                <CardContent className="p-0">
                    <ForgotPasswordForm email={email} />
                </CardContent>
            </Card>
        </AuthLayout>
    )
} 