"use client"
import * as React from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatMessageProps {
    content: string
    role: "user" | "assistant"
    timestamp: Date
}

export function ChatMessage({ content, role, timestamp }: ChatMessageProps) {
    const isUser = role === "user"

    return (
        <div className={cn("flex gap-4 group", isUser ? "justify-end" : "justify-start")}
            style={{
                // Optional: add a little spacing for mobile
                paddingLeft: isUser ? undefined : 4,
                paddingRight: isUser ? 4 : undefined,
            }}
        >
            {!isUser && (
                <Avatar className="w-8 h-8 border-2 border-[var(--background)] dark:border-[var(--background)] shadow-sm">
                    <AvatarFallback style={{ background: "var(--muted)", color: "var(--primary)" }}>
                        <Bot className="h-4 w-4" />
                    </AvatarFallback>
                </Avatar>
            )}

            <div className={cn("flex flex-col max-w-[80%] md:max-w-[70%]", isUser ? "items-end" : "items-start")}
            >
                <div
                    className={cn(
                        "rounded-2xl px-4 py-3 shadow-sm border backdrop-blur-sm transition-all duration-200 group-hover:shadow-md",
                        isUser
                            ? "rounded-br-md"
                            : "rounded-bl-md"
                    )}
                    style={
                        isUser
                            ? {
                                background: "var(--primary)",
                                color: "var(--primary-foreground)",
                                borderColor: "var(--primary)",
                            }
                            : {
                                background: "var(--background)",
                                color: "var(--foreground)",
                                borderColor: "var(--muted)",
                            }
                    }
                >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
                </div>

                <span
                    className={cn(
                        "text-xs mt-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                        isUser ? "text-right" : "text-left"
                    )}
                    style={{ color: "var(--muted-foreground)" }}
                >
                    {timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
            </div>

            {isUser && (
                <Avatar className="w-8 h-8 border-2 border-[var(--background)] dark:border-[var(--background)] shadow-sm">
                    <AvatarFallback style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
                        <User className="h-4 w-4" />
                    </AvatarFallback>
                </Avatar>
            )}
        </div>
    )
}
