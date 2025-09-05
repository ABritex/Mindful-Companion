"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FloatingMessageButtonProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string
}

export function FloatingMessageButton({ className, ...props }: FloatingMessageButtonProps) {
    return (
        <div className={cn("fixed bottom-6 right-6 z-50", className)} {...props}>
            <Button asChild variant="default" size="icon" aria-label="Open chat" className="h-12 w-12  shadow-lg hover:shadow-xl transition-all">
                <Link href="/chat">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                    >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                </Link>
            </Button>
        </div>
    )
} 