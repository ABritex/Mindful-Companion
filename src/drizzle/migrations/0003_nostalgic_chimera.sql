CREATE TYPE "public"."emotion_types" AS ENUM('happy', 'sad', 'anxious', 'angry', 'neutral', 'excited', 'frustrated', 'calm', 'stressed', 'grateful');--> statement-breakpoint
CREATE TYPE "public"."message_roles" AS ENUM('user', 'assistant', 'system');--> statement-breakpoint
CREATE TYPE "public"."session_statuses" AS ENUM('active', 'paused', 'completed', 'archived');--> statement-breakpoint
CREATE TABLE "ai_response_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"emotion" "emotion_types" NOT NULL,
	"responseType" text NOT NULL,
	"content" text NOT NULL,
	"copingStrategies" jsonb,
	"isActive" boolean DEFAULT true NOT NULL,
	"priority" integer DEFAULT 1 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_analytics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sessionId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"messageCount" integer DEFAULT 0 NOT NULL,
	"averageResponseTime" integer,
	"dominantEmotion" "emotion_types",
	"sessionDuration" integer,
	"userSatisfaction" integer,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sessionId" uuid NOT NULL,
	"role" "message_roles" NOT NULL,
	"content" text NOT NULL,
	"emotion" "emotion_types",
	"confidence" integer,
	"tokens" integer,
	"metadata" jsonb,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"title" text NOT NULL,
	"status" "session_statuses" DEFAULT 'active' NOT NULL,
	"context" jsonb,
	"metadata" jsonb,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"lastActivityAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_emotions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"emotion" "emotion_types" NOT NULL,
	"intensity" integer NOT NULL,
	"context" text,
	"sessionId" uuid,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chat_analytics" ADD CONSTRAINT "chat_analytics_sessionId_chat_sessions_id_fk" FOREIGN KEY ("sessionId") REFERENCES "public"."chat_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_analytics" ADD CONSTRAINT "chat_analytics_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_sessionId_chat_sessions_id_fk" FOREIGN KEY ("sessionId") REFERENCES "public"."chat_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_emotions" ADD CONSTRAINT "user_emotions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_emotions" ADD CONSTRAINT "user_emotions_sessionId_chat_sessions_id_fk" FOREIGN KEY ("sessionId") REFERENCES "public"."chat_sessions"("id") ON DELETE set null ON UPDATE no action;