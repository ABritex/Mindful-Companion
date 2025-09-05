import { NavbarWrapper } from "@/components/navbar/desktop/navbar-wrapper"

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            <NavbarWrapper />
            <main className="flex-1">{children}</main>
        </div>
    )
} 