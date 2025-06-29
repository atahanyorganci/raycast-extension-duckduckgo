import type { SearchResult } from "./types";
import { getPreferenceValues, LocalStorage } from "@raycast/api";
import { nanoid } from "nanoid";
import z from "zod";
import { HISTORY_KEY, SearchResultSchema } from "./types";

const BANGS: Record<string, { name: string; url: string }> = {
	g: { name: "Google", url: "https://google.com/search?q=" },
	gi: { name: "Google Images", url: "https://www.google.com/search?q=" },
	yt: { name: "YouTube", url: "https://www.youtube.com/results?search_query=" },
	w: { name: "Wikipedia", url: "https://en.wikipedia.org/wiki/" },
	wde: { name: "Wikipedia (DE)", url: "https://de.wikipedia.org/wiki/" },
	imdb: { name: "IMDB", url: "https://www.imdb.com/find?q=" },
	a: { name: "Amazon.com", url: "https://www.amazon.com/s/?field-keywords=" },
	ade: { name: "Amazon.de", url: "https://www.amazon.de/s/?field-keywords=" },
	e: { name: "eBay", url: "https://www.ebay.com/sch/i.html?_nkw=" },
	ede: { name: "ebay.de", url: "https://www.ebay.de/sch/i.html?_nkw=" },
	so: { name: "Stack Overflow", url: "https://stackoverflow.com/search?q=" },
	gh: { name: "GitHub", url: "https://github.com/search?q=" },
	zillow: { name: "Zillow", url: "https://www.zillow.com/homes/" },
	t: { name: "Twitter", url: "https://twitter.com/search?q=" },
	r: { name: "Reddit", url: "https://www.reddit.com/search?q=" },
	nf: { name: "Netflix", url: "https://www.netflix.com/search?q=" },
	y: { name: "Yahoo", url: "https://search.yahoo.com/search?p=" },
	b: { name: "Bing", url: "https://www.bing.com/search?q=" },
	gif: { name: "Giphy", url: "https://giphy.com/search/" },
	wp: { name: "WordPress", url: "https://wordpress.org/search/" },
	mdn: { name: "MDN Web Docs", url: "https://developer.mozilla.org/search?q=" },
	npm: { name: "npm", url: "https://www.npmjs.com/search?q=" },
	wiktionary: { name: "Wiktionary", url: "https://en.wiktionary.org/wiki/" },
	d: { name: "Dictionary.com", url: "https://www.dictionary.com/browse/" },
	ud: { name: "Urban Dictionary", url: "https://www.urbandictionary.com/define.php?term=" },
	etsy: { name: "Etsy", url: "https://www.etsy.com/search?q=" },
	ae: { name: "AliExpress", url: "https://www.aliexpress.com/wholesale?SearchText=" },
};

export async function getSearchHistory(): Promise<SearchResult[]> {
	const { rememberSearchHistory } = getPreferenceValues<ExtensionPreferences>();
	if (!rememberSearchHistory) {
		return [];
	}
	const historyString = await LocalStorage.getItem(HISTORY_KEY);
	if (typeof historyString !== "string") {
		return [];
	}
	const result = SearchResultSchema.array().safeParse(JSON.parse(historyString));
	if (!result.success) {
		return [];
	}
	return result.data;
}

export function getStaticResult(searchText: string): SearchResult {
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
					description: `Search ${BANGS[bang].name} for '${searchQuery}'`,
					url: `${BANGS[bang].url}${encodeURIComponent(searchQuery)}`,
				};
			}
			const url = new URL(BANGS[bang].url);
			const hostname = url.hostname.replace("www.", "");
			return {
				id: nanoid(),
				query: bang,
				description: `Go to ${BANGS[bang].name} (open ${hostname} in new tab)`,
				url: BANGS[bang].url,
			};
		}

		return {
			id: nanoid(),
			query: searchQuery,
			description: `Search DuckDuckGo for '${searchText}'`,
			url: `https://duckduckgo.com/?q=${encodeURIComponent(searchText)}`,
		};
	}
	return {
		id: nanoid(),
		query: searchText,
		description: `Search DuckDuckGo for '${searchText}'`,
		url: `https://duckduckgo.com/?q=${encodeURIComponent(searchText)}`,
	};
}

const AutoSearchResultSchema = z.object({
	phrase: z.string(),
});

export async function getAutoSearchResults(searchText: string, signal: AbortSignal): Promise<SearchResult[]> {
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
	const result = AutoSearchResultSchema.array().safeParse(json);

	if (!result.success) {
		return [];
	}
	return result.data.map(item => getStaticResult(item.phrase));
}
