import { SignUpForm } from "@/services/auth/components/forms/SignUpForm"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { AuthLayout } from "@/services/auth/components/AuthLayout"

export default function SignUp() {
    return (
        <AuthLayout title="Sign Up" subtitle="Secure Your Communications with Easymail" backHref="/"
            topRightContent={
                <>
                    Already member?{' '}
                    <Link href="/sign-in" className="text-[var(--color-primary)] font-semibold hover:underline">Sign in</Link>
                </>
            }
            mode="default">
            <Card className="shadow-none border-0 p-0 bg-transparent">
                <CardContent className="p-0">
                    <SignUpForm />
                </CardContent>
            </Card>
        </AuthLayout>
    )
}