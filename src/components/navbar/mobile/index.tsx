import * as React from "react"
import { Menu as MenuIcon, UserCircle, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AuthButtons } from "@/components/navbar/AuthButtons"
import { MobileMenuOverlay } from "@/components/navbar/mobile/MobileMenuOverlay"

interface MobileMenuProps {
    user: {
        id: string
        email: string
        name: string | null
        role: "admin" | "user"
    } | null
}

export function MobileMenu({ user }: MobileMenuProps) {
    const [open, setOpen] = React.useState(false)
    const notifications = [
        { id: 1, title: "New Message" },
        { id: 2, title: "Appointment Reminder" },
    ]
    return (
        <>
            <div className="flex items-center justify-between w-full h-14 px-4 bg-background/80 backdrop-blur border-b border-gray-200 dark:border-gray-700 md:hidden fixed top-0 left-0 z-50">
                <button className="flex items-center justify-center h-10 w-10 rounded-xl bg-black text-white border border-white/10 shadow hover:bg-black/90 transition" onClick={() => setOpen(true)} aria-label="Open menu"   >
                    <MenuIcon className="h-6 w-6" />
                </button>
                <div className="flex items-center gap-2">
                    {user ? (
                        <>
                            <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full">
                                <Bell className="h-6 w-6" />
                                {notifications.length > 0 && (
                                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"         >
                                        {notifications.length}
                                    </Badge>
                                )}
                            </Button>
                            <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src="/avatars/01.png" alt={user.name || "User"} />
                                    <AvatarFallback>
                                        <UserCircle className="h-6 w-6" />
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </>
                    ) : (
                        <AuthButtons />
                    )}
                </div>
            </div>
            <MobileMenuOverlay open={open} onClose={() => setOpen(false)} user={user} />
        </>
    )
} 