PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_products` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`price_cents` integer,
	`material` text NOT NULL,
	`dimensions` text NOT NULL,
	`sku` text NOT NULL,
	`status` text DEFAULT 'available' NOT NULL,
	`description` text NOT NULL,
	`images` text DEFAULT '[]' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_products`("id", "slug", "name", "category", "price_cents", "material", "dimensions", "sku", "status", "description", "images", "created_at", "updated_at") SELECT "id", "slug", "name", "category", "price_cents", "material", "dimensions", "sku", "status", "description", "images", "created_at", "updated_at" FROM `products`;--> statement-breakpoint
DROP TABLE `products`;--> statement-breakpoint
ALTER TABLE `__new_products` RENAME TO `products`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);