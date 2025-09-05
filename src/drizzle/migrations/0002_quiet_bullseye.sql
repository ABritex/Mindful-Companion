ALTER TABLE "users" ADD COLUMN "is_profile_complete" text DEFAULT 'false' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "is_verified";