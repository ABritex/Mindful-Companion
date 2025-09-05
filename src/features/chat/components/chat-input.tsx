"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Paperclip, Mic } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatInputProps {
    onSubmit: (message: string) => void
    isLoading?: boolean
}

export function ChatInput({ onSubmit, isLoading }: ChatInputProps) {
    const [input, setInput] = React.useState("")
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return
        onSubmit(input)
        setInput("")
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    // Auto-resize textarea
    React.useEffect(() => {
        const textarea = textareaRef.current
        if (textarea) {
            textarea.style.height = "auto"
            textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px"
        }
    }, [input])

    return (
        <form onSubmit={handleSubmit} className="relative">
            <div
                className="relative rounded-2xl border shadow-lg hover:shadow-xl transition-all duration-200 focus-within:ring-2 focus-within:ring-[var(--primary)] focus-within:border-[var(--primary)]"
                style={{
                    background: "var(--background)",
                    borderColor: "var(--muted)",
                }}
            >
                <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                    className="min-h-[52px] max-h-[120px] resize-none border-0 bg-transparent px-4 py-3 pr-24 text-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                    disabled={isLoading}
                />

                <div className="absolute right-2 bottom-2 flex items-center gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
                        disabled={isLoading}
                    >
                        <Paperclip className="h-4 w-4" />
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
                        disabled={isLoading}
                    >
                        <Mic className="h-4 w-4" />
                    </Button>

                    <Button
                        type="submit"
                        size="icon"
                        disabled={isLoading || !input.trim()}
                        className={cn(
                            "h-8 w-8 transition-all duration-200",
                            input.trim() && !isLoading
                                ? "bg-[var(--primary)] hover:bg-[var(--primary)] text-[var(--primary-foreground)] shadow-lg hover:shadow-xl scale-100"
                                : "bg-[var(--muted)] text-[var(--muted-foreground)] scale-95",
                        )}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="flex items-center justify-between mt-2 px-2">
                <p className="text-xs text-[var(--muted-foreground)]">{input.length > 0 && `${input.length} characters`}</p>
                <p className="text-xs text-[var(--muted-foreground)]">Press Enter to send</p>
            </div>
        </form>
    )
}
