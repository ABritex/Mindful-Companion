"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, MenuItem, HoveredLink } from "./navbar-menu"
import { NAV_ITEMS } from "@/components/navbar/nav-items"
import { AuthButtons } from "@/components/navbar/AuthButtons"
import { LogOutButton } from "@/services/auth/components/LogOutButton"
import { MobileMenu } from "@/components/navbar/mobile"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Bell, UserCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface NavbarProps {
    user: {
        id: string
        email: string
        name: string | null
        role: "admin" | "user"
    } | null
}

function Navbar({ user }: NavbarProps) {
    const [active, setActive] = React.useState<string | null>(null)
    const notifications = [
        {
            id: 1,
            title: "New Message",
            description: "You have a new message from John",
            time: "2 minutes ago",
        },
        {
            id: 2,
            title: "Appointment Reminder",
            description: "Your therapy session is tomorrow at 2 PM",
            time: "1 hour ago",
        },
    ]

    // Generate navItems for NavbarHover
    const navItems = NAV_ITEMS.map(section => ({
        id: section.section,
        label: section.section,
        href: section.href,
    }))

    return (
        <div className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 bg-background/80 backdrop-blur">
            <div className="md:hidden w-full">
                <MobileMenu user={user} />
            </div>
            <div className="hidden md:flex w-full container mx-auto px-4 h-16 items-center justify-between" style={{ borderBottom: '1px solid var(--muted)', color: 'var(--foreground)' }}>
                <div className="flex-shrink-0">
                    <Link href="/" className="flex items-center gap-3 group">
                        <Image src="/next.svg" alt="Mindful Companion Logo" width={40} height={40} className="rounded-full object-cover w-10 h-10 transition-transform duration-300 group-hover:scale-110" />
                        <div className="flex flex-col">
                            <span className="font-heading font-bold text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                Mindful
                            </span>
                            <span className="font-heading font-semibold text-sm text-muted-foreground -mt-1">
                                Companion
                            </span>
                        </div>
                    </Link>
                </div>
                <div className="flex items-center justify-center flex-1">
                    <Menu setActive={setActive} navItems={navItems}>
                        {NAV_ITEMS.map(section => (
                            <MenuItem key={section.section} setActive={setActive} active={active} item={section.section}>
                                <div className="grid grid-cols-2 gap-6 min-w-[400px]">
                                    {section.links && section.links.map(link => (
                                        <HoveredLink key={link.href} href={link.href}>{link.label}</HoveredLink>
                                    ))}
                                </div>
                            </MenuItem>
                        ))}
                    </Menu>
                </div>
                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <Bell className="h-5 w-5" />
                                        {notifications.length > 0 && (
                                            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"       >
                                                {notifications.length}
                                            </Badge>
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-80" align="end" forceMount>
                                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {notifications.length > 0 ? (
                                        notifications.map((notification) => (
                                            <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-4">
                                                <div className="font-medium text-foreground">{notification.title}</div>
                                                <div className="text-sm text-muted-foreground">{notification.description}</div>
                                                <div className="text-xs text-muted-foreground mt-1">{notification.time}</div>
                                            </DropdownMenuItem>
                                        ))
                                    ) : (
                                        <DropdownMenuItem className="text-center text-muted-foreground">
                                            No new notifications
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-center">
                                        <Link href="/notifications" className="w-full">View all notifications</Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src="/avatars/01.png" alt={user.name || "User"} />
                                            <AvatarFallback>
                                                <UserCircle className="h-6 w-6" />
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile">Profile</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile/edit-profile">Edit Profile</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <LogOutButton />
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <AuthButtons />
                    )}
                </div>
            </div>
        </div>
    )
}

export { Navbar }
