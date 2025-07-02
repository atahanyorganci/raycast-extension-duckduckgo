-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `moz_origins` (
	`id` integer PRIMARY KEY,
	`prefix` text NOT NULL,
	`host` text NOT NULL,
	`frecency` integer NOT NULL,
	`recalc_frecency` integer DEFAULT 0 NOT NULL,
	`alt_frecency` integer,
	`recalc_alt_frecency` integer DEFAULT 0 NOT NULL,
	CONSTRAINT "moz_places_metadata_check_1" CHECK(place_id != referrer_place_id)
);
--> statement-breakpoint
CREATE TABLE `moz_places` (
	`id` integer PRIMARY KEY,
	`url` numeric,
	`title` numeric,
	`rev_host` numeric,
	`visit_count` integer DEFAULT 0,
	`hidden` integer DEFAULT 0 NOT NULL,
	`typed` integer DEFAULT 0 NOT NULL,
	`frecency` integer DEFAULT -1 NOT NULL,
	`last_visit_date` integer,
	`guid` text,
	`foreign_count` integer DEFAULT 0 NOT NULL,
	`url_hash` integer DEFAULT 0 NOT NULL,
	`description` text,
	`preview_image_url` text,
	`site_name` text,
	`origin_id` integer,
	`recalc_frecency` integer DEFAULT 0 NOT NULL,
	`alt_frecency` integer,
	`recalc_alt_frecency` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`origin_id`) REFERENCES `moz_origins`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "moz_places_metadata_check_1" CHECK(place_id != referrer_place_id)
);
--> statement-breakpoint
CREATE INDEX `moz_places_altfrecencyindex` ON `moz_places` (`alt_frecency`);--> statement-breakpoint
CREATE INDEX `moz_places_originidindex` ON `moz_places` (`origin_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `moz_places_guid_uniqueindex` ON `moz_places` (`guid`);--> statement-breakpoint
CREATE INDEX `moz_places_lastvisitdateindex` ON `moz_places` (`last_visit_date`);--> statement-breakpoint
CREATE INDEX `moz_places_frecencyindex` ON `moz_places` (`frecency`);--> statement-breakpoint
CREATE INDEX `moz_places_visitcount` ON `moz_places` (`visit_count`);--> statement-breakpoint
CREATE INDEX `moz_places_hostindex` ON `moz_places` (`rev_host`);--> statement-breakpoint
CREATE INDEX `moz_places_url_hashindex` ON `moz_places` (`url_hash`);--> statement-breakpoint
CREATE TABLE `moz_places_extra` (
	`place_id` integer PRIMARY KEY NOT NULL,
	`sync_json` text,
	FOREIGN KEY (`place_id`) REFERENCES `moz_places`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "moz_places_metadata_check_1" CHECK(place_id != referrer_place_id)
);
--> statement-breakpoint
CREATE TABLE `moz_historyvisits` (
	`id` integer PRIMARY KEY,
	`from_visit` integer,
	`place_id` integer,
	`visit_date` integer,
	`visit_type` integer,
	`session` integer,
	`source` integer DEFAULT 0 NOT NULL,
	`triggeringPlaceId` integer,
	CONSTRAINT "moz_places_metadata_check_1" CHECK(place_id != referrer_place_id)
);
--> statement-breakpoint
CREATE INDEX `moz_historyvisits_dateindex` ON `moz_historyvisits` (`visit_date`);--> statement-breakpoint
CREATE INDEX `moz_historyvisits_fromindex` ON `moz_historyvisits` (`from_visit`);--> statement-breakpoint
CREATE INDEX `moz_historyvisits_placedateindex` ON `moz_historyvisits` (`place_id`,`visit_date`);--> statement-breakpoint
CREATE TABLE `moz_historyvisits_extra` (
	`visit_id` integer PRIMARY KEY NOT NULL,
	`sync_json` text,
	FOREIGN KEY (`visit_id`) REFERENCES `moz_historyvisits`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "moz_places_metadata_check_1" CHECK(place_id != referrer_place_id)
);
--> statement-breakpoint
CREATE TABLE `moz_inputhistory` (
	`place_id` integer NOT NULL,
	`input` numeric NOT NULL,
	`use_count` integer,
	PRIMARY KEY(`place_id`, `input`),
	CONSTRAINT "moz_places_metadata_check_1" CHECK(place_id != referrer_place_id)
);
--> statement-breakpoint
CREATE TABLE `moz_bookmarks` (
	`id` integer PRIMARY KEY,
	`type` integer,
	`fk` integer DEFAULT (NULL),
	`parent` integer,
	`position` integer,
	`title` numeric,
	`keyword_id` integer,
	`folder_type` text,
	`dateAdded` integer,
	`lastModified` integer,
	`guid` text,
	`syncStatus` integer DEFAULT 0 NOT NULL,
	`syncChangeCounter` integer DEFAULT 1 NOT NULL,
	CONSTRAINT "moz_places_metadata_check_1" CHECK(place_id != referrer_place_id)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `moz_bookmarks_guid_uniqueindex` ON `moz_bookmarks` (`guid`);--> statement-breakpoint
CREATE INDEX `moz_bookmarks_dateaddedindex` ON `moz_bookmarks` (`dateAdded`);--> statement-breakpoint
CREATE INDEX `moz_bookmarks_itemlastmodifiedindex` ON `moz_bookmarks` (`fk`,`lastModified`);--> statement-breakpoint
CREATE INDEX `moz_bookmarks_parentindex` ON `moz_bookmarks` (`parent`,`position`);--> statement-breakpoint
CREATE INDEX `moz_bookmarks_itemindex` ON `moz_bookmarks` (`fk`,`type`);--> statement-breakpoint
CREATE TABLE `moz_bookmarks_deleted` (
	`guid` text PRIMARY KEY,
	`dateRemoved` integer DEFAULT 0 NOT NULL,
	CONSTRAINT "moz_places_metadata_check_1" CHECK(place_id != referrer_place_id)
);
--> statement-breakpoint
CREATE TABLE `moz_keywords` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`keyword` text,
	`place_id` integer,
	`post_data` text,
	CONSTRAINT "moz_places_metadata_check_1" CHECK(place_id != referrer_place_id)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `moz_keywords_placepostdata_uniqueindex` ON `moz_keywords` (`place_id`,`post_data`);--> statement-breakpoint
CREATE TABLE `moz_anno_attributes` (
	`id` integer PRIMARY KEY,
	`name` text(32) NOT NULL,
	CONSTRAINT "moz_places_metadata_check_1" CHECK(place_id != referrer_place_id)
);
--> statement-breakpoint
CREATE TABLE `moz_annos` (
	`id` integer PRIMARY KEY,
	`place_id` integer NOT NULL,
	`anno_attribute_id` integer,
	`content` numeric,
	`flags` integer DEFAULT 0,
	`expiration` integer DEFAULT 0,
	`type` integer DEFAULT 0,
	`dateAdded` integer DEFAULT 0,
	`lastModified` integer DEFAULT 0,
	CONSTRAINT "moz_places_metadata_check_1" CHECK(place_id != referrer_place_id)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `moz_annos_placeattributeindex` ON `moz_annos` (`place_id`,`anno_attribute_id`);--> statement-breakpoint
CREATE TABLE `moz_items_annos` (
	`id` integer PRIMARY KEY,
	`item_id` integer NOT NULL,
	`anno_attribute_id` integer,
	`content` numeric,
	`flags` integer DEFAULT 0,
	`expiration` integer DEFAULT 0,
	`type` integer DEFAULT 0,
	`dateAdded` integer DEFAULT 0,
	`lastModified` integer DEFAULT 0,
	CONSTRAINT "moz_places_metadata_check_1" CHECK(place_id != referrer_place_id)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `moz_items_annos_itemattributeindex` ON `moz_items_annos` (`item_id`,`anno_attribute_id`);--> statement-breakpoint
CREATE TABLE `moz_meta` (
	`key` text PRIMARY KEY NOT NULL,
	`value` numeric NOT NULL,
	CONSTRAINT "moz_places_metadata_check_1" CHECK(place_id != referrer_place_id)
);
--> statement-breakpoint
CREATE TABLE `moz_places_metadata` (
	`id` integer PRIMARY KEY,
	`place_id` integer NOT NULL,
	`referrer_place_id` integer,
	`created_at` integer DEFAULT 0 NOT NULL,
	`updated_at` integer DEFAULT 0 NOT NULL,
	`total_view_time` integer DEFAULT 0 NOT NULL,
	`typing_time` integer DEFAULT 0 NOT NULL,
	`key_presses` integer DEFAULT 0 NOT NULL,
	`scrolling_time` integer DEFAULT 0 NOT NULL,
	`scrolling_distance` integer DEFAULT 0 NOT NULL,
	`document_type` integer DEFAULT 0 NOT NULL,
	`search_query_id` integer,
	FOREIGN KEY (`search_query_id`) REFERENCES `moz_places_metadata_search_queries`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`referrer_place_id`) REFERENCES `moz_places`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`place_id`) REFERENCES `moz_places`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "moz_places_metadata_check_1" CHECK(place_id != referrer_place_id)
);
--> statement-breakpoint
CREATE INDEX `moz_places_metadata_referrerindex` ON `moz_places_metadata` (`referrer_place_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `moz_places_metadata_placecreated_uniqueindex` ON `moz_places_metadata` (`place_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `moz_places_metadata_search_queries` (
	`id` integer PRIMARY KEY,
	`terms` text NOT NULL,
	CONSTRAINT "moz_places_metadata_check_1" CHECK(place_id != referrer_place_id)
);
--> statement-breakpoint
CREATE TABLE `moz_previews_tombstones` (
	`hash` text PRIMARY KEY NOT NULL,
	CONSTRAINT "moz_places_metadata_check_1" CHECK(place_id != referrer_place_id)
);

*/