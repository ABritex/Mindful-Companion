CREATE TYPE "public"."campus_enum" AS ENUM('Main', 'North', 'South', 'East', 'West');--> statement-breakpoint
ALTER TYPE "public"."oauth_provides" ADD VALUE 'google';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "employeeId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "authType" text DEFAULT 'password' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_verified" text DEFAULT 'false' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "profilePicture" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "campus" "campus_enum" NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "officeOrDept" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_employeeId_unique" UNIQUE("employeeId");