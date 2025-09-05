import { z } from "zod"
import { EmotionType, MessageRole, SessionStatus } from "@/drizzle/schema"

// Message schemas
export const messageSchema = z.object({
    id: z.string(),
    content: z.string().min(1, "Message cannot be empty"),
    role: z.enum(["user", "assistant", "system"] as const),
    timestamp: z.date(),
    emotion: z.string().optional(),
    confidence: z.number().optional(),
})

// Chat message schema (excludes system messages)
export const chatMessageSchema = z.object({
    id: z.string(),
    content: z.string().min(1, "Message cannot be empty"),
    role: z.enum(["user", "assistant"] as const),
    timestamp: z.date(),
    emotion: z.string().optional(),
    confidence: z.number().optional(),
})

export const createMessageSchema = z.object({
    content: z.string().min(1, "Message cannot be empty"),
    role: z.enum(["user", "assistant", "system"] as const),
    emotion: z.string().optional(),
    confidence: z.number().optional(),
})

// Session schemas
export const sessionSchema = z.object({
    id: z.string(),
    title: z.string(),
    status: z.enum(["active", "paused", "completed", "archived"] as const),
    createdAt: z.date(),
    updatedAt: z.date(),
    lastActivityAt: z.date(),
})

export const createSessionSchema = z.object({
    title: z.string().min(1, "Session title is required"),
    context: z.record(z.any()).optional(),
    metadata: z.record(z.any()).optional(),
})

export const updateSessionSchema = z.object({
    id: z.string(),
    title: z.string().optional(),
    status: z.enum(["active", "paused", "completed", "archived"] as const).optional(),
    context: z.record(z.any()).optional(),
    metadata: z.record(z.any()).optional(),
})

// Chat request schemas
export const sendMessageSchema = z.object({
    content: z.string().min(1, "Message cannot be empty"),
    sessionId: z.string().min(1, "Session ID is required"),
    context: z.record(z.any()).optional(),
})

export const chatResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    emotion: z.string().optional(),
    copingStrategies: z.array(z.string()).optional(),
    sessionId: z.string(),
    messageId: z.string(),
    analytics: z.object({
        responseTime: z.number(),
        tokens: z.number().optional(),
        emotionConfidence: z.number().optional(),
    }).optional(),
})

// Emotion tracking schemas
export const emotionTrackingSchema = z.object({
    emotion: z.enum(["happy", "sad", "anxious", "angry", "neutral", "excited", "frustrated", "calm", "stressed", "grateful"] as const),
    intensity: z.number().min(1).max(10),
    context: z.string().optional(),
    sessionId: z.string().optional(),
})

// Analytics schemas
export const sessionAnalyticsSchema = z.object({
    sessionId: z.string(),
    messageCount: z.number(),
    averageResponseTime: z.number(),
    dominantEmotion: z.string().optional(),
    sessionDuration: z.number(),
    userSatisfaction: z.number().min(1).max(5).optional(),
})

// AI Response schemas
export const aiResponseRequestSchema = z.object({
    userMessage: z.string(),
    userEmotion: z.string().optional(),
    conversationHistory: z.array(z.object({
        role: z.enum(["user", "assistant"] as const),
        content: z.string(),
        emotion: z.string().optional(),
    })).optional(),
    context: z.record(z.any()).optional(),
})

export const aiResponseSchema = z.object({
    content: z.string(),
    emotion: z.string().optional(),
    copingStrategies: z.array(z.string()).optional(),
    responseType: z.enum(["comfort", "guidance", "celebration", "coping", "general"] as const),
    metadata: z.record(z.any()).optional(),
})

// Export types
export type Message = z.infer<typeof messageSchema>
export type CreateMessage = z.infer<typeof createMessageSchema>
export type Session = z.infer<typeof sessionSchema>
export type CreateSession = z.infer<typeof createSessionSchema>
export type UpdateSession = z.infer<typeof updateSessionSchema>
export type SendMessage = z.infer<typeof sendMessageSchema>
export type ChatResponse = z.infer<typeof chatResponseSchema>
export type EmotionTracking = z.infer<typeof emotionTrackingSchema>
export type SessionAnalytics = z.infer<typeof sessionAnalyticsSchema>
export type AIResponseRequest = z.infer<typeof aiResponseRequestSchema>
export type AIResponse = z.infer<typeof aiResponseSchema> 