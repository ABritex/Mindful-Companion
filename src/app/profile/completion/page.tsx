import { ProfileForm } from "@/features/profile/components/profile-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProfileCompletionPage() {
    return (
        <div className="container mx-auto p-4 max-w-[750px]">
            <Card>
                <CardHeader>
                    <CardTitle>Complete Your Profile</CardTitle>
                    <CardDescription>
                        Please provide your information to complete your profile.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ProfileForm />
                </CardContent>
            </Card>
        </div>
    )
} 