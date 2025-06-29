import type { SearchResult } from "./types.js";
import { getPreferenceValues, LocalStorage, showToast, Toast } from "@raycast/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { getAutoSearchResults, getSearchHistory, getStaticResult } from "./handleResults.js";
import { HISTORY_KEY } from "./types.js";

const $history = atom<SearchResult[]>([]);

export function useHistory() {
	return useAtomValue($history);
}

export function useHistoryEffect() {
	const setHistory = useSetAtom($history);
	useEffect(() => {
		getSearchHistory().then(history => setHistory(history));
	}, []);
}

export function useDeleteHistory() {
	const setHistory = useSetAtom($history);
	return useMutation({
		mutationFn: async () => {
			await LocalStorage.removeItem(HISTORY_KEY);
			setHistory([]);
			showToast(Toast.Style.Success, "Cleared search history");
		},
	});
}

export function useDeleteHistoryItem() {
	const [history, setHistory] = useAtom($history);
	return useMutation({
		mutationFn: async ({ id }: SearchResult) => {
			const newHistory = history.filter(item => item.id !== id);
			await LocalStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
			setHistory(newHistory);
			showToast(Toast.Style.Success, "Removed from history");
		},
	});
}

export function useAddHistory() {
	const [history, setHistory] = useAtom($history);
	return useMutation({
		mutationFn: async (result: SearchResult) => {
			const newHistory = [result, ...history];
			setHistory(newHistory);
			const { rememberSearchHistory } = getPreferenceValues<ExtensionPreferences>();
			if (rememberSearchHistory) {
				await LocalStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
			}
		},
	});
}

export function useResults(searchText: string) {
	const history = useHistory();
	return useQuery({
		queryKey: ["results", searchText],
		queryFn: async ({ signal }) => {
			const staticResult = getStaticResult(searchText);
			const lowerSearchText = searchText.toLowerCase();
			const historyResults = history.filter(item => item.query.toLowerCase().includes(lowerSearchText));
			const autoSearchResults = await getAutoSearchResults(searchText, signal);

			const results = [staticResult, ...historyResults, ...autoSearchResults];
			// Deduplicate results
			return results.filter((item, index, self) => self.findIndex(t => t.query === item.query) === index);
		},
		enabled: !!searchText,
	});
}
