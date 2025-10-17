CREATE TABLE `user_session` (
	`id` integer PRIMARY KEY NOT NULL,
	`token` text,
	`userData` text NOT NULL,
	`dateLastSession` integer NOT NULL,
	`statusSession` integer NOT NULL,
	`finLastSession` integer NOT NULL
);
