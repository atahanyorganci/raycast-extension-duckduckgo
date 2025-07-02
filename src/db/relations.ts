import { relations } from "drizzle-orm/relations";
import { mozHistoryvisits, mozHistoryvisitsExtra, mozOrigins, mozPlaces, mozPlacesExtra, mozPlacesMetadata, mozPlacesMetadataSearchQueries } from "./schema";

export const mozPlacesRelations = relations(mozPlaces, ({ one, many }) => ({
	mozOrigin: one(mozOrigins, {
		fields: [mozPlaces.originId],
		references: [mozOrigins.id],
	}),
	mozPlacesExtras: many(mozPlacesExtra),
	mozPlacesMetadata_referrerPlaceId: many(mozPlacesMetadata, {
		relationName: "mozPlacesMetadata_referrerPlaceId_mozPlaces_id",
	}),
	mozPlacesMetadata_placeId: many(mozPlacesMetadata, {
		relationName: "mozPlacesMetadata_placeId_mozPlaces_id",
	}),
}));

export const mozOriginsRelations = relations(mozOrigins, ({ many }) => ({
	mozPlaces: many(mozPlaces),
}));

export const mozPlacesExtraRelations = relations(mozPlacesExtra, ({ one }) => ({
	mozPlace: one(mozPlaces, {
		fields: [mozPlacesExtra.placeId],
		references: [mozPlaces.id],
	}),
}));

export const mozHistoryvisitsExtraRelations = relations(mozHistoryvisitsExtra, ({ one }) => ({
	mozHistoryvisit: one(mozHistoryvisits, {
		fields: [mozHistoryvisitsExtra.visitId],
		references: [mozHistoryvisits.id],
	}),
}));

export const mozHistoryvisitsRelations = relations(mozHistoryvisits, ({ many }) => ({
	mozHistoryvisitsExtras: many(mozHistoryvisitsExtra),
}));

export const mozPlacesMetadataRelations = relations(mozPlacesMetadata, ({ one }) => ({
	mozPlacesMetadataSearchQuery: one(mozPlacesMetadataSearchQueries, {
		fields: [mozPlacesMetadata.searchQueryId],
		references: [mozPlacesMetadataSearchQueries.id],
	}),
	mozPlace_referrerPlaceId: one(mozPlaces, {
		fields: [mozPlacesMetadata.referrerPlaceId],
		references: [mozPlaces.id],
		relationName: "mozPlacesMetadata_referrerPlaceId_mozPlaces_id",
	}),
	mozPlace_placeId: one(mozPlaces, {
		fields: [mozPlacesMetadata.placeId],
		references: [mozPlaces.id],
		relationName: "mozPlacesMetadata_placeId_mozPlaces_id",
	}),
}));

export const mozPlacesMetadataSearchQueriesRelations = relations(mozPlacesMetadataSearchQueries, ({ many }) => ({
	mozPlacesMetadata: many(mozPlacesMetadata),
}));
