CREATE TABLE `product_variants` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`label` text DEFAULT '' NOT NULL,
	`sku` text NOT NULL,
	`dimensions` text NOT NULL,
	`price_cents` integer,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `product_variants_sku_unique` ON `product_variants` (`sku`);--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `price_cents`;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `dimensions`;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `sku`;