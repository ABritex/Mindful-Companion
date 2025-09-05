"use client"
import { useState } from "react"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

const steps = [
    "Sit comfortably and close your eyes if you wish.",
    "Take a deep breath in, and slowly exhale.",
    "Bring your attention to your breath. Notice the sensation of air entering and leaving your body.",
    "If your mind wanders, gently bring your focus back to your breath.",
    "Continue for a few minutes, breathing slowly and mindfully.",
    "When you're ready, open your eyes and notice how you feel.",
]

export default function GuidedMeditationPage() {
    const [step, setStep] = useState(0)

    const nextStep = () => {
        if (step < steps.length - 1) setStep(step + 1)
    }
    const prevStep = () => {
        if (step > 0) setStep(step - 1)
    }
    const restart = () => setStep(0)

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
                        <BreadcrumbPage>Guided Meditation</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="max-w-lg mx-auto bg-muted rounded-xl shadow p-8 mt-8">
                <h1 className="text-2xl font-bold mb-4 text-primary">5-Minute Mindful Breathing</h1>
                <audio controls className="w-full mb-6">
                    <source src="https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae5c2.mp3" type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
                <p className="mb-4 text-muted-foreground">Follow each step at your own pace. This meditation helps you relax and refocus.</p>
                <div className="flex flex-col items-center gap-4">
                    <div className="text-lg font-semibold mb-2">Step {step + 1} of {steps.length}</div>
                    <div className="text-xl font-medium text-primary mb-4 text-center">{steps[step]}</div>
                    <div className="flex gap-4">
                        <button onClick={prevStep} disabled={step === 0} className="px-4 py-2 rounded-lg bg-muted-foreground/20 text-muted-foreground font-semibold disabled:opacity-50">Back</button>
                        {step < steps.length - 1 ? (
                            <button onClick={nextStep} className="px-4 py-2 rounded-lg bg-primary text-white font-semibold shadow hover:bg-primary/90 transition">Next</button>
                        ) : (
                            <button onClick={restart} className="px-4 py-2 rounded-lg bg-secondary text-white font-semibold shadow hover:bg-secondary/90 transition">Restart</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
} 