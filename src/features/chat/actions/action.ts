'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/drizzle/db';
import { ChatSessionTable, ChatMessageTable, UserEmotionTable, ChatAnalyticsTable, AIResponseTemplateTable } from '@/drizzle/schema';
import { eq, desc } from 'drizzle-orm';
import { getUserFromSession } from '@/services/auth/functions/session';
import { aiResponseGenerator } from '@/lib/ai-response-generator';
import {
    type CreateSession,
    type UpdateSession,
    type EmotionTracking,
    type AIResponseRequest
} from './schemas';

// Enhanced emotion detection with confidence scoring
const EMOTION_KEYWORDS: Record<string, { keywords: string[], weight: number }> = {
    happy: { keywords: ["happy", "joy", "excited", "great", "wonderful", "amazing", "good", "fantastic", "delighted"], weight: 1.0 },
    sad: { keywords: ["sad", "depressed", "down", "unhappy", "miserable", "blue", "heartbroken", "devastated"], weight: 1.0 },
    anxious: { keywords: ["anxious", "worried", "nervous", "stressed", "overwhelmed", "panicked", "fearful"], weight: 1.0 },
    angry: { keywords: ["angry", "mad", "furious", "annoyed", "irritated", "frustrated", "enraged"], weight: 1.0 },
    excited: { keywords: ["excited", "thrilled", "ecstatic", "elated", "enthusiastic", "pumped"], weight: 0.8 },
    frustrated: { keywords: ["frustrated", "annoyed", "irritated", "bothered", "disappointed"], weight: 0.9 },
    calm: { keywords: ["calm", "peaceful", "serene", "tranquil", "relaxed", "at ease"], weight: 0.7 },
    stressed: { keywords: ["stressed", "overwhelmed", "pressured", "strained", "tense"], weight: 0.9 },
    grateful: { keywords: ["grateful", "thankful", "appreciative", "blessed", "fortunate"], weight: 0.8 },
    neutral: { keywords: ["okay", "fine", "alright", "normal", "usual"], weight: 0.5 }
};

// Enhanced coping strategies
const COPING_STRATEGIES: Record<string, string[]> = {
    happy: [
        "Share your joy with others",
        "Practice gratitude journaling",
        "Document this moment",
        "Express your happiness through creativity",
        "Help someone else feel good"
    ],
    sad: [
        "Take a walk in nature",
        "Listen to uplifting music",
        "Practice deep breathing exercises",
        "Talk to a friend or loved one",
        "Engage in gentle physical activity",
        "Write about your feelings"
    ],
    anxious: [
        "Try the 4-7-8 breathing technique",
        "Write down your worries",
        "Practice progressive muscle relaxation",
        "Take a short break and stretch",
        "Use grounding techniques (5-4-3-2-1)",
        "Limit caffeine and screen time"
    ],
    angry: [
        "Count to 10 slowly",
        "Take deep breaths",
        "Go for a walk",
        "Write down what's bothering you",
        "Use physical exercise to release tension",
        "Practice mindfulness meditation"
    ],
    excited: [
        "Channel your energy into productive activities",
        "Share your excitement with others",
        "Document your goals and plans",
        "Practice patience and planning"
    ],
    frustrated: [
        "Take a step back and reassess",
        "Break down problems into smaller parts",
        "Ask for help or clarification",
        "Practice self-compassion"
    ],
    calm: [
        "Maintain this peaceful state",
        "Practice mindfulness",
        "Engage in gentle activities",
        "Share your calm with others"
    ],
    stressed: [
        "Prioritize your tasks",
        "Take regular breaks",
        "Practice time management",
        "Seek support from others",
        "Use stress-reduction techniques"
    ],
    grateful: [
        "Express your gratitude to others",
        "Keep a gratitude journal",
        "Practice acts of kindness",
        "Reflect on positive experiences"
    ],
    neutral: [
        "Practice mindfulness",
        "Take a moment to check in with yourself",
        "Consider what would make you feel better",
        "Engage in activities you enjoy"
    ]
};

// Enhanced emotion detection with confidence scoring
function detectEmotionWithConfidence(message: string): { emotion: string, confidence: number } {
    const lowerMessage = message.toLowerCase();
    let maxScore = 0;
    let detectedEmotion = 'neutral';
    let totalWeight = 0;

    for (const [emotion, config] of Object.entries(EMOTION_KEYWORDS)) {
        let score = 0;
        for (const keyword of config.keywords) {
            if (lowerMessage.includes(keyword)) {
                score += config.weight;
            }
        }

        if (score > maxScore) {
            maxScore = score;
            detectedEmotion = emotion;
        }
        totalWeight += config.weight;
    }

    // Calculate confidence as percentage
    const confidence = totalWeight > 0 ? Math.min(100, Math.round((maxScore / totalWeight) * 100)) : 0;

    return { emotion: detectedEmotion, confidence };
}

