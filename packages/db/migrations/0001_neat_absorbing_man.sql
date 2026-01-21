ALTER TABLE "vocabulary" ADD COLUMN "part_of_speech" text;--> statement-breakpoint
ALTER TABLE "vocabulary" ADD COLUMN "category" text;--> statement-breakpoint
CREATE INDEX "vocabulary_category_idx" ON "vocabulary" USING btree ("category");