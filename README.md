# DuckDuckGo Raycast Extension

A powerful Raycast extension for searching DuckDuckGo with intelligent suggestions, bang commands, and search history management.

## Features

### 🔍 **Basic Search**

1. Open Raycast (`Cmd + Space`)
2. Type "DuckDuckGo" or use the command
3. Enter your search query
4. Select from suggestions or press Enter to search

### 💥 **Bang Commands**

- Type `!` followed by a bang command and your search term
- Examples:
  - `!g how to code` - Search Google for "how to code"
  - `!yt cooking recipes` - Search YouTube for "cooking recipes"
  - `!w artificial intelligence` - Search Wikipedia for "artificial intelligence"
- Full list can be found at [DuckDuckGo !Bangs](https://duckduckgo.com/bangs)

### 📚 **Search History**

- Local search history storage (optional)
- Quick access to previous searches
- Easy history management with delete options

## Preferences

- **Remember Search History**: Enable/disable local storage of search history.

## Keyboard Shortcuts

| Action              | Shortcut                  |
| ------------------- | ------------------------- |
| Remove from History | `Ctrl + X`                |
| Clear All History   | `Ctrl + Shift + X`        |
| Open in Browser     | `Enter`                   |
| Copy URL            | `Cmd + C` (when selected) |

## Development

- Install Nix with `nix-commands` and `flakes` experimental features.
- Run `nix develop` to active development shell. Development shell includes `node`, `corepack` and `pnpm`.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Credits

- Forked from Raycast Extension store [DuckDuckGo Search](https://github.com/raycast/extensions/tree/main/extensions/duck-duck-go-search) by [@tegola](https://github.com/tegola)
- Maintained by [@atahanyorganci](https://github.com/atahanyorganci)
