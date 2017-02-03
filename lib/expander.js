const parser = require('emmet/lib/parser/abbreviation')

const find = (text, regex) => {
  const result = regex.exec(text)
  if (result) {
    const match = result[0]
    const start = result.index
    const end = start + match.length
    return { match, start, end }
  } else {
    return { match: '', start: 0, end: 0 }
  }
}

/**
 * Extract abbreviation from a line of text (assume cursor at end)
 */
function extract(line, cursorPos) {

  const before = line.substring(0, cursorPos)
  const after = line.substring(cursorPos, line.length)
  const ABBR_BEFORE = /((({[^{}]+})|(\[[^\[\]]+\])|[\w\.\*\>\+\-#]+)+({[^\{\}]*)?)$/
  const ABBR_AFTER = /^(([^\{\}]*})?(({[^{}]+})|(\[[^\[\]]+\])|([\w\.\*\>\+\-#]+))+)/
  const { match: abbrBefore, start: startBefore, end: endBefore } = find(before, ABBR_BEFORE)
  const { match: abbrAfter, start: startAfter, end: endAfter } = find(after, ABBR_AFTER)

  return {
    abbr: abbrBefore + abbrAfter,
    abbrStart: startBefore,
    abbrEnd: before.length + endAfter
  }
}


/**
 * Expand an abbreviation to mithril expression
 */
function expand(abbr, {
  tab = '  ',
  indentLevel = 0,
  vnodeFactoryFunctionName = 'm',
  outputDefaultTagName = false
} = {}) {
  const root = parser.parse(abbr, { syntax: 'html' })
  const vFn = vnodeFactoryFunctionName

  let output = (root.children || [])
    .map(node => expandNode(node))
    .join(',\n')
  output = indent(output, { skipFirstLine: true, indentLevel })
  return output

  function expandNode(node) {
    const name = !outputDefaultTagName && node.name() == 'div' ? '' : node.name()
    const content = node.content
    const attrs = node.attributeList() || []
    const classStr = toClass(attrs)
    const id = toId(attrs)
    const otherAttr = toOtherAttr(attrs)
    const children = toChildren(node.children || [], content)

    return `${vFn}('${name}${id}${classStr}'${otherAttr}${children})`
  }

  function toClass(attrs) {
    let classAttr = attrs.filter(attr => attr.name == 'class')[0]
    return classAttr == null ? '' : classAttr.value.split(' ').map(s => `.${s}`).join('')
  }

  function toId(attrs) {
    let idAttr = attrs.filter(attr => attr.name == 'id')[0]
    return idAttr == null ? '' : `#${idAttr.value}`
  }

  function toOtherAttr(attrs) {
    let otherAttrs = attrs.filter(attr => !/^(class|id)$/.test(attr.name))
      .map(({ name, value }) => `${name}: '${value}'`)
    switch (otherAttrs.length) {
      case 0:
        return ''
      case 1:
        return `, { ${otherAttrs[0]} }`
      default:
        return `, {\n${indent(otherAttrs.join(',\n'))}\n}`
    }
  }

  function toChildren(children, content) {
    var expanded
    switch (children.length) {
      case 0:
        return (content === '' || content == null) ? '' : `, '${content}'`
      case 1:
        expanded = expandNode(children[0])
        return `, \n${indent(expanded)}\n`
      default:
        expanded = children.map(node => expandNode(node)).join(',\n')
        return `, [\n${indent(expanded)}\n]`
    }
  }

  function indent(input, { skipFirstLine = false, indentLevel = 1 } = {}) {
    const arr = Array.isArray(input) ? input : input.split('\n')
    return arr.map((s, i) =>
      ((skipFirstLine && i == 0) ? s : (tab.repeat(indentLevel) + s))
    ).join('\n')
  }

}

module.exports = { expand, extract }
