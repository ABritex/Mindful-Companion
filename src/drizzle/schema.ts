import { relations } from "drizzle-orm"
import { pgEnum, pgTable, primaryKey, text, timestamp, uuid, integer, jsonb, boolean } from "drizzle-orm/pg-core"

export const userRoles = ["admin", "user"] as const
export type UserRole = (typeof userRoles)[number]
export const userRoleEnum = pgEnum("user_roles", userRoles)

export const campuses = ["Main", "North", "South", "East", "West"] as const
export type Campus = (typeof campuses)[number]
export const campusEnum = pgEnum("campus_enum", campuses)

// Chat-related enums
export const messageRoles = ["user", "assistant", "system"] as const
export type MessageRole = (typeof messageRoles)[number]
export const messageRoleEnum = pgEnum("message_roles", messageRoles)

export const emotionTypes = [
    "happy",
    "sad",
    "anxious",
    "angry",
    "neutral",
    "excited",
    "frustrated",
    "calm",
    "stressed",
    "grateful",
] as const
export type EmotionType = (typeof emotionTypes)[number]
export const emotionTypeEnum = pgEnum("emotion_types", emotionTypes)

export const sessionStatuses = ["active", "paused", "completed", "archived"] as const
export type SessionStatus = (typeof sessionStatuses)[number]
export const sessionStatusEnum = pgEnum("session_statuses", sessionStatuses)

export const UserTable = pgTable("users", {
    id: uuid().primaryKey().defaultRandom(),
    employeeId: text().notNull().unique(),
    name: text().notNull(),
    email: text().notNull().unique(),
    password: text(),
    salt: text(),
    authType: text().notNull().default("password"),
    isProfileComplete: text("is_profile_complete").notNull().default("false"),
    hasCompletedPreAssessment: text("has_completed_pre_assessment").notNull().default("false"),
    profilePicture: text(),
    role: userRoleEnum().notNull().default("user"),
    campus: campusEnum().notNull(),
    officeOrDept: text().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
})

export const PreAssessmentTable = pgTable("pre_assessments", {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid()
        .notNull()
        .references(() => UserTable.id, { onDelete: "cascade" }),

    // Work and Daily Functioning scores (0-3)
    workOverwhelmed: integer().notNull(),
    concentrationDifficulty: integer().notNull(),
    procrastination: integer().notNull(),
    irritability: integer().notNull(),
    lackAccomplishment: integer().notNull(),
    troubleSwitchingOff: integer().notNull(),

    // Mood and Emotions scores (0-3)
    feelingDown: integer().notNull(),
    losingInterest: integer().notNull(),
    feelingAnxious: integer().notNull(),
    moodSwings: integer().notNull(),
    feelingGuilty: integer().notNull(),

    // Physical and Behavioral Changes scores (0-3)
    sleepProblems: integer().notNull(),
    appetiteChanges: integer().notNull(),
    feelingTired: integer().notNull(),
    physicalSymptoms: integer().notNull(),
    substanceUse: integer().notNull(),
    withdrawing: integer().notNull(),

    // Thoughts and Safety scores (0-3)
    thoughtsOfHarm: integer().notNull(),
    lifeNotWorthLiving: integer().notNull(),
    worriedAboutStudents: integer().notNull(),

    // Additional data
    copingMechanisms: jsonb().notNull(), // Array of selected coping mechanisms
    goals: jsonb().notNull(), // Array of selected wellness goals

    // Calculated scores and AI analysis
    totalScore: integer().notNull(),
    riskLevel: text().notNull(), // "low", "moderate", "high", "severe"
    aiAnalysis: jsonb(), // Claude Sonnet's analysis and recommendations
    personalizedPlan: jsonb(), // AI-generated personalized support plan

    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
})

// Chat Sessions Table
export const ChatSessionTable = pgTable("chat_sessions", {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid()
        .notNull()
        .references(() => UserTable.id, { onDelete: "cascade" }),
    title: text().notNull(),
    status: sessionStatusEnum().notNull().default("active"),
    context: jsonb(), // Store conversation context, user preferences, etc.
    metadata: jsonb(), // Store additional session data
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    lastActivityAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})

