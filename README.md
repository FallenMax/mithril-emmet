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

- Emmet snippets are not supported for now (e.g. '!'=>html)

## Release Notes

### 0.0.1

first release


[emmet]: http://emmet.io/
[mithril]: http://mithril.js.org/