import { promises as fs } from "fs"
import path from "path"

interface TrainingData {
    convo_id: string
    emotion_type: string
    problem_type: string
    situation: string
    user_text: string
    counselor_full: string
    strategy: string
    empathy: number
    relevance: number
    user_turn_emotion: string
}

interface ResponseTemplate {
    emotion: string
    problemType: string
    strategy: string
    response: string
    empathy: number
    relevance: number
}

class AIResponseGenerator {
    private trainingData: TrainingData[] = []
    private responseTemplates: ResponseTemplate[] = []
    private isInitialized = false
    private columnMapping: Record<string, number> = {}

    async initialize() {
        if (this.isInitialized) return

        try {
            const csvPath = path.join(process.cwd(), "src", "train-00000-of-00001.csv")

            try {
                await fs.access(csvPath)
            } catch (error) {
                console.warn("Training data file not found, using fallback responses only")
                this.isInitialized = true
                return
            }

            const csvContent = await fs.readFile(csvPath, "utf-8")
            const lines = csvContent.split("\n")

            if (lines.length < 2) {
                console.warn("CSV file is empty or has no data rows")
                this.isInitialized = true
                return
            }

            const headerLine = lines[0]
            const headers = this.parseCSVLine(headerLine)

            // Create mapping of column names to indices
            headers.forEach((header, index) => {
                this.columnMapping[header.toLowerCase().trim()] = index
            })

            console.log("CSV Column mapping:", this.columnMapping)

            const dataLines = lines.slice(1) // Skip header
            this.trainingData = dataLines
                .filter((line) => line.trim())
                .map((line, index) => {
                    try {
                        const columns = this.parseCSVLine(line)

                        const data: TrainingData = {
                            convo_id: this.getColumnValue(columns, "convo_id") || "",
                            emotion_type: this.getColumnValue(columns, "emotion_type") || "",
                            problem_type: this.getColumnValue(columns, "problem_type") || "",
                            situation: this.getColumnValue(columns, "situation") || "",
                            user_text: this.getColumnValue(columns, "user_text") || "",
                            counselor_full: this.getColumnValue(columns, "counselor_full") || "",
                            strategy: this.getColumnValue(columns, "strategy") || "",
                            empathy: Number.parseFloat(this.getColumnValue(columns, "empathy") || "3") || 3,
                            relevance: Number.parseFloat(this.getColumnValue(columns, "relevance") || "3") || 3,
                            user_turn_emotion: this.getColumnValue(columns, "user_turn_emotion") || "",
                        }

                        if (!data.counselor_full || !data.user_text) {
                            console.warn(
                                `Row ${index + 2}: Missing essential data - counselor_full: "${data.counselor_full}", user_text: "${data.user_text}"`,
                            )
                            return null
                        }

                        return data
                    } catch (error) {
                        console.warn(`Error parsing CSV line ${index + 2}:`, error)
                        return null
                    }
                })
                .filter((data): data is TrainingData => data !== null)

            // Create response templates
            this.createResponseTemplates()
            this.isInitialized = true
            console.log(`Successfully loaded ${this.trainingData.length} training examples`)

            if (this.trainingData.length > 0) {
                console.log("Sample training data:", {
                    emotion_type: this.trainingData[0].emotion_type,
                    strategy: this.trainingData[0].strategy,
                    counselor_response_preview: this.trainingData[0].counselor_full.substring(0, 100) + "...",
                })
            }
        } catch (error) {
            console.error("Error loading training data:", error)
            this.isInitialized = true
        }
    }

