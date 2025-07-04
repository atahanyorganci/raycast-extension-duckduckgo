import type { SearchQuery } from "./search.js";
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
				like(fields.url, `%${query}%`)
			);
		},
	});
	return visits.map(({ url, title, description }) => ({
		id: nanoid(),
		description: description ?? undefined,
		query: title ?? "",
		url: new URL(url ?? ""),
		isHistory: true,
	}));
}
