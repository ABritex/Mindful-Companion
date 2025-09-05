"use client"

import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatMessage } from "@/features/chat/components/chat-message"
import { ChatInput } from "@/features/chat/components/chat-input"
import type { chatMessageSchema } from "@/features/chat/actions/schemas"
import type { z } from "zod"

type ChatMessage = z.infer<typeof chatMessageSchema>
import { sendMessage, createChatSession, getUserSessions, getSessionMessages } from "@/features/chat/actions/action"
import { generateMessageId } from "@/features/chat/lib/utils"
import { CHAT_CONSTANTS } from "@/features/chat/data/constants"
import { Plus, MessageCircle, Sparkles, Brain, Menu, X, ChevronLeft, ChevronRight, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useIsMobile } from "@/lib/hooks/useIsMobile"
import { toast } from "sonner"

interface ChatSession {
    id: string
    title: string
    createdAt: Date
    status: string
}

export default function ChatPage() {
    const [messages, setMessages] = React.useState<ChatMessage[]>([
        {
            id: generateMessageId(),
            content: CHAT_CONSTANTS.DEFAULT_SYSTEM_MESSAGE,
            role: "assistant" as const,
            timestamp: new Date(),
        },
    ])
    const [isLoading, setIsLoading] = React.useState(false)
    const [sessionId, setSessionId] = React.useState<string>("")
    const [selectedSession, setSelectedSession] = React.useState<string>("")
    const [sidebarOpen, setSidebarOpen] = React.useState(false)
    const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
    const [sessions, setSessions] = React.useState<ChatSession[]>([])
    const [isLoadingSessions, setIsLoadingSessions] = React.useState(true)
    const messagesEndRef = React.useRef<HTMLDivElement>(null)
    const isMobile = useIsMobile()

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    React.useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Load collapsed state from localStorage (desktop only)
    React.useEffect(() => {
        if (!isMobile) {
            const saved = localStorage.getItem("sidebar-collapsed")
            if (saved !== null) {
                setSidebarCollapsed(JSON.parse(saved))
            }
        }
    }, [isMobile])

    // Save collapsed state to localStorage (desktop only)
    React.useEffect(() => {
        if (!isMobile) {
            localStorage.setItem("sidebar-collapsed", JSON.stringify(sidebarCollapsed))
        }
    }, [sidebarCollapsed, isMobile])

    // Close mobile sidebar when switching to desktop
    React.useEffect(() => {
        if (!isMobile) {
            setSidebarOpen(false)
        }
    }, [isMobile])

    // Load user sessions on component mount
    React.useEffect(() => {
        loadUserSessions()
    }, [])

    // Load messages when session changes
    React.useEffect(() => {
        if (selectedSession) {
            loadSessionMessages(selectedSession)
        }
    }, [selectedSession])

    const loadUserSessions = async () => {
        try {
            setIsLoadingSessions(true)
            const result = await getUserSessions()
            if (result.success && result.sessions) {
                const formattedSessions = result.sessions.map(session => ({
                    ...session,
                    createdAt: new Date(session.createdAt)
                }))
                setSessions(formattedSessions)

                // Select the most recent session if available
                if (formattedSessions.length > 0) {
                    setSelectedSession(formattedSessions[0].id)
                    setSessionId(formattedSessions[0].id)
                }
            }
        } catch (error) {
            console.error("Error loading sessions:", error)
            toast.error("Failed to load chat sessions")
        } finally {
            setIsLoadingSessions(false)
        }
    }

    const loadSessionMessages = async (sessionId: string) => {
        try {
            const result = await getSessionMessages(sessionId)
            if (result.success && result.messages) {
                const formattedMessages = result.messages.map(msg => ({
                    id: msg.id,
                    content: msg.content,
                    role: msg.role as "user" | "assistant",
                    timestamp: new Date(msg.createdAt),
                    emotion: msg.emotion || undefined,
                    confidence: msg.confidence || undefined
                }))
                setMessages(formattedMessages)
            }
        } catch (error) {
            console.error("Error loading messages:", error)
            toast.error("Failed to load messages")
        }
    }

    const createNewSession = async () => {
        try {
            setIsLoading(true)
            const result = await createChatSession({
                title: `New Conversation ${new Date().toLocaleDateString()}`,
                context: {},
                metadata: {}
            })

            if (result.success && result.sessionId) {
                setSessionId(result.sessionId)
                setSelectedSession(result.sessionId)

                // Reset messages for new session
                setMessages([
                    {
                        id: generateMessageId(),
                        content: CHAT_CONSTANTS.DEFAULT_SYSTEM_MESSAGE,
                        role: "assistant",
                        timestamp: new Date(),
                    },
                ])

                // Reload sessions to include the new one
                await loadUserSessions()

                toast.success("New conversation started!")
            } else {
                toast.error(result.error || "Failed to create new session")
            }
        } catch (error) {
            console.error("Error creating new session:", error)
            toast.error("Failed to create new session")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSendMessage = async (content: string) => {
        if (!sessionId) {
            toast.error("No active session. Please create a new conversation.")
            return
        }

        const userMessage: ChatMessage = {
            id: generateMessageId(),
            content,
            role: "user",
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMessage])
        setIsLoading(true)

        try {
            const formData = new FormData()
            formData.append("content", content)
            formData.append("sessionId", sessionId)

            const response = await sendMessage(formData)

            if (response.success) {
                const assistantMessage: ChatMessage = {
                    id: response.messageId,
                    content: response.message,
                    role: "assistant",
                    timestamp: new Date(),
                    emotion: response.emotion,
                    confidence: response.analytics?.emotionConfidence
                }

                setMessages((prev) => [...prev, assistantMessage])

                if (response.copingStrategies?.length) {
                    const strategiesMessage: ChatMessage = {
                        id: generateMessageId(),
                        content: `Here are some coping strategies that might help:\n${response.copingStrategies.join("\n")}`,
                        role: "assistant",
                        timestamp: new Date(),
                    }
                    setMessages((prev) => [...prev, strategiesMessage])
                }

                // Reload sessions to update last activity
                await loadUserSessions()
            }
        } catch (error) {
            console.error("Error sending message:", error)
            const errorMessage: ChatMessage = {
                id: generateMessageId(),
                content: "I'm sorry, I encountered an error. Please try again.",
                role: "assistant",
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, errorMessage])
            toast.error("Failed to send message")
        } finally {
            setIsLoading(false)
        }
    }

    const toggleSidebarCollapse = () => {
        if (!isMobile) {
            setSidebarCollapsed(!sidebarCollapsed)
        }
    }

    const toggleMobileSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    const selectedSessionData = sessions.find((s) => s.id === selectedSession)

    return (
        <TooltipProvider>
            <div className="relative min-h-screen bg-gradient-to-br from-[var(--background)] via-[var(--muted)] to-[var(--background)] flex overflow-hidden">
                {/* Sidebar */}
                <aside
                    className={`
        ${isMobile
                            ? `${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed z-50 w-full max-w-sm`
                            : `${sidebarCollapsed ? "w-16" : "w-80"} relative` // Changed from w-16 to w-20 for better spacing
                        }
        transition-all duration-300 ease-in-out
        flex flex-col
        bg-[var(--background)]/95 dark:bg-[var(--background)]/95 backdrop-blur-xl
        ${isMobile ? "border-r-0 shadow-2xl" : "border-r border-[var(--muted)]/50 dark:border-[var(--muted)]/50 shadow-xl md:shadow-none"}
        min-h-screen
    `}
                >
                    {/* Mobile Header */}
                    {isMobile && (
                        <div className="flex items-center justify-between p-4 border-b border-[var(--muted)]/50 dark:border-[var(--muted)]/50 bg-[var(--background)]/50 dark:bg-[var(--background)]/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-xl shadow-lg">
                                    <Brain className="h-5 w-5 text-[var(--primary-foreground)]" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg text-[var(--foreground)]">Mindful Bot</h2>
                                    <p className="text-sm text-[var(--muted-foreground)]">Your companion</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleMobileSidebar}
                                className="h-10 w-10 text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    )}

                    {/* Desktop Header */}
                    {!isMobile && (
                        <div
                            className={`p-6 border-b border-[var(--muted)]/50 dark:border-[var(--muted)]/50 ${sidebarCollapsed ? "px-3" : ""}`}
                        >
                            <div className={`flex items-center gap-3 mb-6 ${sidebarCollapsed ? "justify-center" : ""}`}>
                                <div className="p-2 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-xl shadow-lg flex-shrink-0">
                                    <Brain className="h-6 w-6 text-[var(--primary-foreground)]" />
                                </div>
                                {!sidebarCollapsed && (
                                    <div className="min-w-0">
                                        <h2 className="font-bold text-lg text-[var(--foreground)] truncate">Mindful Bot</h2>
                                        <p className="text-sm text-[var(--muted-foreground)] truncate">Your companion</p>
                                    </div>
                                )}
                            </div>

                            {/* New Chat Button - Desktop */}
                            {sidebarCollapsed ? (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="icon"
                                            className="w-10 h-10 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:from-[var(--primary)] hover:to-[var(--secondary)] text-[var(--primary-foreground)] shadow-lg hover:shadow-xl transition-all duration-200 group"
                                            onClick={createNewSession}
                                            disabled={isLoading}
                                        >
                                            <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                        <p>New Conversation</p>
                                    </TooltipContent>
                                </Tooltip>
                            ) : (
                                <Button
                                    className="w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:from-[var(--primary)] hover:to-[var(--secondary)] text-[var(--primary-foreground)] shadow-lg hover:shadow-xl transition-all duration-200 group"
                                    onClick={createNewSession}
                                    disabled={isLoading}
                                >
                                    <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-200" />
                                    New Conversation
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Mobile New Chat Button */}
                    {isMobile && (
                        <div className="p-4 border-b border-[var(--muted)]/50 dark:border-[var(--muted)]/50">
                            <Button
                                className="w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:from-[var(--primary)] hover:to-[var(--secondary)] text-[var(--primary-foreground)] shadow-lg hover:shadow-xl transition-all duration-200 group h-12"
                                onClick={createNewSession}
                                disabled={isLoading}
                            >
                                <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-200" />
                                Start New Conversation
                            </Button>
                        </div>
                    )}

                    {/* Sessions List */}
                    <ScrollArea className="flex-1 px-3 py-4">
                        {isLoadingSessions ? (
                            <div className="flex items-center justify-center p-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--primary)]"></div>
                            </div>
                        ) : (
                            <div className={`space-y-2 ${!isMobile && sidebarCollapsed ? "px-0" : "px-1"}`}>
                                {sessions.length === 0 ? (
                                    <div className="text-center text-sm text-[var(--muted-foreground)] p-4">
                                        No conversations yet
                                    </div>
                                ) : (
                                    sessions.map((session) => (
                                        <div key={session.id}>
                                            {!isMobile && sidebarCollapsed ? (
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <button
                                                            className={`
                    w-full h-12 flex items-center justify-center rounded-xl transition-all duration-200
                    ${selectedSession === session.id
                                                                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-200 dark:border-blue-800 shadow-sm text-blue-600 dark:text-blue-400"
                                                                    : "hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-500 dark:text-slate-400"
                                                                }
                `}
                                                            onClick={() => {
                                                                setSelectedSession(session.id)
                                                            }}
                                                        >
                                                            <MessageCircle className="h-5 w-5" />
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="right">
                                                        <p>{session.title}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            ) : (
                                                <button
                                                    className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left group
                        ${isMobile ? "h-14" : ""}
                        ${selectedSession === session.id
                                                            ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-200 dark:border-blue-800 shadow-sm"
                                                            : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                                        }
                      `}
                                                    onClick={() => {
                                                        setSelectedSession(session.id)
                                                        if (isMobile) {
                                                            setSidebarOpen(false)
                                                        }
                                                    }}
                                                >
                                                    <div
                                                        className={`
                        p-2 rounded-lg transition-colors duration-200 flex-shrink-0
                        ${isMobile ? "p-3" : "p-2"}
                        ${selectedSession === session.id
                                                                ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                                                                : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-600"
                                                            }
                      `}
                                                    >
                                                        <MessageCircle className={`${isMobile ? "h-5 w-5" : "h-4 w-4"}`} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p
                                                            className={`
                          font-medium truncate
                          ${isMobile ? "text-base" : "text-sm"}
                          ${selectedSession === session.id
                                                                    ? "text-slate-800 dark:text-slate-100"
                                                                    : "text-slate-600 dark:text-slate-300"
                                                                }
                        `}
                                                        >
                                                            {session.title}
                                                        </p>
                                                        <p className={`text-slate-400 dark:text-slate-500 ${isMobile ? "text-sm" : "text-xs"}`}>
                                                            {session.createdAt.toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </ScrollArea>

                    {/* Footer */}
                    <div
                        className={`p-4 border-t border-[var(--muted)]/50 dark:border-[var(--muted)]/50 ${!isMobile && sidebarCollapsed ? "px-3" : ""}`}
                    >
                        {/* Mobile Footer */}
                        {isMobile && (
                            <div className="space-y-3">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-3 h-12 text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                                >
                                    <Settings className="h-5 w-5" />
                                    Settings
                                </Button>
                                <p className="text-xs text-[var(--muted-foreground)] text-center">
                                    {sessions.length} conversation{sessions.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        )}

                        {/* Desktop Footer */}
                        {!isMobile && (
                            <>
                                {!sidebarCollapsed && (
                                    <p className="text-xs text-[var(--muted-foreground)] text-center mb-3">
                                        {sessions.length} conversation{sessions.length !== 1 ? 's' : ''}
                                    </p>
                                )}

                                {/* Collapse Toggle Button */}
                                <div className="flex justify-center">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={toggleSidebarCollapse}
                                                className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-all duration-200"
                                            >
                                                {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side={sidebarCollapsed ? "right" : "top"}>
                                            <p>{sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </>
                        )}
                    </div>
                </aside>

                {/* Mobile Overlay */}
                {isMobile && sidebarOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={toggleMobileSidebar} />
                )}

                {/* Main chat area */}
                <main className="flex-1 flex flex-col min-h-screen">
                    {/* Header */}
                    <header className="bg-[var(--background)]/80 dark:bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--muted)]/50 px-4 md:px-6 py-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            {/* Mobile Menu Button */}
                            {isMobile && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggleMobileSidebar}
                                    className="h-10 w-10 text-[var(--muted-foreground)] hover:bg-[var(--muted)] flex-shrink-0"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            )}

                            {/* Header Content */}
                            <div className="flex items-center justify-center gap-3 flex-1">
                                <div className="p-2 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-lg shadow-lg">
                                    <Sparkles className="h-5 w-5 text-[var(--primary-foreground)]" />
                                </div>
                                <div className="text-center">
                                    <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-[var(--foreground)] to-[var(--muted-foreground)] bg-clip-text text-transparent">
                                        {isMobile && selectedSessionData ? selectedSessionData.title : "Mindful Companion Chat"}
                                    </h1>
                                    {isMobile && selectedSessionData && (
                                        <p className="text-xs text-[var(--muted-foreground)]">
                                            {selectedSessionData.createdAt.toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Mobile placeholder for balance */}
                            {isMobile && <div className="w-10" />}
                        </div>
                    </header>

                    {/* Messages area */}
                    <div className="flex-1 overflow-hidden">
                        <ScrollArea className="h-full">
                            <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
                                {messages.map((message) => (
                                    <ChatMessage
                                        key={message.id}
                                        content={message.content}
                                        role={message.role}
                                        timestamp={message.timestamp}
                                    />
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-[var(--background)] rounded-2xl px-4 py-3 shadow-sm border border-[var(--muted)]">
                                            <div className="flex items-center gap-2">
                                                <div className="flex gap-1">
                                                    <div className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                                    <div className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                                    <div className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce"></div>
                                                </div>
                                                <span className="text-sm text-[var(--muted-foreground)]">ChatBot is thinking...</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Input area */}
                    <div className="bg-[var(--background)]/80 dark:bg-[var(--background)]/80 backdrop-blur-xl border-t border-[var(--muted)]/50 p-4">
                        <div className="max-w-4xl mx-auto">
                            <ChatInput onSubmit={handleSendMessage} isLoading={isLoading} />
                        </div>
                    </div>
                </main>
            </div>
        </TooltipProvider>
    )
}
