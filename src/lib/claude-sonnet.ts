import Anthropic from "@anthropic-ai/sdk"
import { env } from "@/data/env/server"

const anthropic = new Anthropic({
    apiKey: env.SONNET,
})

export interface PreAssessmentAnalysis {
    riskLevel: "low" | "moderate" | "high" | "critical"
    riskScore: number
    keyFindings: string[]
    primaryConcerns: string[]
    recommendations: string[]
    personalizedPlan: {
        immediateActions: string[]
        shortTermGoals: string[]
        longTermSupport: string[]
        copingStrategies: string[]
    }
    communicationStyle: "supportive" | "gentle" | "direct" | "encouraging"
    priorityAreas: string[]
    conversationContext: {
        emotionalState: string
        communicationStyle: string
        keyTriggers: string[]
    }
}

export async function analyzePreAssessment(assessmentData: any): Promise<PreAssessmentAnalysis> {
    const prompt = `
As a mental health professional, analyze this teacher's pre-assessment data and provide a comprehensive analysis:

Assessment Data:
${JSON.stringify(assessmentData, null, 2)}

Please provide a detailed analysis including:
1. Risk level assessment (low/moderate/high/critical) based on scores
2. Risk score (0-100) calculated from responses
3. Key findings from the assessment responses
4. Primary concerns identified from the data
5. Specific recommendations for immediate support
6. Personalized support plan with:
   - Immediate actions to take today
   - Short-term goals for the next 2-4 weeks
   - Long-term support strategies
   - Specific coping strategies tailored to their responses
7. Recommended communication style for AI interactions (supportive/gentle/direct/encouraging)
8. Priority areas to focus on based on highest scores
9. Conversation context including:
   - Current emotional state description
   - Preferred communication approach
   - Key triggers to be mindful of

Focus on teacher-specific stressors like classroom management, workload, student concerns, and work-life balance.

Respond in valid JSON format matching the PreAssessmentAnalysis interface exactly.
`

    try {
        const response = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 3000,
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        })

        const content = response.content[0]
        if (content.type === "text") {
            return JSON.parse(content.text)
        }

        throw new Error("Unexpected response format from Claude")
    } catch (error) {
        console.error("Error analyzing pre-assessment:", error)

        return {
            riskLevel: "moderate",
            riskScore: 50,
            keyFindings: ["Assessment completed", "Requires professional review"],
            primaryConcerns: ["Work stress", "General wellness"],
            recommendations: ["Continue monitoring", "Seek professional support if needed"],
            personalizedPlan: {
                immediateActions: ["Take time for self-care", "Practice deep breathing"],
                shortTermGoals: ["Establish daily wellness routine", "Improve work-life balance"],
                longTermSupport: ["Regular check-ins with support system", "Professional counseling if needed"],
                copingStrategies: ["Mindfulness exercises", "Regular breaks", "Stress management techniques"],
            },
            communicationStyle: "supportive",
            priorityAreas: ["General wellness", "Stress management"],
            conversationContext: {
                emotionalState: "Managing daily stress",
                communicationStyle: "supportive",
                keyTriggers: ["Work overload", "Time pressure"],
            },
        }
    }
}
