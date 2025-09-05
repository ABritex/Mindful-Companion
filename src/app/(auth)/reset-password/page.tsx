"use client"

import { useSearchParams } from "next/navigation"
import { ResetPasswordForm } from "@/services/auth/components/forms/ResetPasswordForm"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { AuthLayout } from "@/services/auth/components/AuthLayout"

export default function ResetPasswordPage() {
    const searchParams = useSearchParams()
    const token = searchParams.get("token") || null
    return (
        <AuthLayout title="Reset Password" subtitle="Enter your new password below." backHref="/sign-in" mode="reset">
            <Card className="shadow-none border-0 p-0 bg-transparent">
                <CardContent className="space-y-4 p-0">
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Please do not close this page until you have successfully reset your password.
                        </AlertDescription>
                    </Alert>
                    <ResetPasswordForm token={token} />
                </CardContent>
            </Card>
        </AuthLayout>
    )
} 