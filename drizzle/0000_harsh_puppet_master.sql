CREATE TABLE `packets` (
	`id` integer PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL
);
