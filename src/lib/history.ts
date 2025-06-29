import type { SearchQuery } from "./search.js";
import { getPreferenceValues, LocalStorage } from "@raycast/api";
import { SearchQuerySchema } from "./search.js";

const HISTORY_KEY = "history";

export async function getHistory(): Promise<SearchQuery[]> {
	const { rememberSearchHistory } = getPreferenceValues<ExtensionPreferences>();
	if (!rememberSearchHistory) {
		return [];
	}
	const historyString = await LocalStorage.getItem(HISTORY_KEY);
	if (typeof historyString !== "string") {
		return [];
	}
	const result = SearchQuerySchema.array().safeParse(JSON.parse(historyString));
	if (!result.success) {
		return [];
	}
	return result.data;
}

export async function deleteHistory(): Promise<void> {
	await LocalStorage.removeItem(HISTORY_KEY);
}

export async function persistHistory(newHistory: SearchQuery[]) {
	await LocalStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
}