// AI Response Generation with Context
async function generateAIResponse(request: AIResponseRequest): Promise<{ content: string, responseType: string, copingStrategies: string[] }> {
    const { userMessage, userEmotion } = request;

    // Try to get response from database templates first
    if (userEmotion) {
        const templates = await db.query.AIResponseTemplateTable.findMany({
            where: eq(AIResponseTemplateTable.emotion, userEmotion as any),
            orderBy: [desc(AIResponseTemplateTable.priority)],
            limit: 3
        });

        if (templates.length > 0) {
            const template = templates[0];
            const copingStrategies = template.copingStrategies as string[] || COPING_STRATEGIES[userEmotion] || [];

            return {
                content: template.content,
                responseType: template.responseType,
                copingStrategies
            };
        }
    }

    // Use the new AI response generator with training data
    const emotion = userEmotion || detectEmotionWithConfidence(userMessage).emotion;
    const aiResponse = await aiResponseGenerator.generateResponse(userMessage, emotion, {
        emotion: emotion,
        context: request.context || {}
    });

    // Get coping strategies from training data
    const copingStrategies = aiResponseGenerator.getCopingStrategies(emotion, 'general') ||
        COPING_STRATEGIES[emotion] ||
        COPING_STRATEGIES.neutral;

    return {
        content: aiResponse.content,
        responseType: aiResponse.strategy || 'guidance',
        copingStrategies
    };
}

// Create a new chat session
export async function createChatSession(data: CreateSession) {
    try {
        const user = await getUserFromSession();
        if (!user) {
            return { success: false, error: "User not authenticated" };
        }

        const [session] = await db
            .insert(ChatSessionTable)
            .values({
                userId: user.id,
                title: data.title,
                context: data.context || {},
                metadata: data.metadata || {},
            })
            .returning({ id: ChatSessionTable.id, title: ChatSessionTable.title });

        if (!session) {
            throw new Error("Failed to create chat session");
        }

        // Create analytics record
        await db.insert(ChatAnalyticsTable).values({
            sessionId: session.id,
            userId: user.id,
            messageCount: 0,
            averageResponseTime: 0,
            sessionDuration: 0,
        });

        return { success: true, sessionId: session.id, title: session.title };
    } catch (error) {
        console.error("Error creating chat session:", error);
        return { success: false, error: "Failed to create chat session" };
    }
}

// Send a message and get AI response
export async function sendMessage(formData: FormData) {
    const startTime = Date.now();

    try {
        const content = formData.get('content') as string;
        const sessionId = formData.get('sessionId') as string;
        const context = formData.get('context') as string;

        if (!content || !sessionId) {
            throw new Error('Missing required fields');
        }

        const user = await getUserFromSession();
        if (!user) {
            throw new Error('User not authenticated');
        }

        // Validate session ownership and get analytics
        const session = await db.query.ChatSessionTable.findFirst({
            where: eq(ChatSessionTable.id, sessionId),
        });

        if (!session || session.userId !== user.id) {
            throw new Error('Invalid session');
        }

        // Get current analytics for this session
        const currentAnalytics = await db.query.ChatAnalyticsTable.findFirst({
            where: eq(ChatAnalyticsTable.sessionId, sessionId),
        });

        // Detect emotion from user message
        const emotionDetection = detectEmotionWithConfidence(content);

        // Store user message
        await db
            .insert(ChatMessageTable)
            .values({
                sessionId,
                role: 'user',
                content,
                emotion: emotionDetection.emotion as any,
                confidence: emotionDetection.confidence,
            });

        // Track user emotion
        await db.insert(UserEmotionTable).values({
            userId: user.id,
            emotion: emotionDetection.emotion as any,
            intensity: Math.min(10, Math.max(1, Math.round(emotionDetection.confidence / 10))),
            context: content.substring(0, 100),
            sessionId,
        });

        // Generate AI response
        const aiResponse = await generateAIResponse({
            userMessage: content,
            userEmotion: emotionDetection.emotion,
            conversationHistory: [], // TODO: Implement conversation history
            context: context ? JSON.parse(context) : {},
        });

        // Store AI response
        const [aiMessage] = await db
            .insert(ChatMessageTable)
            .values({
                sessionId,
                role: 'assistant',
                content: aiResponse.content,
                emotion: emotionDetection.emotion as any,
                confidence: emotionDetection.confidence,
            })
            .returning({ id: ChatMessageTable.id });

        // Update session last activity
        await db
            .update(ChatSessionTable)
            .set({
                lastActivityAt: new Date(),
                updatedAt: new Date()
            })
            .where(eq(ChatSessionTable.id, sessionId));

        // Update analytics
        const responseTime = Date.now() - startTime;
        const currentMessageCount = currentAnalytics?.messageCount || 0;
        const sessionDuration = Math.floor((Date.now() - session.createdAt.getTime()) / 1000);

        await db
            .update(ChatAnalyticsTable)
            .set({
                messageCount: currentMessageCount + 2,
                averageResponseTime: responseTime,
                dominantEmotion: emotionDetection.emotion as any,
                sessionDuration: sessionDuration,
            })
            .where(eq(ChatAnalyticsTable.sessionId, sessionId));

        revalidatePath('/chat');

        return {
            success: true,
            message: aiResponse.content,
            emotion: emotionDetection.emotion,
            copingStrategies: aiResponse.copingStrategies,
            sessionId,
            messageId: aiMessage.id,
            analytics: {
                responseTime,
                emotionConfidence: emotionDetection.confidence,
            }
        };
    } catch (error) {
        console.error("Error in chat service:", error);
        throw new Error("Failed to process message");
    }
}

