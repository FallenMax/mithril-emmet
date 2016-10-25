# Mithril Emmet support for VS Code

Add [Emmet][emmet] (zen-coding) support for [Mithril][mithril] inside vscode.

## Screenshot
![screenshot](images/screenshot.gif)

## Usage

Use VS Code Command: `Expand Emmet to Mithril`

Optionally, You can bind `mithrilEmmet.expand` to a shortcut via `File -> Preferences -> Keyboard Shortcuts`.

Example:

```json
[{
  "key": "cmd+alt+e",
  "command": "mithrilEmmet.expand",
  "when": "editorFocus"
},
{
  "key": "ctrl+alt+e",
  "command": "mithrilEmmet.expand",
  "when": "editorFocus"
}]
```
## Known Issues

- Does not support tab stops (see: https://github.com/Microsoft/vscode/issues/3210)
- Some emmet snippets are not supported (e.g. `!!!` => `<!DOCTYPE html>`)

## Release Notes

### 0.4.0

Support expanding while cursor is inside a abbreviation

### 0.3.0

Remove tab stop placeholders from output

### 0.0.1

First release


[emmet]: http://emmet.io/
[mithril]: http://mithril.js.org/