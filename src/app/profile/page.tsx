import { getProfile } from "@/features/profile/actions/action"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PreAssessmentTrigger } from "@/components/PreAssessmentTrigger"

export default async function ProfilePage() {
    const { data: profile, error } = await getProfile()

    if (error) {
        return <div>Error loading profile: {error}</div>
    }

    if (!profile) {
        return <div>Profile not found</div>
    }

    return (
        <div className="container mx-auto py-8">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center space-y-6">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={profile.profilePicture || ""} alt={profile.name || "User"} />
                            <AvatarFallback>
                                <UserCircle className="h-12 w-12" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold">{profile.name}</h2>
                            <p className="text-muted-foreground">{profile.email}</p>
                        </div>
                        <div className="w-full space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Employee ID</p>
                                    <p>{profile.employeeId}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Campus</p>
                                    <p>{profile.campus}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Office/Department</p>
                                    <p>{profile.officeOrDept}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button asChild>
                                <Link href="/profile/edit-profile">Edit Profile</Link>
                            </Button>
                            <PreAssessmentTrigger />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
} 