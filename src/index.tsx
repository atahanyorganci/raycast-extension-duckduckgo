import type { FC } from "react";
import { Action, ActionPanel, closeMainWindow, Icon, List, open } from "@raycast/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { useSearch } from "./hooks/use-search.js";

const SearchList: FC = () => {
	const [searchText, setSearchText] = useState("");
	const { data: results, isLoading, isSuccess } = useSearch(searchText);

	return (
		<List isLoading={isLoading} onSearchTextChange={text => setSearchText(text)} searchBarPlaceholder="Search DuckDuckGo or enter a URL...">
			<List.Section title="Results" subtitle={isSuccess ? `${results?.length}` : undefined}>
				{results?.map(({ id, title, description, icon, url }) => (
					<List.Item
						key={id}
						title={title}
						subtitle={description}
						icon={icon}
						actions={(
							<ActionPanel>
								<ActionPanel.Section title="Result">
									<Action
										title="Open in Browser"
										onAction={async () => {
											await open(url.toString());
											await closeMainWindow();
										}}
										icon={{ source: Icon.ArrowRight }}
									/>

									<Action.CopyToClipboard title="Copy URL to Clipboard" content={url.toString()} />
									<Action.CopyToClipboard title="Copy Suggestion to Clipboard" content={title} />
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
