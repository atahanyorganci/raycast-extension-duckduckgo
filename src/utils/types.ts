import { z } from "zod";

export const HISTORY_KEY = "history";

export const SearchResultSchema = z.object({
	id: z.string(),
	description: z.string().optional(),
	query: z.string(),
	url: z.string(),
	isNavigation: z.boolean().optional(),
	isHistory: z.boolean().optional(),
});

export type SearchResult = z.infer<typeof SearchResultSchema>;
