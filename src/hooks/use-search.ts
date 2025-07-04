import type { UseQueryResult } from "@tanstack/react-query";
import type { SearchQuery } from "../lib/search.js";
import { useQuery } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { fetchSearchSuggestions, getSearchQuery } from "../lib/search.js";
import { queryHistory } from "../lib/history.js";

function tryGetSearchQueryFromUrl(query: string): SearchQuery | null {
	let url: URL;
	try {
		// If the query is localhost, add a protocol
		if (query.startsWith("localhost")) {
			url = new URL(`http://${query}`);
		}
		else if (query.match(/^([a-z0-9]+\.)+[a-z]{2,}/i)) {
			url = new URL(`https://${query}`);
		}
		else {
			url = new URL(query);
		}
	}
	catch {
		return null;
	}
	return {
		id: nanoid(),
		query: url.hostname,
		description: query,
		url,
	};
}

export function useSearch(query: string): UseQueryResult<SearchQuery[]> {
	return useQuery({
		queryKey: ["search", query],
		queryFn: async ({ signal }) => {
			const url = tryGetSearchQueryFromUrl(query);
			const staticResult = getSearchQuery(query);
			const [autoSearchResults, historyResults] =await Promise.all([
				fetchSearchSuggestions(query, signal),
				queryHistory(query)
			]);

			const results = [staticResult, ...historyResults, ...autoSearchResults];
			// Deduplicate results
			const deduped = results.filter((item, index, self) => self.findIndex(t => t.query === item.query) === index);
			if (url) {
				deduped.unshift(url);
			}
			return deduped;
		},
		enabled: !!query,
	});
}
