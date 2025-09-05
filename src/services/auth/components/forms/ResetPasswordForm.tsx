"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react"
import { z } from "zod"
import { getPasswordRequirements, getPasswordStrength, PasswordRequirement } from "@/services/auth/lib/passwordStrength"

const resetPasswordSchema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

interface ResetPasswordFormProps {
    token: string | null
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [isValid, setIsValid] = useState<boolean | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    })

    const password = watch('password') || "";
    const passwordRequirements: PasswordRequirement[] = getPasswordRequirements(password)
    const passwordStrength = getPasswordStrength(password)

    useEffect(() => {
        if (!token) {
            setIsValid(false)
            return
        }
        const validateToken = async () => {
            try {
                const response = await fetch(`/api/oauth/reset-password/validate?token=${encodeURIComponent(token)}`)
                const data = await response.json()
                setIsValid(data.valid)
            } catch (error) {
                setIsValid(false)
            }
        }
        validateToken()
    }, [token])

    const onSubmit = async (data: ResetPasswordFormData) => {
        if (!token) {
            setError("Invalid reset token")
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch("/api/oauth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,
                    password: data.password,
                }),
            })

            const result = await response.json()

            if (response.ok) {
                setSuccess(true)
            } else {
                setError(result.error || "Failed to reset password")
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : "An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    if (isValid === null) {
        return <div className="flex items-center justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>
    }
    if (!isValid) {
        return <div className="text-center text-red-600 py-8">This password reset link is invalid or has expired. Please request a new one.</div>
    }

    if (success) {
        return (
            <div className="text-center space-y-4">
                <h3 className="text-lg font-medium">Password Reset Successful</h3>
                <p className="text-sm text-gray-600">
                    Your password has been reset successfully.
                </p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                    New Password
                </Label>
                <div className="relative">
                    <Input id="password" type={showPassword ? "text" : "password"} {...register("password")} placeholder="Enter your new password" className={`pr-10 ${errors.password ? 'border-red-300 focus-visible:ring-red-500' : ''}`} disabled={isLoading} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors disabled:opacity-50" disabled={isLoading} tabIndex={-1}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {password.length > 0 && (
                    <div className="space-y-2 mt-2">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 dark:text-gray-400">Password strength:</span>
                            <span className={`font-medium ${passwordStrength >= 80 ? 'text-green-600 dark:text-green-400' : passwordStrength >= 60 ? 'text-yellow-600 dark:text-yellow-400' : passwordStrength >= 40 ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400'}`}>
                                {passwordStrength >= 80 ? 'Strong' :
                                    passwordStrength >= 60 ? 'Good' :
                                        passwordStrength >= 40 ? 'Fair' :
                                            'Weak'}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full transition-all duration-300 ${passwordStrength >= 80 ? 'bg-green-500' : passwordStrength >= 60 ? 'bg-yellow-500' : passwordStrength >= 40 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${passwordStrength}%` }} />
                        </div>
                        <div className="space-y-1">
                            {passwordRequirements.map((requirement, index) => (
                                <div key={index} className="flex items-center gap-2 text-xs">
                                    {requirement.met ? (
                                        <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                                    ) : (
                                        <XCircle className="h-3 w-3 text-gray-400 flex-shrink-0" />
                                    )}
                                    <span className={requirement.met ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}>
                                        {requirement.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {errors.password && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        {errors.password.message}
                    </p>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password
                </Label>
                <Input id="confirmPassword" type="password" {...register("confirmPassword")} placeholder="Confirm your password" className={errors.confirmPassword ? 'border-red-300 focus-visible:ring-red-500' : ''} disabled={isLoading} />
                {errors.confirmPassword && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        {errors.confirmPassword.message}
                    </p>
                )}
            </div>
            {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-md">
                    {error}
                </div>
            )}
            <Button type="submit" className="w-full px-4" disabled={isLoading}>
                {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
        </form>
    )
} 