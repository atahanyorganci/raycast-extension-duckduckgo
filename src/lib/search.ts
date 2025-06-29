import { nanoid } from "nanoid";
import { z } from "zod";
import bangs from "./bangs.json" with { type: "json" };

export const SearchQuerySchema = z.object({
	id: z.string(),
	description: z.string().optional(),
	query: z.string(),
	url: z.string().transform(url => new URL(url)),
	isNavigation: z.boolean().optional(),
	isHistory: z.boolean().optional(),
});

export type SearchQuery = z.infer<typeof SearchQuerySchema>;

export interface SearchEngine {
	/**
	 * The tag of the bang, i.e. `!g` or `!yt`
	 */
	tag: string;
	/**
	 * The domain of the bang, i.e. `google.com`
	 */
	domain: string;
	/**
	 * The URL of the bang, i.e. `https://google.com/search?q=`
	 */
	url: string;
	/**
	 * The summary of the bang, i.e. `Google`
	 */
	summary: string;
	/**
	 * The ranking of the bang, i.e. `1`
	 */
	ranking: number;
	/**
	 * The category of the bang, i.e. `Tech`
	 */
	category?: string;
	/**
	 * The sub-category of the bang, i.e. `Programming`
	 */
	subCategory?: string;
}

const BANGS: Record<string, SearchEngine> = bangs;

function getSearchUrl(url: string, searchQuery: string): URL {
	return new URL(url.replace("{{{s}}}", searchQuery));
}

export function getSearchQuery(searchText: string): SearchQuery {
	if (!searchText) {
		throw new Error("Search text is required");
	}

	const match = searchText.match(/^!(\w+)(?:\s(.*))?$/);
	if (match) {
		const bang = match[1];
		const searchQuery = match[2] || "";

		if (bang in BANGS) {
			if (searchQuery) {
				return {
					id: nanoid(),
					query: searchText,
					description: `Search ${BANGS[bang].summary} for '${searchQuery}'`,
					url: getSearchUrl(BANGS[bang].url, searchQuery),
				};
			}
			return {
				id: nanoid(),
				query: bang,
				description: `Go to ${BANGS[bang].summary} (open ${BANGS[bang].domain} in new tab)`,
				url: getSearchUrl(BANGS[bang].url, searchQuery),
			};
		}

		return {
			id: nanoid(),
			query: searchQuery,
			description: `Search DuckDuckGo for '${searchText}'`,
			url: new URL(`https://duckduckgo.com/?q=${encodeURIComponent(searchText)}`),
		};
	}
	return {
		id: nanoid(),
		query: searchText,
		description: `Search DuckDuckGo for '${searchText}'`,
		url: new URL(`https://duckduckgo.com/?q=${encodeURIComponent(searchText)}`),
	};
}

const SearchSuggestionSchema = z.object({
	phrase: z.string(),
});

export async function fetchSearchSuggestions(searchText: string, signal: AbortSignal): Promise<SearchQuery[]> {
	const url = new URL("https://duckduckgo.com/ac/");
	url.searchParams.set("q", searchText);

	const response = await fetch(url, {
		signal,
		headers: {
			"Content-Type": "application/json; charset=UTF-8",
		},
	});
	if (!response.ok) {
		return Promise.reject(response.statusText);
	}

	const json = await response.json();
	const result = SearchSuggestionSchema.array().safeParse(json);

	if (!result.success) {
		return [];
	}
	return result.data.map(item => getSearchQuery(item.phrase));
}
