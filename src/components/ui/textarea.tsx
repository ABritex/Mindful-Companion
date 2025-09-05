"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    autoResize?: boolean
    maxHeight?: number
    minHeight?: number
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, autoResize = false, maxHeight = 120, minHeight = 52, ...props }, ref) => {
        const textareaRef = React.useRef<HTMLTextAreaElement>(null)
        const combinedRef = React.useMemo(() => ref || textareaRef, [ref]) as React.RefObject<HTMLTextAreaElement>

        // Auto-resize functionality
        React.useEffect(() => {
            if (!autoResize) return

            const textarea = combinedRef.current
            if (textarea) {
                // Reset height to auto to get the correct scrollHeight
                textarea.style.height = "auto"

                // Calculate new height within bounds
                const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight)

                textarea.style.height = newHeight + "px"

                // Add scrollbar if content exceeds maxHeight
                textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden"
            }
        }, [props.value, autoResize, maxHeight, minHeight, combinedRef])

        return (
            <textarea
                className={cn(
                    "flex w-full rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-all duration-200",
                    className
                )}
                style={{
                    background: "var(--background)",
                    color: "var(--foreground)",
                    borderColor: "var(--muted)",
                    minHeight: autoResize ? minHeight : undefined,
                    maxHeight: autoResize ? maxHeight : undefined,
                }}
                ref={combinedRef}
                {...props}
            />
        )
    },
)

Textarea.displayName = "Textarea"

export { Textarea }
