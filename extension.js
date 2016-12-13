const vscode = require('vscode')
const { expand, extract } = require('./lib/expander')


function activate(context) {


  const disposable = vscode.commands.registerCommand('mithrilEmmet.expand', function() {
    const editor = vscode.window.activeTextEditor
    if (!editor) {
      return
    }


    const document = editor.document
    const selection = editor.selection
    const { line, character } = selection.active // current cursor position
    const curLine = document.lineAt(line).text

    const { tabSize, insertSpaces } = editor.options
    const {
      vnodeFactoryFunctionName
    } = vscode.workspace.getConfiguration('mithrilEmmet')

    const tab = insertSpaces ? ' '.repeat(tabSize) : '\t'
    const tabsAtStart = new RegExp(`^(${tab})*`)
    const indentLevel = (tabsAtStart.exec(curLine) || [])[0].length / tab.length


    let { abbr, abbrStart, abbrEnd } = extract(curLine, character)
    try {
      if (abbr) {
        const output = expand(abbr, { tab, indentLevel, vnodeFactoryFunctionName })
        return editor.edit(edit => {
            // edit.replace doesn't work well here, it messes up cursor position/selection
            edit.delete(new vscode.Range(line, abbrStart, line, abbrEnd))
            edit.insert(new vscode.Position(line, abbrStart), output)
          })
          .then(() => {
            const cursor = selection.active // current cursor position after edit
            editor.revealRange(new vscode.Range(line, abbrStart, cursor.line, cursor.character))
          })
      } else {
        return vscode.window.showInformationMessage('[mithril-emmet] Nothing to expand')
      }
    } catch (e) {
      console.error('[mithril-emmet]', e)
      console.error({ abbr })
      vscode.window.showErrorMessage('[mithril-emmet] Failed to expand: ' + abbr)
    }
  })

  context.subscriptions.push(disposable)
}
exports.activate = activate

function deactivate() {}
exports.deactivate = deactivate
