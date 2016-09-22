const vscode = require('vscode')
const { expand, extract } = require('./lib/expander')


function activate(context) {


  const disposable = vscode.commands.registerCommand('mithrilEmmet.expand', function() {
    const editor = vscode.window.activeTextEditor
    if (!editor) {
      return
    }
    // if (editor.document.languageId !== 'javascript') {
    //   return
    // }

    const document = editor.document
    const selection = editor.selection
    const { line, character } = selection.active // current cursor position
    const curLine = document.lineAt(line).text

    const abbr = extract(curLine.substr(0, character))

    const { tabSize, insertSpaces } = editor.options
    const tab = insertSpaces ? ' '.repeat(tabSize) : '\t'
    const tabsAtStart = new RegExp(`^(${tab})*`)
    const indentLevel = (tabsAtStart.exec(curLine) || [])[0].length / tab.length

    let output
    if (abbr) {
      try {
        output = expand(abbr, { tab, indentLevel })
        editor.edit(edit => {
            // edit.replace doesn't work well here, it messes up cursor position/selection
            edit.delete(new vscode.Range(line, character - abbr.length, line, character))
            edit.insert(new vscode.Position(line, character - abbr.length), output)
          })
          .then(() => {
            const cursor = selection.active // current cursor position after edit
            editor.revealRange(new vscode.Range(line, character - abbr.length, cursor.line, cursor.character))
          })
      } catch (e) {
        console.error('[mithril-emmet]', e)
        console.error({ abbr })
        vscode.window.showErrorMessage('[mithril-emmet] Failed to expand: ' + abbr)
      }
    } else {
      vscode.window.showInformationMessage('[mithril-emmet] Nothing to expand')
    }
  })

  context.subscriptions.push(disposable)
}
exports.activate = activate

function deactivate() {}
exports.deactivate = deactivate
