"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { signIn } from "@/services/auth/functions/actions"
import { GoogleLoginButton } from "@/services/auth/components/GoogleLoginButton"

const signInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
})

type SignInFormData = z.infer<typeof signInSchema>

export function SignInForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
    })

    const onSubmit = async (data: SignInFormData) => {
        setIsLoading(true)
        setError(null)

        try {
            const error = await signIn(data)
            if (error) {
                setError(error)
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : "An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email"{...register("email")} placeholder="Enter your email" />
                {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                    <Input id="password" type={showPassword ? "text" : "password"} {...register("password")} placeholder="Enter your password" className="pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
            </div>

            <div className="flex justify-end">
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                    Forgot password?
                </Link>
            </div>

            {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            <div className="my-2 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

            <GoogleLoginButton />


        </form>
    )
} 