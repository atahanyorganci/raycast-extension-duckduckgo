import type { FC } from "react";
import { Action, ActionPanel, closeMainWindow, Icon, List, open } from "@raycast/api";
import { getFavicon } from "@raycast/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { useSearch } from "./hooks/use-search.js";

const SearchList: FC = () => {
	const [searchText, setSearchText] = useState("");
	const { data: results, isLoading, isSuccess } = useSearch(searchText);

	return (
		<List isLoading={isLoading} onSearchTextChange={text => setSearchText(text)} searchBarPlaceholder="Search DuckDuckGo or enter a URL...">
			<List.Section title="Results" subtitle={isSuccess ? `${results?.length}` : undefined}>
				{results?.map(item => (
					<List.Item
						key={item.id}
						title={item.query}
						subtitle={item.description}
						icon={
							item.url.hostname === "duckduckgo.com"
								? { source: Icon.MagnifyingGlass }
								: getFavicon(item.url)
						}
						actions={(
							<ActionPanel>
								<ActionPanel.Section title="Result">
									<Action
										title="Open in Browser"
										onAction={async () => {
											await open(item.url.toString());
											await closeMainWindow();
										}}
										icon={{ source: Icon.ArrowRight }}
									/>

									<Action.CopyToClipboard title="Copy URL to Clipboard" content={item.url.toString()} />
									<Action.CopyToClipboard title="Copy Suggestion to Clipboard" content={item.query} />
								</ActionPanel.Section>
							</ActionPanel>
						)}
					/>
				))}
			</List.Section>
		</List>
	);
};

const queryClient = new QueryClient();

const Command: FC = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<SearchList />
		</QueryClientProvider>
	);
};

export default Command;
