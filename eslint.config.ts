import antfu from "@antfu/eslint-config";

export default antfu({
	formatters: true,
	stylistic: {
		quotes: "double",
		semi: true,
		indent: "tab",
	},
	ignores: ["./src/lib/bangs.json"],
});
