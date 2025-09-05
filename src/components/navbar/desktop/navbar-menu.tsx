"use client"
import * as React from "react"
import { motion, type Transition } from "framer-motion"
import { NavbarHover } from "./navbar-hover"

const transition: Transition = {
    type: "spring",
    mass: 0.5,
    damping: 11.5,
    stiffness: 100,
    restDelta: 0.001,
    restSpeed: 0.001,
}

interface MenuItemProps {
    setActive: (item: string | null) => void
    active: string | null
    item: string
    children?: React.ReactNode
}

const MenuItem = ({ active, item, setActive, children }: MenuItemProps) => {
    // Fix 1: Use state to track if component is mounted (client-side)
    const [isMounted, setIsMounted] = React.useState(false)

    React.useEffect(() => {
        setIsMounted(true)
    }, [])

    const handleDropdownEnter = () => {
        // Fix 2: Add safety check for window object
        if (typeof window !== 'undefined' && window.navbarDropdownHover) {
            window.navbarDropdownHover.setDropdownHovered(true)
        }
        setActive(item)
    }

    const handleDropdownLeave = () => {
        // Fix 3: Add safety check for window object
        if (typeof window !== 'undefined' && window.navbarDropdownHover) {
            window.navbarDropdownHover.setDropdownHovered(false)
            window.navbarDropdownHover.closeDropdown()
        }
    }

    // Fix 4: Don't render dropdown content until mounted on client
    if (!isMounted) {
        return <div className="relative" />
    }

    return (
        <div className="relative">
            {active !== null && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.85, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={transition}
                >
                    {active === item && (
                        <div
                            className="absolute top-[calc(100%_+_1.5rem)] left-1/2 transform -translate-x-1/2 z-50"
                            onMouseEnter={handleDropdownEnter}
                            onMouseLeave={handleDropdownLeave}
                        >
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-full h-6 pointer-events-auto" />
                            <motion.div
                                transition={transition}
                                layoutId="active"
                                className="backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl pointer-events-auto border"
                                style={{
                                    background: 'var(--background)',
                                    color: 'var(--foreground)',
                                    borderColor: 'var(--muted)'
                                }}
                            >
                                <motion.div layout className="w-max h-full p-4">
                                    {children}
                                </motion.div>
                            </motion.div>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    )
}

interface MenuProps {
    setActive: (item: string | null) => void
    children: React.ReactNode
    navItems: { id: string; label: string; href?: string }[]
}

const Menu = ({ setActive, children, navItems }: MenuProps) => {
    return (
        <nav className="relative">
            <NavbarHover items={navItems} onItemHover={setActive} />
            <div className="relative">{children}</div>
        </nav>
    )
}

export { Menu, MenuItem }

interface HoveredLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    children: React.ReactNode
}

export const HoveredLink = ({ children, className = "", ...rest }: HoveredLinkProps) => {
    return (
        <a
            {...rest}
            className={`text-neutral-700 dark:text-neutral-200 hover:text-black dark:hover:text-white cursor-pointer transition-colors duration-200 block py-1 ${className}`}
        >
            {children}
        </a>
    )
}
