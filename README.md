> **Note**
>
> You might not need this extension to use Emmet in VS Code.
>
> Emmet for html/css/jsx is built-in feature of VS Code.
> This extension is created to extend its feature for [hyperscript][hyperscript] or [Mithril][mithril].

# Mithril Emmet support for VS Code

Add [Emmet][emmet] (zen-coding) support for [Mithril][mithril] inside vscode, can also be used to create [hyperscript][hyperscript].

## Screenshot

![screenshot](images/screenshot.gif)

## Usage

Use VS Code Command: `Expand Emmet to Mithril`

Optionally, You can bind `mithrilEmmet.expand` to a shortcut via `File -> Preferences -> Keyboard Shortcuts`.

Example:

```json
[
  {
    "key": "cmd+alt+e",
    "command": "mithrilEmmet.expand",
    "when": "editorFocus"
  },
  {
    "key": "ctrl+alt+e",
    "command": "mithrilEmmet.expand",
    "when": "editorFocus"
  }
]
```

## Configuration

```json
{
  "mithrilEmmet.vnodeFactoryFunctionName": "m", //  Specifies the name of vnode factory function. E.g. for mithril, use 'm'; for hyperscript, use 'h'.
  "mithrilEmmet.outputDefaultTagName": true //  If false, default tag name ('div')  will be obmitted, i.e. '.some-class' instead of 'div.some-class'
}
```

## Buy me a coffee

https://www.buymeacoffee.com/fallenmax
