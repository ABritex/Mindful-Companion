import { z } from "zod"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

// Employee ID format: MA22-IT-02673
const employeeIdRegex = /^[A-Z]{2}\d{2}-[A-Z]{2}-\d{5}$/

export const profileFormSchema = z.object({
    employeeId: z
        .string()
        .min(1, "Employee ID is required")
        .regex(employeeIdRegex, "Employee ID must be in the format: MA22-IT-02673"),
    name: z
        .string()
        .min(1, "Name is required")
        .regex(/^[A-Za-z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes")
        .max(100, "Name must be less than 100 characters"),
    campus: z.enum(["Main", "North", "South", "East", "West"]),
    officeOrDept: z.string().min(1, "Department is required"),
    profilePicture: z
        .string()
        .nullable()
        .refine(
            (value) => {
                if (!value) return true
                try {
                    const base64Data = value.split(",")[1]
                    const binaryData = atob(base64Data)
                    return binaryData.length <= MAX_FILE_SIZE
                } catch {
                    return false
                }
            },
            {
                message: "Profile picture must be less than 5MB",
            }
        )
        .refine(
            (value) => {
                if (!value) return true
                try {
                    const mimeType = value.split(";")[0].split(":")[1]
                    return ACCEPTED_IMAGE_TYPES.includes(mimeType)
                } catch {
                    return false
                }
            },
            {
                message: "Profile picture must be a valid image file (JPEG, PNG, or WebP)",
            }
        ),
})

export type ProfileFormData = z.infer<typeof profileFormSchema> 