    private parseCSVLine(line: string): string[] {
        const result: string[] = []
        let current = ""
        let inQuotes = false
        let i = 0

        while (i < line.length) {
            const char = line[i]
            const nextChar = line[i + 1]

            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    // Handle escaped quotes
                    current += '"'
                    i += 2
                    continue
                } else {
                    inQuotes = !inQuotes
                }
            } else if (char === "," && !inQuotes) {
                result.push(current.trim())
                current = ""
            } else {
                current += char
            }
            i++
        }

        result.push(current.trim())
        return result.map((field) => field.replace(/^"|"$/g, "")) // Remove surrounding quotes
    }

    private getColumnValue(columns: string[], columnName: string): string {
        const index = this.columnMapping[columnName.toLowerCase()]
        if (index !== undefined && index < columns.length) {
            return columns[index]?.trim() || ""
        }
        return ""
    }

    private createResponseTemplates() {
        // Group responses by emotion and problem type
        const groupedResponses = new Map<string, ResponseTemplate[]>()

        this.trainingData.forEach((data) => {
            const key = `${data.emotion_type}_${data.problem_type}`
            const template: ResponseTemplate = {
                emotion: data.emotion_type,
                problemType: data.problem_type,
                strategy: data.strategy,
                response: data.counselor_full,
                empathy: data.empathy,
                relevance: data.relevance,
            }

            if (!groupedResponses.has(key)) {
                groupedResponses.set(key, [])
            }
            groupedResponses.get(key)!.push(template)
        })

        // Store templates, prioritizing high empathy and relevance scores
        groupedResponses.forEach((templates, key) => {
            const sortedTemplates = templates.sort((a, b) => b.empathy + b.relevance - (a.empathy + a.relevance))
            this.responseTemplates.push(...sortedTemplates.slice(0, 5)) // Keep top 5 per group
        })
    }

    async generateResponse(
        userMessage: string,
        detectedEmotion: string,
        context: any = {},
    ): Promise<{
        content: string
        strategy: string
        empathy: number
        relevance: number
    }> {
        await this.initialize()

        console.log("[v0] Generating response for:", {
            userMessage: userMessage.substring(0, 50) + "...",
            detectedEmotion,
            hasTrainingData: this.trainingData.length > 0,
            templateCount: this.responseTemplates.length,
        })

        // Find the best matching response template
        const bestMatch = this.findBestMatch(userMessage, detectedEmotion, context)

        if (bestMatch) {
            console.log("[v0] Found matching template with strategy:", bestMatch.strategy)
            return {
                content: bestMatch.response,
                strategy: bestMatch.strategy,
                empathy: bestMatch.empathy,
                relevance: bestMatch.relevance,
            }
        }

        console.log("[v0] Using fallback response for emotion:", detectedEmotion)
        const fallbackResponse = this.generateFallbackResponse(detectedEmotion)
        console.log("[v0] Fallback response generated:", fallbackResponse.content.substring(0, 50) + "...")
        return fallbackResponse
    }

    private findBestMatch(userMessage: string, detectedEmotion: string, context: any): ResponseTemplate | null {
        if (this.responseTemplates.length === 0) {
            return null
        }

        // First, try to match by emotion
        let candidates = this.responseTemplates.filter(
            (template) => template.emotion.toLowerCase() === detectedEmotion.toLowerCase(),
        )

        if (candidates.length === 0) {
            // Fallback to any template
            candidates = this.responseTemplates
        }

        if (candidates.length === 0) {
            return null
        }

        // Score candidates based on keyword matching
        const scoredCandidates = candidates.map((template) => {
            const score = this.calculateSimilarityScore(userMessage, template.response)
            return { template, score }
        })

        // Return the best match
        scoredCandidates.sort((a, b) => b.score - a.score)
        return scoredCandidates[0]?.template || null
    }

    private calculateSimilarityScore(userMessage: string, templateResponse: string): number {
        const userWords = userMessage.toLowerCase().split(/\s+/)
        const templateWords = templateResponse.toLowerCase().split(/\s+/)

        let matches = 0
        userWords.forEach((word) => {
            if (templateWords.includes(word)) {
                matches++
            }
        })

        return matches / Math.max(userWords.length, 1)
    }

    private generateFallbackResponse(emotion: string): {
        content: string
        strategy: string
        empathy: number
        relevance: number
    } {
        const fallbackResponses: Record<string, string> = {
            anxious:
                "I can sense that you're feeling anxious. It's completely normal to feel this way, and I'm here to listen and support you. Would you like to talk more about what's causing this anxiety?",
            sad: "I'm sorry to hear you're feeling down. It's okay to feel sad sometimes, and I want you to know that you're not alone. Would you like to share more about what's on your mind?",
            angry:
                "I hear your frustration, and it's completely valid to feel angry. Sometimes talking about what's bothering us can help. Would you like to discuss what's making you feel this way?",
            stressed:
                "Stress can be really overwhelming, and I understand how difficult it can be to manage. Let's take a moment to breathe together. What's the most pressing concern on your mind right now?",
            happy:
                "It's wonderful that you're feeling good! I'm glad to hear that. What's bringing you this positive energy today?",
            excited: "I can feel your excitement! That's fantastic. What's got you feeling so energized?",
            frustrated:
                "I understand you're feeling frustrated. That can be really challenging. Would you like to talk about what's causing this frustration?",
            calm: "It's great that you're feeling calm. How can I support you in maintaining this peaceful state?",
            grateful: "It's beautiful that you're feeling grateful. What are you most thankful for right now?",
            neutral:
                "How are you really feeling today? Sometimes when we feel neutral, it's a good opportunity to check in with ourselves more deeply.",
        }

        const content = fallbackResponses[emotion] || fallbackResponses.neutral

        return {
            content,
            strategy: "Empathetic Support",
            empathy: 4,
            relevance: 3,
        }
    }

    // Get coping strategies based on emotion and problem type
    getCopingStrategies(emotion: string, problemType: string): string[] {
        const strategies = new Set<string>()

        // Find relevant training examples
        const relevantExamples = this.trainingData.filter(
            (data) =>
                data.emotion_type.toLowerCase() === emotion.toLowerCase() ||
                data.problem_type.toLowerCase() === problemType.toLowerCase(),
        )

        // Extract strategies from high-quality responses
        relevantExamples
            .filter((data) => data.empathy >= 4 && data.relevance >= 4)
            .forEach((data) => {
                if (data.strategy && data.strategy !== "Question") {
                    strategies.add(data.strategy)
                }
            })

        return Array.from(strategies)
    }

    // Get conversation suggestions based on context
    getConversationSuggestions(context: any): string[] {
        const suggestions: string[] = []

        // Add suggestions based on common patterns in training data
        if (context.emotion === "anxious") {
            suggestions.push(
                "Try asking about specific triggers",
                "Suggest breathing exercises",
                "Ask about their support network",
            )
        } else if (context.emotion === "sad") {
            suggestions.push("Validate their feelings", "Ask about recent changes", "Suggest talking to someone they trust")
        }

        return suggestions
    }
}

export const aiResponseGenerator = new AIResponseGenerator()
