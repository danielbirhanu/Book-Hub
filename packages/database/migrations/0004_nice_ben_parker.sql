DROP INDEX `books_rating_idx`;--> statement-breakpoint
ALTER TABLE `books` DROP COLUMN `rating_average`;--> statement-breakpoint
ALTER TABLE `books` DROP COLUMN `rating_count`;