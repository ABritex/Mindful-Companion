"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

const cards = [
    {
        key: "mood",
        icon: "😊",
        label: "Mood Tracker",
        desc: "Track your mood daily",
    },
    {
        key: "breath",
        icon: "🌬️",
        label: "Breathing Exercise",
        desc: "Calm your mind",
    },
    {
        key: "reflect",
        icon: "📝",
        label: "Daily Reflection",
        desc: "Reflect & grow",
    },
]

function Card({ card, index, stackAlign }: { card: string; index: number; stackAlign: boolean }) {
    const cardContent = () => {
        const cardData = cards.find((c) => c.key === card)
        if (!cardData) return null

        return (
            <>
                <div className="text-5xl mb-2">{cardData.icon}</div>
                <div className="font-bold text-xl mb-1 text-white">{cardData.label}</div>
                <div className="text-gray-300 text-sm text-center px-4">{cardData.desc}</div>
            </>
        )
    }

    return (
        <div
            style={{ boxShadow: index !== 2 ? "inset 0px -10px 30px 0px #1e293b" : "none" }}
            key={index}
            className={cn(
                `absolute inset-0 text-center text-gray-800 z-${index} ${card} my-6 flex h-full w-full flex-col items-center justify-around rounded-2xl transition-all duration-700 ease-out`,
                card === "mood" && stackAlign && "ml-8 md:ml-0",
                card === "breath" && (!stackAlign ? "-rotate-[15deg]" : "-left-8 ml-8 rotate-0 md:ml-0"),
                card === "reflect" && (!stackAlign ? "rotate-[15deg]" : "-left-16 ml-8 rotate-0 md:ml-0"),
                index === 0 && "scale-90 bg-slate-900",
                index === 1 && "scale-95 bg-slate-700",
                index === 2 && `scale-100 bg-slate-500 ${stackAlign && "bg-slate-600"}`,
            )}
        >
            <div className="component-container mt-6 flex h-full flex-col justify-around">{cardContent()}</div>
        </div>
    )
}

export function HeroSection({ className = "" }) {
    const [stackAlign, setStackAlign] = useState(false)
    const [cardStack, setCardStack] = useState(["reflect", "breath", "mood"])

    const cardStacks: { [key: string]: string[] } = {
        mood: ["reflect", "breath", "mood"],
        breath: ["reflect", "mood", "breath"],
        reflect: ["mood", "breath", "reflect"],
    }

    const changeStackAlign = (card: string) => {
        setStackAlign(true)
        const newStack = cardStacks[card]
        if (newStack) {
            setCardStack(newStack)
        }
    }

    const underlinedWord = (text: string, card: string) => (
        <span
            onMouseOver={() => changeStackAlign(card)}
            className="cursor-pointer underline decoration-primary decoration-wavy focus:outline-none focus:underline"
        >
            {text}
        </span>
    )

    return (
        <section
            className={`w-full min-h-[calc(100vh-64px)] flex flex-col md:flex-row items-center justify-center text-left relative z-10 gap-10 md:gap-20 px-4 py-16 pt-8 ${className}`}
        >
            <div className="flex-1 max-w-xl flex flex-col items-start justify-center">
                <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-4 text-primary leading-tight">
                    Your Mental Health Companion
                </h1>
                <p className="text-lg sm:text-2xl text-foreground mb-4 font-medium">
                    Confidential, stigma-free mental wellness support for everyone.
                </p>
                <p className="text-base text-muted-foreground mb-8">
                    AI-powered chat, real therapists, and free tools—anytime, anywhere. Our tools are{" "}
                    {underlinedWord("Insightful", "mood")}, {underlinedWord("Calming", "breath")}, and{" "}
                    {underlinedWord("Reflective", "reflect")}.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row mb-3">
                    <Button asChild size="lg">
                        <Link href="/chat">Start Chatting</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <Link href="/mood-check">Take a Mood Check</Link>
                    </Button>
                </div>
                {/* Inline Statistics */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                        <span className="text-primary font-semibold">10,000+</span>
                        <span>Conversations</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-primary font-semibold">24/7</span>
                        <span>Availability</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-primary font-semibold">98%</span>
                        <span>Satisfaction</span>
                    </div>
                </div>
            </div>
            {/* Right: Animated Mental Health Cards */}
            <div className="flex-1 flex justify-center md:justify-end w-full max-w-md">
                <div className="relative flex h-[350px] w-[280px] md:h-[350px] md:w-[300px] items-center justify-center select-none">
                    {cardStack.map((card, index) => (
                        <Card key={index} card={card} index={index} stackAlign={stackAlign} />
                    ))}
                </div>
            </div>
        </section>
    )
}
