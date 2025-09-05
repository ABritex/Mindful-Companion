"use client"

import * as React from "react"
import { motion } from "framer-motion"
import Link from "next/link"

interface NavbarHoverProps {
    items: { id: string; label: string; href?: string }[]
    onItemHover: (id: string | null) => void
}

export function NavbarHover({ items, onItemHover }: NavbarHoverProps) {
    const [hoveredItem, setHoveredItem] = React.useState<string | null>(null)
    const [hoverPosition, setHoverPosition] = React.useState({ x: 0, width: 0, height: 0 })
    const [isDropdownHovered, setIsDropdownHovered] = React.useState(false)
    const containerRef = React.useRef<HTMLDivElement>(null)
    const itemRefs = React.useRef<Map<string, HTMLDivElement>>(new Map())
    const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
    const handleMouseEnter = (id: string) => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current)
            closeTimeoutRef.current = null
        }
        const itemElement = itemRefs.current.get(id)
        if (itemElement && containerRef.current) {
            const rect = itemElement.getBoundingClientRect()
            const containerRect = containerRef.current.getBoundingClientRect()
            setHoveredItem(id)
            setHoverPosition({
                x: rect.left - containerRect.left,
                width: rect.width,
                height: rect.height,
            })
            onItemHover(id)
        }
    }
    const handleMouseLeave = () => {
        closeTimeoutRef.current = setTimeout(() => {
            if (!isDropdownHovered) {
                setHoveredItem(null)
                onItemHover(null)
            }
        }, 150)
    }
    const handleBridgeEnter = () => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current)
            closeTimeoutRef.current = null
        }
    }
    React.useEffect(() => {
        window.navbarDropdownHover = {
            setDropdownHovered: (hovered: boolean) => {
                setIsDropdownHovered(hovered)
                if (hovered && closeTimeoutRef.current) {
                    clearTimeout(closeTimeoutRef.current)
                    closeTimeoutRef.current = null
                }
            },
            closeDropdown: () => {
                closeTimeoutRef.current = setTimeout(() => {
                    setHoveredItem(null)
                    onItemHover(null)
                }, 100)
            },
        }

        return () => {
            delete window.navbarDropdownHover
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current)
            }
        }
    }, [onItemHover])

    return (
        <div ref={containerRef} onMouseLeave={handleMouseLeave} className="relative flex items-center justify-center" style={{ minWidth: "max-content", transform: "translateZ(0)", backfaceVisibility: "hidden", WebkitFontSmoothing: "subpixel-antialiased" }}>
            {items.map((item) => (
                <div key={item.id} ref={(el) => {
                    if (el) itemRefs.current.set(item.id, el)
                    else itemRefs.current.delete(item.id)
                }} onMouseEnter={() => handleMouseEnter(item.id)} className="relative z-10" style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", }}>
                    {item.href ? (
                        <Link href={item.href} className="cursor-pointer text-foreground px-4 py-2 select-none h-8 flex items-center justify-center whitespace-nowrap" style={{ textAlign: "center", lineHeight: "1", minWidth: "max-content", transform: "translateZ(0)" }}>
                            {item.label}
                        </Link>
                    ) : (
                        <div className="cursor-pointer text-foreground px-4 py-2 select-none h-8 flex items-center justify-center whitespace-nowrap" style={{ textAlign: "center", lineHeight: "1", minWidth: "max-content", transform: "translateZ(0)" }}>
                            {item.label}
                        </div>
                    )}
                </div>
            ))
            }
            {
                hoveredItem && (
                    <motion.div className="absolute bg-muted rounded-md pointer-events-none" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1, x: hoverPosition.x, width: hoverPosition.width, height: hoverPosition.height, }} transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.8, }} style={{ position: "absolute", top: 0, left: 0, zIndex: 0, transform: "translateZ(0)", willChange: "transform, opacity", }} />
                )
            }
            {
                hoveredItem && (
                    <div className="absolute top-full left-0 w-full h-4 z-30 pointer-events-auto" onMouseEnter={handleBridgeEnter} />
                )
            }
        </div >
    )
}

declare global {
    interface Window {
        navbarDropdownHover?: {
            setDropdownHovered: (hovered: boolean) => void
            closeDropdown: () => void
        }
    }
}