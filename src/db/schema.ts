/* eslint-disable ts/no-use-before-define */
import { sql } from "drizzle-orm";
import { check, index, integer, numeric, primaryKey, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const mozOrigins = sqliteTable("moz_origins", {
	id: integer().primaryKey(),
	prefix: text().notNull(),
	host: text().notNull(),
	frecency: integer().notNull(),
	recalcFrecency: integer("recalc_frecency").default(0).notNull(),
	altFrecency: integer("alt_frecency"),
	recalcAltFrecency: integer("recalc_alt_frecency").default(0).notNull(),
}, () => [
	check("moz_places_metadata_check_1", sql`place_id != referrer_place_id`),
]);

export const mozPlaces = sqliteTable("moz_places", {
	id: integer().primaryKey(),
	url: numeric(),
	title: numeric(),
	revHost: numeric("rev_host"),
	visitCount: integer("visit_count").default(0),
	hidden: integer().default(0).notNull(),
	typed: integer().default(0).notNull(),
	frecency: integer().default(-1).notNull(),
	lastVisitDate: integer("last_visit_date"),
	guid: text(),
	foreignCount: integer("foreign_count").default(0).notNull(),
	urlHash: integer("url_hash").default(0).notNull(),
	description: text(),
	previewImageUrl: text("preview_image_url"),
	siteName: text("site_name"),
	originId: integer("origin_id").references(() => mozOrigins.id),
	recalcFrecency: integer("recalc_frecency").default(0).notNull(),
	altFrecency: integer("alt_frecency"),
	recalcAltFrecency: integer("recalc_alt_frecency").default(0).notNull(),
}, table => [
	index("moz_places_altfrecencyindex").on(table.altFrecency),
	index("moz_places_originidindex").on(table.originId),
	uniqueIndex("moz_places_guid_uniqueindex").on(table.guid),
	index("moz_places_lastvisitdateindex").on(table.lastVisitDate),
	index("moz_places_frecencyindex").on(table.frecency),
	index("moz_places_visitcount").on(table.visitCount),
	index("moz_places_hostindex").on(table.revHost),
	index("moz_places_url_hashindex").on(table.urlHash),
	check("moz_places_metadata_check_1", sql`place_id != referrer_place_id`),
]);

export const mozPlacesExtra = sqliteTable("moz_places_extra", {
	placeId: integer("place_id").primaryKey().notNull().references(() => mozPlaces.id, { onDelete: "cascade" }),
	syncJson: text("sync_json"),
}, () => [
	check("moz_places_metadata_check_1", sql`place_id != referrer_place_id`),
]);

export const mozHistoryvisits = sqliteTable("moz_historyvisits", {
	id: integer().primaryKey(),
	fromVisit: integer("from_visit"),
	placeId: integer("place_id"),
	visitDate: integer("visit_date"),
	visitType: integer("visit_type"),
	session: integer(),
	source: integer().default(0).notNull(),
	triggeringPlaceId: integer(),
}, table => [
	index("moz_historyvisits_dateindex").on(table.visitDate),
	index("moz_historyvisits_fromindex").on(table.fromVisit),
	index("moz_historyvisits_placedateindex").on(table.placeId, table.visitDate),
	check("moz_places_metadata_check_1", sql`place_id != referrer_place_id`),
]);

export const mozHistoryvisitsExtra = sqliteTable("moz_historyvisits_extra", {
	visitId: integer("visit_id").primaryKey().notNull().references(() => mozHistoryvisits.id, { onDelete: "cascade" }),
	syncJson: text("sync_json"),
}, () => [
	check("moz_places_metadata_check_1", sql`place_id != referrer_place_id`),
]);

export const mozInputhistory = sqliteTable("moz_inputhistory", {
	placeId: integer("place_id").notNull(),
	input: numeric().notNull(),
	useCount: integer("use_count"),
}, table => [
	primaryKey({ columns: [table.placeId, table.input], name: "moz_inputhistory_place_id_input_pk" }),
	check("moz_places_metadata_check_1", sql`place_id != referrer_place_id`),
]);

export const mozBookmarks = sqliteTable("moz_bookmarks", {
	id: integer().primaryKey(),
	type: integer(),
	fk: integer().default(sql`(NULL)`),
	parent: integer(),
	position: integer(),
	title: numeric(),
	keywordId: integer("keyword_id"),
	folderType: text("folder_type"),
	dateAdded: integer(),
	lastModified: integer(),
	guid: text(),
	syncStatus: integer().default(0).notNull(),
	syncChangeCounter: integer().default(1).notNull(),
}, table => [
	uniqueIndex("moz_bookmarks_guid_uniqueindex").on(table.guid),
	index("moz_bookmarks_dateaddedindex").on(table.dateAdded),
	index("moz_bookmarks_itemlastmodifiedindex").on(table.fk, table.lastModified),
	index("moz_bookmarks_parentindex").on(table.parent, table.position),
	index("moz_bookmarks_itemindex").on(table.fk, table.type),
	check("moz_places_metadata_check_1", sql`place_id != referrer_place_id`),
]);

export const mozBookmarksDeleted = sqliteTable("moz_bookmarks_deleted", {
	guid: text().primaryKey(),
	dateRemoved: integer().default(0).notNull(),
}, () => [
	check("moz_places_metadata_check_1", sql`place_id != referrer_place_id`),
]);

export const mozKeywords = sqliteTable("moz_keywords", {
	id: integer().primaryKey({ autoIncrement: true }),
	keyword: text(),
	placeId: integer("place_id"),
	postData: text("post_data"),
}, table => [
	uniqueIndex("moz_keywords_placepostdata_uniqueindex").on(table.placeId, table.postData),
	check("moz_places_metadata_check_1", sql`place_id != referrer_place_id`),
]);

export const mozAnnoAttributes = sqliteTable("moz_anno_attributes", {
	id: integer().primaryKey(),
	name: text({ length: 32 }).notNull(),
}, () => [
	check("moz_places_metadata_check_1", sql`place_id != referrer_place_id`),
]);

export const mozAnnos = sqliteTable("moz_annos", {
	id: integer().primaryKey(),
	placeId: integer("place_id").notNull(),
	annoAttributeId: integer("anno_attribute_id"),
	content: numeric(),
	flags: integer().default(0),
	expiration: integer().default(0),
	type: integer().default(0),
	dateAdded: integer().default(0),
	lastModified: integer().default(0),
}, table => [
	uniqueIndex("moz_annos_placeattributeindex").on(table.placeId, table.annoAttributeId),
	check("moz_places_metadata_check_1", sql`place_id != referrer_place_id`),
]);

export const mozItemsAnnos = sqliteTable("moz_items_annos", {
	id: integer().primaryKey(),
	itemId: integer("item_id").notNull(),
	annoAttributeId: integer("anno_attribute_id"),
	content: numeric(),
	flags: integer().default(0),
	expiration: integer().default(0),
	type: integer().default(0),
	dateAdded: integer().default(0),
	lastModified: integer().default(0),
}, table => [
	uniqueIndex("moz_items_annos_itemattributeindex").on(table.itemId, table.annoAttributeId),
	check("moz_places_metadata_check_1", sql`place_id != referrer_place_id`),
]);

export const mozMeta = sqliteTable("moz_meta", {
	key: text().primaryKey().notNull(),
	value: numeric().notNull(),
}, () => [
	check("moz_places_metadata_check_1", sql`place_id != referrer_place_id`),
]);

export const mozPlacesMetadata = sqliteTable("moz_places_metadata", {
	id: integer().primaryKey(),
	placeId: integer("place_id").notNull().references(() => mozPlaces.id, { onDelete: "cascade" }),
	referrerPlaceId: integer("referrer_place_id").references(() => mozPlaces.id, { onDelete: "cascade" }),
	createdAt: integer("created_at").default(0).notNull(),
	updatedAt: integer("updated_at").default(0).notNull(),
	totalViewTime: integer("total_view_time").default(0).notNull(),
	typingTime: integer("typing_time").default(0).notNull(),
	keyPresses: integer("key_presses").default(0).notNull(),
	scrollingTime: integer("scrolling_time").default(0).notNull(),
	scrollingDistance: integer("scrolling_distance").default(0).notNull(),
	documentType: integer("document_type").default(0).notNull(),
	searchQueryId: integer("search_query_id").references(() => mozPlacesMetadataSearchQueries.id, { onDelete: "cascade" }),
}, table => [
	index("moz_places_metadata_referrerindex").on(table.referrerPlaceId),
	uniqueIndex("moz_places_metadata_placecreated_uniqueindex").on(table.placeId, table.createdAt),
	check("moz_places_metadata_check_1", sql`place_id != referrer_place_id`),
]);

export const mozPlacesMetadataSearchQueries = sqliteTable("moz_places_metadata_search_queries", {
	id: integer().primaryKey(),
	terms: text().notNull(),
}, () => [
	check("moz_places_metadata_check_1", sql`place_id != referrer_place_id`),
]);

export const mozPreviewsTombstones = sqliteTable("moz_previews_tombstones", {
	hash: text().primaryKey().notNull(),
}, () => [
	check("moz_places_metadata_check_1", sql`place_id != referrer_place_id`),
]);
