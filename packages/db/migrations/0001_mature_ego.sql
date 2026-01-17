CREATE TABLE "user_stats" (
	"user_id" text PRIMARY KEY NOT NULL,
	"total_answered" integer DEFAULT 0 NOT NULL,
	"correct_answers" integer DEFAULT 0 NOT NULL,
	"streak" integer DEFAULT 0 NOT NULL,
	"last_active_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vocabulary" (
	"id" serial PRIMARY KEY NOT NULL,
	"word" text NOT NULL,
	"reading" text,
	"meaning" text NOT NULL,
	"level_id" integer
);
--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "level_id" TO "current_level_id";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_level_id_levels_id_fk";
--> statement-breakpoint
DROP INDEX "account_userId_idx";--> statement-breakpoint
DROP INDEX "session_userId_idx";--> statement-breakpoint
ALTER TABLE "user_progress" ADD COLUMN "answered_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "user_progress" ADD COLUMN "next_review_at" timestamp;--> statement-breakpoint
ALTER TABLE "user_progress" ADD COLUMN "ease_factor" integer DEFAULT 250;--> statement-breakpoint
ALTER TABLE "user_stats" ADD CONSTRAINT "user_stats_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vocabulary" ADD CONSTRAINT "vocabulary_level_id_levels_id_fk" FOREIGN KEY ("level_id") REFERENCES "public"."levels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "vocabulary_level_id_idx" ON "vocabulary" USING btree ("level_id");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_current_level_id_levels_id_fk" FOREIGN KEY ("current_level_id") REFERENCES "public"."levels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "questions_level_id_idx" ON "questions" USING btree ("level_id");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_question_unique_idx" ON "user_progress" USING btree ("user_id","question_id");--> statement-breakpoint
CREATE INDEX "user_progress_user_idx" ON "user_progress" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_progress_question_idx" ON "user_progress" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "user_progress_last_attempt_idx" ON "user_progress" USING btree ("last_attempted_at");