"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function AITestComponent() {
    const [message, setMessage] = useState('')
    const [emotion, setEmotion] = useState('anxious')
    const [response, setResponse] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const testAI = async () => {
        if (!message.trim()) return

        setLoading(true)
        try {
            const res = await fetch('/api/ai-test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message, emotion }),
            })

            const data = await res.json()
            setResponse(data)
        } catch (error) {
            console.error('Error testing AI:', error)
            setResponse({ error: 'Failed to get response' })
        } finally {
            setLoading(false)
        }
    }

    const emotions = ['anxious', 'sad', 'angry', 'stressed', 'happy', 'neutral']

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>AI Response Generator Test</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Message:</label>
                        <Input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Enter your message here..."
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Emotion:</label>
                        <div className="flex flex-wrap gap-2">
                            {emotions.map((emo) => (
                                <Button
                                    key={emo}
                                    variant={emotion === emo ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setEmotion(emo)}
                                >
                                    {emo}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <Button
                        onClick={testAI}
                        disabled={loading || !message.trim()}
                        className="w-full"
                    >
                        {loading ? 'Generating Response...' : 'Test AI Response'}
                    </Button>

                    {response && (
                        <div className="space-y-4 mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">AI Response</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {response.error ? (
                                        <p className="text-red-500">{response.error}</p>
                                    ) : (
                                        <>
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium">Response:</p>
                                                <p className="text-sm bg-muted p-3 rounded">{response.response}</p>
                                            </div>

                                            <div className="flex gap-2">
                                                <Badge variant="secondary">Strategy: {response.strategy}</Badge>
                                                <Badge variant="outline">Empathy: {response.empathy}</Badge>
                                                <Badge variant="outline">Relevance: {response.relevance}</Badge>
                                            </div>

                                            {response.copingStrategies && response.copingStrategies.length > 0 && (
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium">Coping Strategies:</p>
                                                    <ul className="text-sm space-y-1">
                                                        {response.copingStrategies.map((strategy: string, index: number) => (
                                                            <li key={index} className="bg-muted p-2 rounded">
                                                                {strategy}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
} 