// Get chat session messages
export async function getSessionMessages(sessionId: string) {
    try {
        const user = await getUserFromSession();
        if (!user) {
            throw new Error('User not authenticated');
        }

        const messages = await db.query.ChatMessageTable.findMany({
            where: eq(ChatMessageTable.sessionId, sessionId),
            orderBy: [ChatMessageTable.createdAt],
        });

        return { success: true, messages };
    } catch (error) {
        console.error("Error fetching session messages:", error);
        return { success: false, error: "Failed to fetch messages" };
    }
}

// Get user's chat sessions
export async function getUserSessions() {
    try {
        const user = await getUserFromSession();
        if (!user) {
            throw new Error('User not authenticated');
        }

        const sessions = await db.query.ChatSessionTable.findMany({
            where: eq(ChatSessionTable.userId, user.id),
            orderBy: [desc(ChatSessionTable.lastActivityAt)],
            limit: 50,
        });

        return { success: true, sessions };
    } catch (error) {
        console.error("Error fetching user sessions:", error);
        return { success: false, error: "Failed to fetch sessions" };
    }
}

// Update session (title, status, etc.)
export async function updateChatSession(data: UpdateSession) {
    try {
        const user = await getUserFromSession();
        if (!user) {
            throw new Error('User not authenticated');
        }

        // Verify session ownership
        const session = await db.query.ChatSessionTable.findFirst({
            where: eq(ChatSessionTable.id, data.id),
        });

        if (!session || session.userId !== user.id) {
            throw new Error('Invalid session');
        }

        const [updatedSession] = await db
            .update(ChatSessionTable)
            .set({
                ...(data.title && { title: data.title }),
                ...(data.status && { status: data.status }),
                ...(data.context && { context: data.context }),
                ...(data.metadata && { metadata: data.metadata }),
                updatedAt: new Date(),
            })
            .where(eq(ChatSessionTable.id, data.id))
            .returning();

        return { success: true, session: updatedSession };
    } catch (error) {
        console.error("Error updating chat session:", error);
        return { success: false, error: "Failed to update session" };
    }
}

// Track user emotion
export async function trackUserEmotion(data: EmotionTracking) {
    try {
        const user = await getUserFromSession();
        if (!user) {
            throw new Error('User not authenticated');
        }

        const [emotionRecord] = await db
            .insert(UserEmotionTable)
            .values({
                userId: user.id,
                emotion: data.emotion as any,
                intensity: data.intensity,
                context: data.context,
                sessionId: data.sessionId,
            })
            .returning();

        return { success: true, emotionRecord };
    } catch (error) {
        console.error("Error tracking user emotion:", error);
        return { success: false, error: "Failed to track emotion" };
    }
}

// Get session analytics
export async function getSessionAnalytics(sessionId: string) {
    try {
        const user = await getUserFromSession();
        if (!user) {
            throw new Error('User not authenticated');
        }

        const analytics = await db.query.ChatAnalyticsTable.findFirst({
            where: eq(ChatAnalyticsTable.sessionId, sessionId),
        });

        return { success: true, analytics };
    } catch (error) {
        console.error("Error fetching session analytics:", error);
        return { success: false, error: "Failed to fetch analytics" };
    }
} 