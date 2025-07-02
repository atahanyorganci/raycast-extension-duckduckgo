import fs from "node:fs";
import path from "node:path";
import { environment } from "@raycast/api";
import { drizzle } from "drizzle-orm/sql-js";
import initSqlJs from "sql.js";
import * as schema from "./schema.js";

const DB = "/Users/atahan/Library/Application Support/Firefox/Profiles/atahan/places.sqlite";

export async function getDatabase() {
	const wasmBinary = fs.readFileSync(path.join(environment.assetsPath, "sql-wasm.wasm"));
	const SQL = await initSqlJs({ wasmBinary });
	const fileContents = fs.readFileSync(DB);
	return drizzle(new SQL.Database(fileContents), {
		schema,
	});
}
