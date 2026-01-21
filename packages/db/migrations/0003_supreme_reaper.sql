CREATE INDEX "vocab_pos_idx" ON "vocabulary" USING btree ("part_of_speech");--> statement-breakpoint
CREATE INDEX "vocab_word_idx" ON "vocabulary" USING btree ("word");--> statement-breakpoint
CREATE INDEX "vocab_reading_idx" ON "vocabulary" USING btree ("reading");