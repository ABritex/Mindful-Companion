import { NavbarWrapper } from "@/components/navbar/desktop/navbar-wrapper"
import { ProfileCompletionBanner } from "@/services/auth/components/ProfileCompletionBanner"
import { FloatingThemeToggle } from "@/components/ui/floating-theme-toggle"
import { FloatingMessageButton } from "@/components/ui/floating-message-button"
import { PreAssessmentProvider } from "@/components/PreAssessmentProvider"

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <PreAssessmentProvider>
            <div className="min-h-screen flex flex-col">
                <ProfileCompletionBanner />
                <NavbarWrapper />
                <main className="flex-1">
                    {children}
                </main>
                <FloatingThemeToggle />
                <FloatingMessageButton />
            </div>
        </PreAssessmentProvider>
    )
} 