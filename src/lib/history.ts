import type { SearchQuery } from "./search.js";
import { Icon } from "@raycast/api";
import { getFavicon } from "@raycast/utils";
import { nanoid } from "nanoid";
import { getDatabase } from "../db/index.js";

export async function queryHistory(query: string): Promise<SearchQuery[]> {
	const db = await getDatabase();
	const visits = await db.query.mozPlaces.findMany({
		limit: 10,
		orderBy({ frecency }, { desc }) {
			return desc(frecency);
		},
		where(fields, { like, or }) {
			return or(
				like(fields.title, `%${query}%`),
				like(fields.description, `%${query}%`),
				like(fields.url, `%${query}%`),
			);
		},
	});
	return visits.map(({ url, title, description }) => ({
		id: nanoid(),
		title: title ?? "",
		description: description ?? undefined,
		url: new URL(url ?? ""),
		icon: url ? getFavicon(url, { fallback: Icon.Globe }) : Icon.Globe,
	}));
}
