"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Database, CheckCircle, XCircle } from "lucide-react"

export default function SeedPage() {
    const [isSeeding, setIsSeeding] = useState(false)
    const [seedResults, setSeedResults] = useState<{
        aiTemplates: { success: boolean; message: string; count?: number } | null
    }>({
        aiTemplates: null
    })

    const seedAITemplates = async () => {
        try {
            setIsSeeding(true)
            const response = await fetch('/api/seed', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            const result = await response.json()

            if (result.success) {
                toast.success(result.message)
                setSeedResults(prev => ({
                    ...prev,
                    aiTemplates: { success: true, message: result.message, count: result.count }
                }))
            } else {
                toast.error(result.message)
                setSeedResults(prev => ({
                    ...prev,
                    aiTemplates: { success: false, message: result.message }
                }))
            }
        } catch (error) {
            console.error('Error seeding AI templates:', error)
            toast.error('Failed to seed AI templates')
            setSeedResults(prev => ({
                ...prev,
                aiTemplates: { success: false, message: 'Network error occurred' }
            }))
        } finally {
            setIsSeeding(false)
        }
    }

    const checkAITemplates = async () => {
        try {
            const response = await fetch('/api/seed')
            const result = await response.json()

            if (result.success) {
                setSeedResults(prev => ({
                    ...prev,
                    aiTemplates: { success: true, message: `${result.count} templates found`, count: result.count }
                }))
            } else {
                setSeedResults(prev => ({
                    ...prev,
                    aiTemplates: { success: false, message: 'No templates found' }
                }))
            }
        } catch (error) {
            console.error('Error checking AI templates:', error)
            setSeedResults(prev => ({
                ...prev,
                aiTemplates: { success: false, message: 'Failed to check templates' }
            }))
        }
    }

    return (
        <div className="container mx-auto py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Database Seeding</h1>
                    <p className="text-muted-foreground">
                        Seed the database with initial data for the chatbot system.
                    </p>
                </div>

                <div className="grid gap-6">
                    {/* AI Response Templates */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="h-5 w-5" />
                                AI Response Templates
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Seed the database with pre-configured AI response templates for different emotions and situations.
                            </p>

                            <div className="flex items-center gap-4">
                                <Button
                                    onClick={seedAITemplates}
                                    disabled={isSeeding}
                                    className="flex items-center gap-2"
                                >
                                    {isSeeding ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Seeding...
                                        </>
                                    ) : (
                                        <>
                                            <Database className="h-4 w-4" />
                                            Seed AI Templates
                                        </>
                                    )}
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={checkAITemplates}
                                    disabled={isSeeding}
                                >
                                    Check Status
                                </Button>
                            </div>

                            {seedResults.aiTemplates && (
                                <div className={`flex items-center gap-2 p-3 rounded-lg ${seedResults.aiTemplates.success
                                        ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800'
                                        : 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800'
                                    }`}>
                                    {seedResults.aiTemplates.success ? (
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-red-600" />
                                    )}
                                    <span className={`text-sm ${seedResults.aiTemplates.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                                        }`}>
                                        {seedResults.aiTemplates.message}
                                    </span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Instructions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Instructions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm text-muted-foreground">
                            <p>
                                <strong>1. AI Response Templates:</strong> These templates provide the chatbot with pre-written responses
                                for different emotional states. They include coping strategies and guidance for users.
                            </p>
                            <p>
                                <strong>2. Seeding:</strong> Click "Seed AI Templates" to populate the database with initial response templates.
                                This only needs to be done once.
                            </p>
                            <p>
                                <strong>3. Status Check:</strong> Use "Check Status" to see how many templates are currently in the database.
                            </p>
                            <p>
                                <strong>Note:</strong> The seeding process is safe to run multiple times - it will only insert templates
                                if none exist in the database.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
} 