"use client"
import React, { useState, useEffect } from "react"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

const steps = [
    { label: "Inhale through your nose", duration: 4, type: "inhale" },
    { label: "Hold your breath", duration: 7, type: "hold" },
    { label: "Exhale through your mouth", duration: 8, type: "exhale" },
]

export default function BreathingExercisesPage() {
    const [step, setStep] = useState(0)
    const [count, setCount] = useState(steps[0].duration)
    const [running, setRunning] = useState(false)
    const [cycle, setCycle] = useState(1)

    useEffect(() => {
        if (!running) return
        if (count > 0) {
            const timer = setTimeout(() => setCount(count - 1), 1000)
            return () => clearTimeout(timer)
        } else {
            if (step < steps.length - 1) {
                setStep(step + 1)
                setCount(steps[step + 1].duration)
            } else {
                setStep(0)
                setCount(steps[0].duration)
                setCycle(cycle + 1)
            }
        }
    }, [count, running, step, cycle])

    const start = () => {
        setRunning(true)
        setStep(0)
        setCount(steps[0].duration)
        setCycle(1)
    }
    const stop = () => {
        setRunning(false)
        setStep(0)
        setCount(steps[0].duration)
        setCycle(1)
    }

    // Animation size logic
    let circleScale = 1
    if (steps[step].type === "inhale") circleScale = 1.3
    else if (steps[step].type === "exhale") circleScale = 0.7
    else circleScale = 1

    return (
        <div className="container mx-auto p-4">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/resources">Resources</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/resources/self-help">Self-Help</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Breathing Exercises</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="max-w-lg mx-auto bg-muted rounded-xl shadow p-8 mt-8">
                <h1 className="text-2xl font-bold mb-4 text-primary">4-7-8 Breathing Exercise</h1>
                <p className="mb-4 text-muted-foreground">Follow the steps below. This exercise helps reduce stress and calm your mind.</p>
                <div className="flex flex-col items-center gap-4">
                    {/* Animated Circle */}
                    <div
                        className="mb-4"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 180,
                            height: 180,
                        }}
                    >
                        <div
                            style={{
                                width: 120,
                                height: 120,
                                borderRadius: "50%",
                                background: "radial-gradient(circle at 60% 40%, #a5b4fc 60%, #6366f1 100%)",
                                transition: "transform 1s cubic-bezier(.4,0,.2,1)",
                                transform: `scale(${circleScale})`,
                                boxShadow: "0 0 40px 0 #6366f1a0",
                            }}
                        />
                    </div>
                    <div className="text-lg font-semibold mb-2">Cycle: {cycle}</div>
                    <div className="text-3xl font-bold text-primary mb-2">{steps[step].label}</div>
                    <div className="text-5xl font-mono mb-4">{count}s</div>
                    <div className="flex gap-4">
                        {!running ? (
                            <button onClick={start} className="bg-primary text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-primary/90 transition">Start</button>
                        ) : (
                            <button onClick={stop} className="bg-destructive text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-destructive/90 transition">Stop</button>
                        )}
                    </div>
                </div>
                <div className="mt-6 text-sm text-muted-foreground text-center">Repeat the cycle up to 4 times for best results.</div>
            </div>
        </div>
    )
} 