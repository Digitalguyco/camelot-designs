CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`location` text NOT NULL,
	`project_type` text NOT NULL,
	`scope` text NOT NULL,
	`concept` text NOT NULL,
	`materials` text NOT NULL,
	`role` text NOT NULL,
	`images` text DEFAULT '[]' NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `projects_slug_unique` ON `projects` (`slug`);