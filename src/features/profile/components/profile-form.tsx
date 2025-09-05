"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCurrentUser } from "@/services/auth/lib/useCurrentUser"
import { readFileAsDataURL } from "../lib/utils"
import { CAMPUSES, DEPARTMENTS } from "../data/constants"
import { updateProfile, deleteProfilePicture } from "../actions/action"
import { toast } from "sonner"
import type { ProfileFormData } from "../actions/schemas"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { profileFormSchema } from "../actions/schemas"
import { Loader2 } from "lucide-react"

export function ProfileForm() {
    const router = useRouter()
    const { user, loading } = useCurrentUser()
    const [image, setImage] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)
    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<ProfileFormData>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            employeeId: "",
            name: "",
            campus: "Main",
            officeOrDept: "",
            profilePicture: null,
        },
    })

    // Update form when user data is loaded
    useEffect(() => {
        if (user) {
            reset({
                name: user.name || "",
                campus: user.campus || "Main",
                officeOrDept: user.officeOrDept || "",
                profilePicture: user.profilePicture || null,
                employeeId: "", // Always start with empty employee ID
            })
            setImage(user.profilePicture || null)
        }
    }, [user, reset])

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            try {
                const dataUrl = await readFileAsDataURL(file)
                setImage(dataUrl)
                setValue("profilePicture", dataUrl)
            } catch {
                toast.error("Failed to read image file")
            }
        }
    }

    const handleRemoveImage = async () => {
        try {
            const result = await deleteProfilePicture()
            if (result.error) {
                toast.error(result.error)
                return
            }
            setImage(null)
            setValue("profilePicture", null)
            toast.success("Profile picture removed")
        } catch {
            toast.error("Failed to delete profile picture")
        }
    }

    const onSubmit = async (data: ProfileFormData) => {
        setSaving(true)
        try {
            const result = await updateProfile({
                ...data,
                profilePicture: image,
            })

            if (result.error) {
                toast.error(result.error)
                return
            }

            toast.success("Profile updated successfully")
            router.push("/")
        } catch {
            toast.error("Failed to update profile")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (!user) {
        return (
            <div className="text-center p-8">
                <p className="text-red-500">Please sign in to access your profile</p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={image || ""} alt={user.name || "Profile"} />
                    <AvatarFallback>{user.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                        {user.name}
                    </p>
                    <div className="flex gap-2">
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="profile-picture" />
                        <Button type="button" variant="outline" onClick={() => document.getElementById("profile-picture")?.click()}>
                            Change Photo
                        </Button>
                        {image && (
                            <Button type="button" variant="destructive" onClick={handleRemoveImage} >
                                Remove
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input id="employeeId" {...register("employeeId")} placeholder="Enter your employee ID" className="uppercase" onChange={(e) => {
                    const value = e.target.value.toUpperCase()
                    const formatted = value
                        .replace(/[^A-Z0-9-]/g, '')
                        .replace(/([A-Z]{2}\d{2})([A-Z]{2})/, '$1-$2')
                        .replace(/([A-Z]{2}\d{2}-[A-Z]{2})(\d{5})/, '$1-$2')
                    setValue("employeeId", formatted)
                }} />
                {errors.employeeId && (
                    <p className="text-sm text-red-500">{errors.employeeId.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register("name")} placeholder="Enter your name" />
                {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="campus">Campus</Label>
                <Select onValueChange={(value: "Main" | "North" | "South" | "East" | "West") => setValue("campus", value)} defaultValue={user.campus || "Main"}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a campus" />
                    </SelectTrigger>
                    <SelectContent>
                        {CAMPUSES.map((campus) => (
                            <SelectItem key={campus.value} value={campus.value}>
                                {campus.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.campus && (
                    <p className="text-sm text-red-500">{errors.campus.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="officeOrDept">Office/Department</Label>
                <Select onValueChange={(value) => setValue("officeOrDept", value)} defaultValue={user.officeOrDept || ""}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                    <SelectContent>
                        {DEPARTMENTS.map((dept) => (
                            <SelectItem key={dept.value} value={dept.value}>
                                {dept.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.officeOrDept && (
                    <p className="text-sm text-red-500">{errors.officeOrDept.message}</p>
                )}
            </div>

            {errors.profilePicture && (
                <p className="text-sm text-red-500">{errors.profilePicture.message}</p>
            )}

            <Button type="submit" className="w-full" disabled={saving}>
                {saving ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                    </>
                ) : (
                    "Save Profile"
                )}
            </Button>
        </form>
    )
} 