"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Heart, Brain, Users, Activity, CheckCircle, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface PreAssessmentModalProps {
    isOpen: boolean
    onClose: () => void
    onComplete: (results: PreAssessmentResults) => void
}

export interface PreAssessmentResults {
    // Work and Daily Functioning
    workOverwhelmed: string
    concentrationDifficulty: string
    procrastination: string
    irritability: string
    lackAccomplishment: string
    troubleSwitchingOff: string

    // Mood and Emotions
    feelingDown: string
    losingInterest: string
    feelingAnxious: string
    moodSwings: string
    feelingGuilty: string

    // Physical and Behavioral Changes
    sleepProblems: string
    appetiteChanges: string
    feelingTired: string
    physicalSymptoms: string
    substanceUse: string
    withdrawing: string

    // Thoughts and Safety
    thoughtsOfHarm: string
    lifeNotWorthLiving: string
    worriedAboutStudents: string

    // Additional sections
    copingMechanisms: string[]
    goals: string[]
}

const assessmentSections = [
    {
        id: "A",
        title: "Work and Daily Functioning",
        description: "Questions about your teaching responsibilities and daily work life",
        questions: [
            {
                id: "workOverwhelmed",
                question: "Feeling overwhelmed by lesson planning, grading, or teaching responsibilities."
            },
            {
                id: "concentrationDifficulty",
                question: "Having difficulty concentrating during lessons or while preparing class materials."
            },
            {
                id: "procrastination",
                question: "Procrastinating on school-related tasks (lesson prep, grading, reports) more than usual."
            },
            {
                id: "irritability",
                question: "Becoming more irritable or frustrated with students, colleagues, or parents."
            },
            {
                id: "lackAccomplishment",
                question: "Feeling a lack of accomplishment or reduced satisfaction in your teaching role."
            },
            {
                id: "troubleSwitchingOff",
                question: "Having trouble 'switching off' from school concerns after classes or at home."
            }
        ]
    },
    {
        id: "B",
        title: "Mood and Emotions",
        description: "Questions about your emotional well-being and mood",
        questions: [
            {
                id: "feelingDown",
                question: "Feeling down, discouraged, or hopeless about your teaching situation."
            },
            {
                id: "losingInterest",
                question: "Losing interest or pleasure in activities you once enjoyed (including hobbies outside teaching)."
            },
            {
                id: "feelingAnxious",
                question: "Feeling anxious, restless, or constantly on edge (about lessons, evaluations, or classroom issues)."
            },
            {
                id: "moodSwings",
                question: "Experiencing sudden mood swings or uncharacteristic emotional outbursts."
            },
            {
                id: "feelingGuilty",
                question: "Feeling excessively guilty or worthless as a teacher or person."
            }
        ]
    },
    {
        id: "C",
        title: "Physical and Behavioral Changes",
        description: "Questions about physical symptoms and behavioral changes",
        questions: [
            {
                id: "sleepProblems",
                question: "Trouble falling asleep, staying asleep, or oversleeping."
            },
            {
                id: "appetiteChanges",
                question: "Noticeable changes in your appetite (eating much more or less than usual)."
            },
            {
                id: "feelingTired",
                question: "Feeling constantly tired or lacking energy for teaching or preparation."
            },
            {
                id: "physicalSymptoms",
                question: "Experiencing unexplained physical symptoms (headaches, stomach aches, muscle tension)."
            },
            {
                id: "substanceUse",
                question: "Using alcohol, nicotine, or other substances more often to cope with stress."
            },
            {
                id: "withdrawing",
                question: "Withdrawing from colleagues, friends, or family, or avoiding school activities."
            }
        ]
    },
    {
        id: "D",
        title: "Thoughts and Safety",
        description: "Questions about thoughts and safety concerns",
        questions: [
            {
                id: "thoughtsOfHarm",
                question: "Thinking that you would be better off not teaching, or having thoughts of harming yourself."
            },
            {
                id: "lifeNotWorthLiving",
                question: "Feeling like life isn't worth living, or that you are a burden to others."
            },
            {
                id: "worriedAboutStudents",
                question: "Worrying that your mental health struggles are negatively affecting your students."
            }
        ]
    }
]

const ratingOptions = [
    { value: "0", label: "Not at all" },
    { value: "1", label: "Several days" },
    { value: "2", label: "More than half the days" },
    { value: "3", label: "Nearly every day" }
]

