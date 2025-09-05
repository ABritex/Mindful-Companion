import { ProfileForm } from "@/features/profile/components/profile-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function EditProfilePage() {
    return (
        <div className="container mx-auto py-8">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <ProfileForm />
                </CardContent>
            </Card>
        </div>
    )
} 