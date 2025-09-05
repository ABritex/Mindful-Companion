"use client"

import { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, CheckCircle, XCircle, Loader2, Mail } from "lucide-react"
import { signUpSchema } from "@/services/auth/functions/schemas"
import { signUp } from "@/services/auth/functions/actions"
import { GoogleLoginButton } from "@/services/auth/components/GoogleLoginButton"
import { getPasswordRequirements, getPasswordStrength, PasswordRequirement } from "@/services/auth/lib/passwordStrength"
import { isValidEmail } from "@/services/auth/lib/validators"

type SignUpFormData = {
    name: string
    email: string
    password: string
    confirmPassword: string
    code?: string
}

type AlertState = {
    type: 'success' | 'error' | null
    message: string
}

export function SignUpForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSendingCode, setIsSendingCode] = useState(false)
    const [codeSent, setCodeSent] = useState(false)
    const [alert, setAlert] = useState<AlertState>({ type: null, message: '' })
    const [resendTimer, setResendTimer] = useState(0)
    const [showAlertModal, setShowAlertModal] = useState(false)
    const codeInputRef = useRef<HTMLInputElement>(null)
    const { register, handleSubmit, getValues, watch, formState: { errors }, } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            code: "",
        },
    })
    const watchedValues = watch(['name', 'email', 'password', 'confirmPassword'])
    const isFormValid = watchedValues.every(value => value && value.trim() !== '') &&
        !errors.name && !errors.email && !errors.password && !errors.confirmPassword
    const password = watch('password')
    const passwordRequirements: PasswordRequirement[] = getPasswordRequirements(password)
    const passwordStrength = getPasswordStrength(password)
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer(prev => prev - 1)
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [resendTimer])
    useEffect(() => {
        if (codeSent && codeInputRef.current) {
            setTimeout(() => {
                codeInputRef.current?.focus()
            }, 100)
        }
    }, [codeSent])
    useEffect(() => {
        if (alert.type) {
            setShowAlertModal(true)
        }
    }, [alert])
    const handleSendCode = async () => {
        const email = getValues("email")

        if (!email || !isValidEmail(email)) {
            setAlert({
                type: 'error',
                message: 'Please enter a valid email address first'
            })
            return
        }

        if (resendTimer > 0) {
            setAlert({
                type: 'error',
                message: `Please wait ${resendTimer} seconds before requesting another code`
            })
            return
        }

        setIsSendingCode(true)
        setAlert({ type: null, message: '' })

        try {
            const response = await fetch("/api/send-code", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email }),
            })

            const result = await response.json()

            if (response.ok && result.success) {
                setCodeSent(true)
                setResendTimer(60)
                setAlert({
                    type: 'success',
                    message: 'Verification code sent to your email successfully!'
                })
            } else {
                setAlert({
                    type: 'error',
                    message: result.error || 'Failed to send verification code. Please try again.'
                })
            }
        } catch (error) {
            console.error('Network error:', error)
            setAlert({
                type: 'error',
                message: 'Network error. Please check your connection and try again.'
            })
        } finally {
            setIsSendingCode(false)
        }
    }
    const handleResendCode = async () => {
        if (resendTimer > 0) return
        await handleSendCode()
    }
    const onSubmit = async (data: SignUpFormData) => {
        setIsLoading(true)
        setAlert({ type: null, message: '' })
        try {
            const signUpError = await signUp({
                ...data,
                code: codeSent ? data.code : undefined
            })
            if (signUpError) {
                setAlert({
                    type: 'error',
                    message: signUpError
                })
                setIsLoading(false)
                return
            }
            setAlert({
                type: 'success',
                message: 'Account created successfully! Redirecting...'
            })
            setTimeout(() => {
                window.location.href = "/"
            }, 1500)
        } catch (error) {
            setAlert({
                type: 'error',
                message: 'An unexpected error occurred. Please try again.'
            })
            setIsLoading(false)
        }
    }
    const closeAlertModal = () => {
        setShowAlertModal(false)
        setAlert({ type: null, message: '' })
    }
    return (
        <>
            {showAlertModal && alert.type && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-start gap-3">
                            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${alert.type === 'error' ? 'bg-red-100 dark:bg-red-900/20' : 'bg-green-100 dark:bg-green-900/20'}`}>
                                {alert.type === 'error' ? (
                                    <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                                ) : (
                                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className={`text-sm font-medium ${alert.type === 'error' ? 'text-red-800 dark:text-red-200' : 'text-green-800 dark:text-green-200'}`}>
                                    {alert.type === 'error' ? 'Error' : 'Success'}
                                </h3>
                                <p className={`mt-1 text-sm ${alert.type === 'error' ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300'}`}>
                                    {alert.message}
                                </p>
                            </div>
                            <button onClick={closeAlertModal} className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Button onClick={closeAlertModal} variant="outline" size="sm" className={`${alert.type === 'error' ? 'border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/20' : 'border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-900/20'}`}>
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                        Full Name
                    </Label>
                    <Input id="name" type="text"{...register("name")} placeholder="Enter your full name" disabled={isLoading} className={errors.name ? 'border-red-300 focus-visible:ring-red-500' : ''} />
                    {errors.name && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                            <XCircle className="h-3 w-3" />
                            {errors.name.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                        Email Address
                    </Label>
                    <Input id="email" type="email"{...register("email")} placeholder="Enter your email address" disabled={isLoading} className={errors.email ? 'border-red-300 focus-visible:ring-red-500' : ''} />
                    {errors.email && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                            <XCircle className="h-3 w-3" />
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                        Password
                    </Label>
                    <div className="relative">
                        <Input id="password" type={showPassword ? "text" : "password"}{...register("password")} placeholder="Create a strong password" className={`pr-10 ${errors.password ? 'border-red-300 focus-visible:ring-red-500' : ''}`} disabled={isLoading} />
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
                    <Input id="confirmPassword" type="password"{...register("confirmPassword")} placeholder="Confirm your password" className={errors.confirmPassword ? 'border-red-300 focus-visible:ring-red-500' : ''} disabled={isLoading} />
                    {errors.confirmPassword && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                            <XCircle className="h-3 w-3" />
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Email Verification
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            We'll send a code to verify your email
                        </p>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={handleSendCode} disabled={codeSent || isSendingCode || !isFormValid || isLoading} className="min-w-[120px]">
                        {isSendingCode && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {!isSendingCode && !codeSent && <Mail className="mr-2 h-4 w-4" />}
                        {codeSent ? "Code Sent" : "Send Code"}
                    </Button>
                </div>

                {codeSent && (
                    <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="code" className="text-sm font-medium">
                                Enter Verification Code
                            </Label>
                            <Button type="button" variant="link" size="sm" onClick={handleResendCode} disabled={resendTimer > 0 || isSendingCode || isLoading} className="h-auto p-0 text-xs text-gray-600 dark:text-gray-400">
                                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
                            </Button>
                        </div>
                        <Input id="code" type="text"{...register("code", { required: codeSent })} placeholder="000000" maxLength={6} autoComplete="off" disabled={isLoading} className={`text-center tracking-[0.5em] font-mono text-lg h-12 ${errors.code ? 'border-red-300 focus-visible:ring-red-500' : ''}`}
                            ref={e => {
                                register("code", { required: codeSent }).ref(e);
                                codeInputRef.current = e;
                            }}
                        />
                        {errors.code && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <XCircle className="h-3 w-3" />
                                {errors.code.message}
                            </p>
                        )}
                    </div>
                )}

                <Button type="submit" className="w-full px-4" disabled={isLoading || (codeSent && !getValues("code"))}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
                <div className="my-2 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
                <GoogleLoginButton />
            </form>
        </>
    )
}