const copingMechanisms = [
    { id: "exercise", label: "Exercise", icon: Activity },
    { id: "meditation", label: "Meditation", icon: Brain },
    { id: "social", label: "Social Activities", icon: Users },
    { id: "hobbies", label: "Hobbies", icon: Heart },
    { id: "therapy", label: "Professional Therapy", icon: Brain },
    { id: "journaling", label: "Journaling", icon: Heart },
    { id: "music", label: "Music", icon: Heart },
    { id: "nature", label: "Nature Walks", icon: Activity },
    { id: "boundaries", label: "Setting Boundaries", icon: Brain },
    { id: "timeManagement", label: "Time Management", icon: Activity },
    { id: "colleagueSupport", label: "Colleague Support", icon: Users },
    { id: "professionalDevelopment", label: "Professional Development", icon: Brain }
]

const wellnessGoals = [
    "Reduce teaching-related stress and anxiety",
    "Improve sleep quality and work-life balance",
    "Build better relationships with students and colleagues",
    "Increase confidence in teaching abilities",
    "Develop healthy coping mechanisms for classroom challenges",
    "Practice mindfulness and stress management",
    "Set better boundaries between work and personal life",
    "Build resilience to handle teaching challenges",
    "Improve classroom management skills",
    "Find more joy and satisfaction in teaching",
    "Develop better time management for lesson planning",
    "Create a supportive network with other teachers"
]

