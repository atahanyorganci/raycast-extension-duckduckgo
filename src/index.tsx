import type { FC } from "react";
import { Action, ActionPanel, Alert, closeMainWindow, confirmAlert, Icon, List, open } from "@raycast/api";
import { getFavicon } from "@raycast/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { useAddHistory, useDeleteHistory, useDeleteHistoryItem, useResults } from "./utils/useSearch.js";

const SearchList: FC = () => {
	const { mutateAsync: addHistory } = useAddHistory();
	const { mutateAsync: deleteHistoryItem } = useDeleteHistoryItem();
	const { mutateAsync: deleteAllHistory } = useDeleteHistory();
	const [searchText, setSearchText] = useState("");
	const { data: results, isLoading, isSuccess } = useResults(searchText);

	return (
		<List isLoading={isLoading} onSearchTextChange={text => setSearchText(text)} searchBarPlaceholder="Search DuckDuckGo or enter a URL...">
			<List.Section title="Results" subtitle={isSuccess ? `${results?.length}` : undefined}>
				{results?.map(item => (
					<List.Item
						key={item.id}
						title={item.query}
						subtitle={item.description}
						icon={
							item.url.split("/")[2] === "duckduckgo.com"
								? { source: Icon.MagnifyingGlass }
								: getFavicon(`https://${item.url.split("/")[2]}`)
						}
						actions={(
							<ActionPanel>
								<ActionPanel.Section title="Result">
									<Action
										title="Open in Browser"
										onAction={async () => {
											await addHistory(item);
											await open(item.url);
											await closeMainWindow();
										}}
										icon={{ source: Icon.ArrowRight }}
									/>

									<Action.CopyToClipboard title="Copy URL to Clipboard" content={item.url} />
									<Action.CopyToClipboard title="Copy Suggestion to Clipboard" content={item.query} />
								</ActionPanel.Section>

								<ActionPanel.Section title="History">
									{item.isHistory && (
										<Action
											title="Remove from History"
											style={Action.Style.Destructive}
											onAction={async () => {
												await deleteHistoryItem(item);
											}}
											icon={{ source: Icon.Trash }}
											shortcut={{ modifiers: ["ctrl"], key: "x" }}
										/>
									)}

									<Action
										title="Clear All History"
										style={Action.Style.Destructive}
										onAction={async () => {
											const options: Alert.Options = {
												title: "Clear DuckDuckGo search history?",
												primaryAction: {
													title: "Delete",
													style: Alert.ActionStyle.Destructive,
													onAction: async () => {
														await deleteAllHistory();
													},
												},
											};

											await confirmAlert(options);
										}}
										icon={{ source: Icon.Trash }}
										shortcut={{ modifiers: ["ctrl", "shift"], key: "x" }}
									/>
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
