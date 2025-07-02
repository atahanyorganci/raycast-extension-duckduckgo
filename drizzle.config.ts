import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "sqlite",
	dbCredentials: {
		url: "file:firefox-places.db",
	},
	schema: "./src/db/schema.ts",
});
