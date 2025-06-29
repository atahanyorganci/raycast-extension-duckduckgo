import type { SearchQuery } from "../lib/search.js";
import { getPreferenceValues, showToast, Toast } from "@raycast/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { deleteHistory, getHistory, persistHistory } from "../lib/history.js";
import { fetchSearchSuggestions, getSearchQuery } from "../lib/search.js";

const $history = atom<SearchQuery[]>([]);

export function useHistory() {
	return useAtomValue($history);
}

export function useHistoryEffect() {
	const setHistory = useSetAtom($history);
	useEffect(() => {
		getHistory().then(history => setHistory(history));
	}, []);
}

export function useDeleteHistory() {
	const setHistory = useSetAtom($history);
	return useMutation({
		mutationFn: async () => {
			await deleteHistory();
			setHistory([]);
			showToast(Toast.Style.Success, "Cleared search history");
		},
	});
}

export function useDeleteHistoryItem() {
	const [history, setHistory] = useAtom($history);
	return useMutation({
		mutationFn: async ({ id }: SearchQuery) => {
			const newHistory = history.filter(item => item.id !== id);
			await persistHistory(newHistory);
			setHistory(newHistory);
			showToast(Toast.Style.Success, "Removed from history");
		},
	});
}

export function useAddHistory() {
	const [history, setHistory] = useAtom($history);
	return useMutation({
		mutationFn: async (result: SearchQuery) => {
			const newHistory = [result, ...history];
			setHistory(newHistory);
			const { rememberSearchHistory } = getPreferenceValues<ExtensionPreferences>();
			if (rememberSearchHistory) {
				await persistHistory(newHistory);
			}
		},
	});
}

export function useSearch(query: string) {
	const history = useHistory();
	return useQuery({
		queryKey: ["search", query],
		queryFn: async ({ signal }) => {
			const staticResult = getSearchQuery(query);
			const lowerSearchText = query.toLowerCase();
			const historyResults = history.filter(item => item.query.toLowerCase().includes(lowerSearchText));
			const autoSearchResults = await fetchSearchSuggestions(query, signal);

			const results = [staticResult, ...historyResults, ...autoSearchResults];
			// Deduplicate results
			return results.filter((item, index, self) => self.findIndex(t => t.query === item.query) === index);
		},
		enabled: !!query,
	});
}
