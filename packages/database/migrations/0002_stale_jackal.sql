CREATE TABLE `reading_statuses` (
	`user_id` text NOT NULL,
	`book_id` text NOT NULL,
	`status` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `reading_statuses_user_book_idx` ON `reading_statuses` (`user_id`,`book_id`);--> statement-breakpoint
CREATE INDEX `reading_statuses_user_idx` ON `reading_statuses` (`user_id`,`updated_at`);