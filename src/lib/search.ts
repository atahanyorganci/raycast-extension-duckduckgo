import type { Image } from "@raycast/api";
import { Icon } from "@raycast/api";
import { getFavicon } from "@raycast/utils";
import { nanoid } from "nanoid";
import { z } from "zod";
import bangs from "./bangs.json" with { type: "json" };

export interface SearchQuery {
	id: string;
	title: string;
	description?: string;
	url: URL;
	icon: Image.ImageLike;
}

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
					title: searchText,
					description: `Search ${BANGS[bang].summary} for '${searchQuery}'`,
					url: getSearchUrl(BANGS[bang].url, searchQuery),
					icon: getFavicon(BANGS[bang].url, {
						fallback: Icon.MagnifyingGlass,
					}),
				};
			}
			return {
				id: nanoid(),
				title: bang,
				description: `Go to ${BANGS[bang].summary} (open ${BANGS[bang].domain} in new tab)`,
				url: getSearchUrl(BANGS[bang].url, searchQuery),
				icon: getFavicon(BANGS[bang].url, {
					fallback: Icon.Globe,
				}),
			};
		}

		return {
			id: nanoid(),
			title: searchQuery,
			description: `Search DuckDuckGo for '${searchText}'`,
			url: new URL(`https://duckduckgo.com/?q=${encodeURIComponent(searchText)}`),
			icon: getFavicon("https://duckduckgo.com", {
				fallback: Icon.MagnifyingGlass,
			}),
		};
	}
	return {
		id: nanoid(),
		title: searchText,
		description: `Search DuckDuckGo for '${searchText}'`,
		url: new URL(`https://duckduckgo.com/?q=${encodeURIComponent(searchText)}`),
		icon: getFavicon("https://duckduckgo.com", {
			fallback: Icon.MagnifyingGlass,
		}),
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