// Chat Messages Table
export const ChatMessageTable = pgTable("chat_messages", {
    id: uuid().primaryKey().defaultRandom(),
    sessionId: uuid()
        .notNull()
        .references(() => ChatSessionTable.id, { onDelete: "cascade" }),
    role: messageRoleEnum().notNull(),
    content: text().notNull(),
    emotion: emotionTypeEnum(), // Detected emotion from user message
    confidence: integer(), // Emotion detection confidence (0-100)
    tokens: integer(), // Token count for AI responses
    metadata: jsonb(), // Store additional message data
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})

// User Emotions Table (for tracking emotional patterns)
export const UserEmotionTable = pgTable("user_emotions", {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid()
        .notNull()
        .references(() => UserTable.id, { onDelete: "cascade" }),
    emotion: emotionTypeEnum().notNull(),
    intensity: integer().notNull(), // 1-10 scale
    context: text(), // What triggered this emotion
    sessionId: uuid().references(() => ChatSessionTable.id, { onDelete: "set null" }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})

// AI Response Templates Table
export const AIResponseTemplateTable = pgTable("ai_response_templates", {
    id: uuid().primaryKey().defaultRandom(),
    emotion: emotionTypeEnum().notNull(),
    responseType: text().notNull(), // "comfort", "guidance", "celebration", "coping"
    content: text().notNull(),
    copingStrategies: jsonb(), // Array of coping strategies
    isActive: boolean().notNull().default(true),
    priority: integer().notNull().default(1), // Higher priority responses used first
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
})

// Chat Analytics Table
export const ChatAnalyticsTable = pgTable("chat_analytics", {
    id: uuid().primaryKey().defaultRandom(),
    sessionId: uuid()
        .notNull()
        .references(() => ChatSessionTable.id, { onDelete: "cascade" }),
    userId: uuid()
        .notNull()
        .references(() => UserTable.id, { onDelete: "cascade" }),
    messageCount: integer().notNull().default(0),
    averageResponseTime: integer(), // in milliseconds
    dominantEmotion: emotionTypeEnum(),
    sessionDuration: integer(), // in seconds
    userSatisfaction: integer(), // 1-5 rating
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})

export const oAuthProviders = ["discord", "github", "google"] as const
export type OAuthProvider = (typeof oAuthProviders)[number]
export const oAuthProviderEnum = pgEnum("oauth_provides", oAuthProviders)

export const UserOAuthAccountTable = pgTable(
    "user_oauth_accounts",
    {
        userId: uuid()
            .notNull()
            .references(() => UserTable.id, { onDelete: "cascade" }),
        provider: oAuthProviderEnum().notNull(),
        providerAccountId: text().notNull().unique(),
        createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp({ withTimezone: true })
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (t) => [primaryKey({ columns: [t.providerAccountId, t.provider] })],
)

// Relations
export const userRelations = relations(UserTable, ({ many, one }) => ({
    oAuthAccounts: many(UserOAuthAccountTable),
    chatSessions: many(ChatSessionTable),
    userEmotions: many(UserEmotionTable),
    chatAnalytics: many(ChatAnalyticsTable),
    preAssessment: one(PreAssessmentTable), // One-to-one relationship
}))

export const preAssessmentRelations = relations(PreAssessmentTable, ({ one }) => ({
    user: one(UserTable, {
        fields: [PreAssessmentTable.userId],
        references: [UserTable.id],
    }),
}))

export const chatSessionRelations = relations(ChatSessionTable, ({ one, many }) => ({
    user: one(UserTable, {
        fields: [ChatSessionTable.userId],
        references: [UserTable.id],
    }),
    messages: many(ChatMessageTable),
    userEmotions: many(UserEmotionTable),
    analytics: many(ChatAnalyticsTable),
}))

export const chatMessageRelations = relations(ChatMessageTable, ({ one }) => ({
    session: one(ChatSessionTable, {
        fields: [ChatMessageTable.sessionId],
        references: [ChatSessionTable.id],
    }),
}))

export const userEmotionRelations = relations(UserEmotionTable, ({ one }) => ({
    user: one(UserTable, {
        fields: [UserEmotionTable.userId],
        references: [UserTable.id],
    }),
    session: one(ChatSessionTable, {
        fields: [UserEmotionTable.sessionId],
        references: [ChatSessionTable.id],
    }),
}))

export const userOauthAccountRelationships = relations(UserOAuthAccountTable, ({ one }) => ({
    user: one(UserTable, {
        fields: [UserOAuthAccountTable.userId],
        references: [UserTable.id],
    }),
}))
