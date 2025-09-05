"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { isValidEmail } from "@/services/auth/lib/validators"

const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
})
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
interface ForgotPasswordFormProps {
    email?: string
}

export function ForgotPasswordForm({ email: initialEmail }: ForgotPasswordFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [isSuspended, setIsSuspended] = useState(false)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    const [email, setEmail] = useState(initialEmail || "")
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    })

    // Polling for reset status
    useEffect(() => {
        if (!email) return
        let interval: NodeJS.Timeout
        const checkStatus = async () => {
            try {
                const response = await fetch(`/api/oauth/reset-password/status?token=${encodeURIComponent(email)}`)
                if (!response.ok) throw new Error('Failed to check status')
                const data = await response.json()
                if (data.status === "completed") {
                    window.location.href = "/sign-in"
                    return
                }
                setIsSuspended(true)
            } catch (error) {
                setIsSuspended(true)
            }
        }
        checkStatus()
        interval = setInterval(checkStatus, 5000)
        return () => clearInterval(interval)
    }, [email])

    // Resend logic
    const handleResend = async () => {
        if (!email) return
        setIsLoading(true)
        try {
            const response = await fetch("/api/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })
            if (!response.ok) throw new Error('Failed to resend reset link')
            setShowSuccessMessage(true)
            setTimeout(() => setShowSuccessMessage(false), 3000)
        } catch (error) {
            // Optionally handle error
        } finally {
            setIsLoading(false)
        }
    }

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsLoading(true)
        setShowSuccessMessage(false)

        // Email format validation
        if (!isValidEmail(data.email)) {
            setIsLoading(false)
            setError("email", { type: "manual", message: "Invalid email address format." })
            return
        }

        // Check if email exists in the database
        try {
            const existsRes = await fetch(`/api/reset-password?email=${encodeURIComponent(data.email)}`)
            const existsData = await existsRes.json()
            if (!existsRes.ok || !existsData.exists) {
                setIsLoading(false)
                setError("email", { type: "manual", message: "Email not found in our records." })
                return
            }
        } catch (err) {
            setIsLoading(false)
            setError("email", { type: "manual", message: "Could not verify email. Please try again." })
            return
        }

        try {
            const response = await fetch("/api/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
            const result = await response.json()
            if (response.ok) {
                window.location.replace(`/forgot-password?email=${encodeURIComponent(data.email)}`)
            } else {
                setShowSuccessMessage(false)
                setIsLoading(false)
            }
        } catch (error) {
            setShowSuccessMessage(false)
            setIsLoading(false)
        }
    }

    return (
        <div>
            {isSuspended ? (
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        If you haven&apos;t received the email, you can request a new one.
                    </p>
                    <button onClick={handleResend} disabled={isLoading} className="w-full btn btn-primary">
                        {isLoading ? "Sending..." : "Resend Reset Link"}
                    </button>
                    {showSuccessMessage && (
                        <div className="p-3 rounded-md bg-green-50 text-green-700 animate-fade-in">
                            Reset link has been resent to your email.
                        </div>
                    )}
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" {...register("email")} placeholder="Enter your email" disabled={isLoading} className={isLoading ? "opacity-50" : ""} />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : ("Send Reset Link")}
                    </Button>
                </form>
            )}
        </div>
    )
} 