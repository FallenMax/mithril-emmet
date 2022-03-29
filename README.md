**Uninstall this extension unless you are using mithril.js/hyperscript**

> Emmet (for HTML, CSS, JSX) is a built-in feature of VS Code. You don't need this extension to use it.
> This extension is created to allow using Emmet to write [mithril.js][mithril] or other [hyperscript][hyperscript] framework.

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
