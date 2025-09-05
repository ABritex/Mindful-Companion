import { Card, CardContent } from "@/components/ui/card"
import { SignInForm } from "@/services/auth/components/forms/SignInForm"
import Link from "next/link"
import { AuthLayout } from "@/services/auth/components/AuthLayout"

export default function SignIn() {
    return (
        <AuthLayout title="Sign In" subtitle="Welcome back! Please sign in to continue." backHref="/" topRightContent={
            <>
                Don&apos;t have an account?{' '}
                <Link href="/sign-up" className="text-[var(--color-primary)] font-semibold hover:underline">Sign up</Link>
            </>
        } mode="default">
            <Card className="shadow-none border-0 p-0 bg-transparent">
                <CardContent className="p-0">
                    <SignInForm />
                </CardContent>
            </Card>
        </AuthLayout>
    )
}