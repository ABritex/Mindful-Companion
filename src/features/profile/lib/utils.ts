import type { User } from "@/services/auth/lib/useCurrentUser"
import type { ProfileFormData } from "../actions/schemas"

export function getInitialFormData(user: User | null): ProfileFormData {
    return {
        employeeId: user?.employeeId || "",
        name: user?.name || user?.email || "",
        campus: user?.campus || "Main",
        officeOrDept: user?.officeOrDept || "",
        profilePicture: user?.profilePicture || null,
    }
}

export function getInitialImage(user: User | null) {
    return user?.profilePicture || null
}

export function readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
} 