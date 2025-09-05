"use client"
import { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Iridescence from "@/components/ui/Iridescence"

interface AuthLayoutProps {
    children: ReactNode
    title: string
    subtitle: string
    backHref?: string
    topRightContent?: ReactNode
    mode?: "default" | "reset" | "forgot"
}

const iridescenceColors: Record<string, [number, number, number]> = {
    default: [0.576, 0.773, 0.992], // #93c5fd
    reset: [0.976, 0.659, 0.831],   // #f9a8d4
    forgot: [0.992, 0.902, 0.541],  // #fde68a
};

export function AuthLayout({ children, title, subtitle, backHref = "/sign-in", topRightContent, mode = "default" }: AuthLayoutProps) {
    const pathname = usePathname()
    const elasticTransition = {
        type: "spring",
        damping: 25,
        stiffness: 120,
        mass: 0.8
    } as const
    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-muted)]">
            <div className="w-full max-w-6xl flex rounded-3xl overflow-hidden shadow-xl bg-[var(--color-background)] relative">
                <motion.div className="flex-1 flex flex-col justify-center px-12 py-16 z-10 bg-[var(--color-background)] text-[var(--color-foreground)]" layout>
                    <div className="w-full max-w-md mx-auto">
                        <motion.div className="mb-8 flex items-center justify-between" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ ...elasticTransition, delay: 0.1 }}                        >
                            <Link href={backHref} aria-label="Back">
                                <motion.button className="text-2xl text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]" whileHover={{ scale: 1.1, x: -2 }} whileTap={{ scale: 0.95 }}>
                                    &#8592;
                                </motion.button>
                            </Link>
                            {topRightContent && (
                                <motion.span className="text-sm text-[var(--color-muted-foreground)]" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ ...elasticTransition, delay: 0.15 }}>
                                    {topRightContent}
                                </motion.span>
                            )}
                        </motion.div>

                        <motion.h1 className="text-4xl font-bold mb-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...elasticTransition, delay: 0.2 }} layout>
                            {title}
                        </motion.h1>

                        <motion.p className="text-[var(--color-muted-foreground)] mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...elasticTransition, delay: 0.25 }} layout>
                            {subtitle}
                        </motion.p>

                        <AnimatePresence mode="wait">
                            <motion.div key={pathname} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={elasticTransition} layout>
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>
                <AnimatedBackground mode={mode} pathname={pathname} />
            </div >
        </div >
    )
}

function AnimatedBackground({ mode = "default", pathname }: { mode?: string, pathname: string }) {
    return (
        <motion.div className="auth-bg hidden md:flex flex-col flex-1 items-center justify-center relative overflow-hidden" layout>
            <Iridescence
                color={iridescenceColors[mode] || iridescenceColors.default}
                mouseReact={false}
                amplitude={0.1}
                speed={1.0}
            />
        </motion.div>
    )
}