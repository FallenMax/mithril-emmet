import * as vscode from 'vscode'
import { expand } from './lib/expander'
import { extract } from './lib/extractor'

const handleExpand = async (): Promise<void> => {
  try {
    const editor = vscode.window.activeTextEditor

    if (!editor) {
      return
    }

    const document = editor.document
    const selection = editor.selection
    const curCursor = selection.active
    const curLine = document.lineAt(curCursor.line).text

    const config = vscode.workspace.getConfiguration('mithrilEmmet')
    const { abbr, abbrStart, abbrEnd } = extract(curLine, curCursor.character)

    if (abbr === '') {
      vscode.window.showInformationMessage('[mithril-emmet] Nothing to expand')
      return
    }

    const expanded = expand(abbr, config as any).trim()

    const TABSTOP = /\${[^{}]+}/g
    const containsTapstop = TABSTOP.test(expanded)
    if (!containsTapstop) {
      await editor.edit((edit) => {
        // edit.replace() doesn't work well here, it messes up cursor position/selection
        edit.delete(
          new vscode.Range(curCursor.line, abbrStart, curCursor.line, abbrEnd),
        )
        edit.insert(new vscode.Position(curCursor.line, abbrStart), expanded)
      })
      const newCursor = selection.active
      editor.revealRange(
        new vscode.Range(
          newCursor.line,
          abbrStart,
          newCursor.line,
          newCursor.character,
        ),
      )
    } else {
      const supportInsertSnippet = typeof editor.insertSnippet === 'function'

      if (supportInsertSnippet) {
        const snippet = new vscode.SnippetString(expanded)
        await editor.edit((edit) => {
          edit.delete(
            new vscode.Range(
              curCursor.line,
              abbrStart,
              curCursor.line,
              abbrEnd,
            ),
          )
        })
        editor.insertSnippet(
          snippet,
          new vscode.Position(curCursor.line, abbrStart),
        )
      } else {
        await editor.edit((edit) => {
          edit.delete(
            new vscode.Range(
              curCursor.line,
              abbrStart,
              curCursor.line,
              abbrEnd,
            ),
          )
          edit.insert(
            new vscode.Position(curCursor.line, abbrStart),
            expanded.replace(TABSTOP, ''),
          )
        })
        const cursor = selection.active // current cursor position after edit
        editor.revealRange(
          new vscode.Range(
            curCursor.line,
            abbrStart,
            cursor.line,
            cursor.character,
          ),
        )
      }
    }
  } catch (e) {
    console.error('[mithril-emmet]', e)
    vscode.window.showErrorMessage('[mithril-emmet] Failed to expand')
  }
}

export const activate = (context: vscode.ExtensionContext) => {
  context.subscriptions.push(
    vscode.commands.registerCommand('mithrilEmmet.expand', handleExpand),
  )
}