export function PreAssessmentModal({ isOpen, onClose, onComplete }: PreAssessmentModalProps) {
    const [currentStep, setCurrentStep] = useState(0)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [selectedCoping, setSelectedCoping] = useState<string[]>([])
    const [selectedGoals, setSelectedGoals] = useState<string[]>([])

    const totalSteps = assessmentSections.length + 2 // +2 for coping mechanisms and goals

    const handleAnswer = (questionId: string, value: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }))
    }

    const handleCopingToggle = (mechanism: string) => {
        setSelectedCoping(prev =>
            prev.includes(mechanism)
                ? prev.filter(c => c !== mechanism)
                : [...prev, mechanism]
        )
    }

    const handleGoalToggle = (goal: string) => {
        setSelectedGoals(prev =>
            prev.includes(goal)
                ? prev.filter(g => g !== goal)
                : [...prev, goal]
        )
    }

    const canProceed = () => {
        if (currentStep < assessmentSections.length) {
            const currentSection = assessmentSections[currentStep]
            return currentSection.questions.every(q => answers[q.id])
        }
        if (currentStep === assessmentSections.length) {
            return selectedCoping.length > 0
        }
        if (currentStep === assessmentSections.length + 1) {
            return selectedGoals.length > 0
        }
        return true
    }

    const handleNext = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(prev => prev + 1)
        } else {
            // Complete assessment
            const results: PreAssessmentResults = {
                // Work and Daily Functioning
                workOverwhelmed: answers.workOverwhelmed || "0",
                concentrationDifficulty: answers.concentrationDifficulty || "0",
                procrastination: answers.procrastination || "0",
                irritability: answers.irritability || "0",
                lackAccomplishment: answers.lackAccomplishment || "0",
                troubleSwitchingOff: answers.troubleSwitchingOff || "0",

                // Mood and Emotions
                feelingDown: answers.feelingDown || "0",
                losingInterest: answers.losingInterest || "0",
                feelingAnxious: answers.feelingAnxious || "0",
                moodSwings: answers.moodSwings || "0",
                feelingGuilty: answers.feelingGuilty || "0",

                // Physical and Behavioral Changes
                sleepProblems: answers.sleepProblems || "0",
                appetiteChanges: answers.appetiteChanges || "0",
                feelingTired: answers.feelingTired || "0",
                physicalSymptoms: answers.physicalSymptoms || "0",
                substanceUse: answers.substanceUse || "0",
                withdrawing: answers.withdrawing || "0",

                // Thoughts and Safety
                thoughtsOfHarm: answers.thoughtsOfHarm || "0",
                lifeNotWorthLiving: answers.lifeNotWorthLiving || "0",
                worriedAboutStudents: answers.worriedAboutStudents || "0",

                // Additional sections
                copingMechanisms: selectedCoping,
                goals: selectedGoals
            }
            onComplete(results)
        }
    }

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1)
        }
    }

    const renderStep = () => {
        if (currentStep < assessmentSections.length) {
            const currentSection = assessmentSections[currentStep]

            return (
                <div className="space-y-6">
                    <div className="text-center space-y-2">
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold text-primary mb-1">{currentSection.title}</h2>
                            <p className="text-sm text-muted-foreground">{currentSection.description}</p>
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">Section {currentSection.id}</h3>
                        <p className="text-muted-foreground">In the past two weeks, how often have you experienced the following?</p>
                    </div>

                    <div className="space-y-4">
                        {currentSection.questions.map((question, index) => (
                            <div key={question.id} className="flex items-center justify-between py-3">
                                <div className="flex items-start gap-3 flex-1">
                                    <span className="text-sm font-medium text-muted-foreground min-w-[20px]">{index + 1}.</span>
                                    <p className="text-sm font-medium">{question.question}</p>
                                </div>

                                <div className="flex items-center gap-4 ml-4">
                                    <RadioGroup
                                        value={answers[question.id] || ""}
                                        onValueChange={(value) => handleAnswer(question.id, value)}
                                        className="flex items-center gap-3"
                                    >
                                        {ratingOptions.map((option) => (
                                            <div key={option.value} className="flex items-center space-x-1">
                                                <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                                                <Label
                                                    htmlFor={`${question.id}-${option.value}`}
                                                    className="text-xs cursor-pointer font-medium"
                                                >
                                                    {option.value}
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-end gap-4 text-xs text-muted-foreground mt-4 pt-2 border-t">
                            <span>Not at all</span>
                            <span>Several days</span>
                            <span>More than half</span>
                            <span>Nearly every day</span>
                        </div>
                    </div>
                </div>
            )
        }

        if (currentStep === assessmentSections.length) {
            return (
                <div className="space-y-6">
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">What helps you cope with teaching stress?</h3>
                        <p className="text-muted-foreground">Select all the strategies that help you manage stress and maintain well-being</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {copingMechanisms.map((mechanism) => {
                            const Icon = mechanism.icon
                            return (
                                <button
                                    key={mechanism.id}
                                    onClick={() => handleCopingToggle(mechanism.id)}
                                    className={cn(
                                        "flex items-center space-x-2 p-3 rounded-lg border-2 transition-all duration-200",
                                        selectedCoping.includes(mechanism.id)
                                            ? "border-primary bg-primary/5"
                                            : "border-muted hover:border-primary/50"
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span className="text-sm font-medium">{mechanism.label}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            )
        }

        if (currentStep === assessmentSections.length + 1) {
            return (
                <div className="space-y-6">
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">What are your teaching wellness goals?</h3>
                        <p className="text-muted-foreground">Select the areas you'd like to improve in your teaching journey</p>
                    </div>

                    <div className="space-y-3">
                        {wellnessGoals.map((goal) => (
                            <button
                                key={goal}
                                onClick={() => handleGoalToggle(goal)}
                                className={cn(
                                    "w-full text-left p-3 rounded-lg border-2 transition-all duration-200",
                                    selectedGoals.includes(goal)
                                        ? "border-primary bg-primary/5"
                                        : "border-muted hover:border-primary/50"
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">{goal}</span>
                                    {selectedGoals.includes(goal) && (
                                        <CheckCircle className="h-5 w-5 text-primary" />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )
        }

        return null
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
                <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl">Teacher Wellness Assessment</CardTitle>
                            <CardDescription>
                                Complete this assessment to help us personalize your mental health support
                            </CardDescription>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                            {currentStep + 1} of {totalSteps}
                        </Badge>
                    </div>
                    <Progress value={((currentStep + 1) / totalSteps) * 100} className="mt-4" />
                </CardHeader>

                <CardContent className="p-6 overflow-y-auto max-h-[60vh]">
                    {renderStep()}
                </CardContent>

                <div className="border-t p-6 flex justify-between">
                    <Button
                        variant="outline"
                        onClick={currentStep === 0 ? onClose : handleBack}
                        disabled={currentStep === 0}
                    >
                        {currentStep === 0 ? "Skip for now" : "Back"}
                    </Button>

                    <Button
                        onClick={handleNext}
                        disabled={!canProceed()}
                        className="flex items-center space-x-2"
                    >
                        {currentStep === totalSteps - 1 ? (
                            <>
                                <span>Complete Assessment</span>
                                <CheckCircle className="h-4 w-4" />
                            </>
                        ) : (
                            <>
                                <span>Next</span>
                                <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </Button>
                </div>
            </Card>
        </div>
    )
} 