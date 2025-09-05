export type PasswordRequirement = {
    label: string
    met: boolean
}

export function getPasswordRequirements(password: string): PasswordRequirement[] {
    return [
        {
            label: "At least 8 characters long",
            met: password.length >= 8
        },
        {
            label: "Contains at least 1 uppercase letter",
            met: /[A-Z]/.test(password)
        },
        {
            label: "Contains at least 1 lowercase letter",
            met: /[a-z]/.test(password)
        },
        {
            label: "Contains at least 1 number",
            met: /\d/.test(password)
        },
        {
            label: "Contains at least 1 special character",
            met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        }
    ]
}

export function getPasswordStrength(password: string): number {
    const requirements = getPasswordRequirements(password)
    const met = requirements.filter(r => r.met).length
    return password.length > 0 ? Math.round((met / requirements.length) * 100) : 0
} 