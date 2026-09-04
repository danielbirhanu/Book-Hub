CREATE TABLE `authors` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`biography` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `authors_slug_idx` ON `authors` (`slug`);--> statement-breakpoint
CREATE TABLE `book_authors` (
	`book_id` text NOT NULL,
	`author_id` text NOT NULL,
	FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`author_id`) REFERENCES `authors`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `book_authors_unique_idx` ON `book_authors` (`book_id`,`author_id`);--> statement-breakpoint
CREATE TABLE `book_genres` (
	`book_id` text NOT NULL,
	`genre_id` text NOT NULL,
	FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`genre_id`) REFERENCES `genres`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `book_genres_unique_idx` ON `book_genres` (`book_id`,`genre_id`);--> statement-breakpoint
CREATE INDEX `book_genres_genre_idx` ON `book_genres` (`genre_id`);--> statement-breakpoint
CREATE TABLE `books` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`summary` text NOT NULL,
	`cover_key` text,
	`published_year` integer,
	`isbn` text,
	`rating_average` real DEFAULT 0 NOT NULL,
	`rating_count` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'published' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `books_slug_idx` ON `books` (`slug`);--> statement-breakpoint
CREATE INDEX `books_published_idx` ON `books` (`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `books_rating_idx` ON `books` (`rating_average`,`rating_count`);--> statement-breakpoint
CREATE TABLE `genres` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `genres_slug_idx` ON `genres` (`slug`);--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`book_id` text NOT NULL,
	`user_id` text NOT NULL,
	`rating` integer NOT NULL,
	`body` text NOT NULL,
	`spoiler` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'published' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `reviews_book_user_idx` ON `reviews` (`book_id`,`user_id`);--> statement-breakpoint
CREATE INDEX `reviews_book_idx` ON `reviews` (`book_id`,`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`is_admin` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_idx` ON `users` (`email`);