"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { useIsMobile } from "@/lib/hooks/useIsMobile"

export function FloatingThemeToggle({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    const { resolvedTheme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)
    const [hovered, setHovered] = React.useState<"dark" | "light" | null>(null)
    const [animating, setAnimating] = React.useState<"dark" | "light" | null>(null)
    const isMobile = useIsMobile()

    React.useEffect(() => { setMounted(true) }, [])

    const isDark = resolvedTheme === "dark"
    // Where to put the glow: left for dark, right for light, or animate to hovered
    const active = hovered ? hovered : (isDark ? "dark" : "light")

    // Always call the effect, but only run animation logic if mounted
    React.useEffect(() => {
        if (!mounted) return
        setAnimating(isDark ? "dark" : "light")
        const timeout = setTimeout(() => setAnimating(null), 350)
        return () => clearTimeout(timeout)
    }, [isDark, mounted])

    // Only return null after all hooks
    if (!mounted) return null

    return (
        <div className={cn("fixed bottom-6 left-6 z-50", className)} {...props}>
            {isMobile ? (
                <button
                    type="button"
                    className={cn(
                        "flex items-center justify-center w-12 h-12 rounded-md shadow-lg bg-background/80 backdrop-blur border border-gray-300 dark:border-gray-700 transition-colors duration-300"
                    )}
                    aria-label="Toggle dark/light mode"
                    onClick={() => setTheme(isDark ? "light" : "dark")}
                >
                    {isDark ? (
                        <Moon className="h-7 w-7 text-indigo-600 transition-all duration-300" />
                    ) : (
                        <Sun className="h-7 w-7 text-yellow-400 transition-all duration-300" />
                    )}
                </button>
            ) : (
                <button
                    type="button"
                    className={
                        cn(
                            "relative flex items-center justify-between w-36 h-12 px-0 border border-gray-300 dark:border-gray-700 bg-background/80 backdrop-blur shadow-lg transition-colors duration-300",
                            "rounded-md overflow-hidden select-none font-semibold text-base group"
                        )
                    }
                    aria-label="Toggle dark/light mode"
                    onClick={() => setTheme(isDark ? "light" : "dark")}
                    onMouseLeave={() => setHovered(null)}
                >
                    {/* Enhanced Spotlight highlight */}
                    <span
                        className="absolute bottom-1 h-2 w-16 rounded-full pointer-events-none transition-all duration-500 ease-[cubic-bezier(.4,1.6,.6,1)] group-hover:scale-110 group-hover:blur-[10px]"
                        style={{
                            left: active === "dark" ? 12 : 76,
                            background: "radial-gradient(ellipse at center, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 80%, transparent 100%)",
                            filter: "blur(8px)",
                            zIndex: 0,
                            opacity: hovered ? 1 : 0.85,
                            transitionProperty: 'left, filter, opacity, transform',
                        }}
                    />
                    <span
                        className={cn(
                            "relative z-10 flex-1 text-center transition-colors duration-300 cursor-pointer inline-block",
                            active === "dark" ? "text-white" : "text-gray-400",
                            animating === "dark" && "animate-theme-bounce"
                        )}
                        onMouseEnter={() => setHovered("dark")}
                        style={{
                            transition: 'color 0.3s, transform 0.35s',
                            transform: animating === "dark" ? 'scale(1.08)' : 'scale(1)',
                            opacity: animating === "dark" ? 0.85 : 1,
                        }}
                    >
                        Dark
                    </span>
                    <span
                        className={cn(
                            "relative z-10 flex-1 text-center transition-colors duration-300 cursor-pointer inline-block",
                            active === "light" ? "text-gray-900" : "text-gray-400",
                            animating === "light" && "animate-theme-bounce"
                        )}
                        onMouseEnter={() => setHovered("light")}
                        style={{
                            transition: 'color 0.3s, transform 0.35s',
                            transform: animating === "light" ? 'scale(1.08)' : 'scale(1)',
                            opacity: animating === "light" ? 0.85 : 1,
                        }}
                    >
                        Light
                    </span>
                </button>
            )}
            {/* Add keyframes for theme bounce animation */}
            <style>{`
                @keyframes theme-bounce {
                    0% { transform: scale(1); opacity: 1; }
                    40% { transform: scale(1.15); opacity: 0.7; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-theme-bounce {
                    animation: theme-bounce 0.35s cubic-bezier(.4,1.6,.6,1);
                }
            `}</style>
        </div>
    )
} 