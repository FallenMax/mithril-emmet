const parser = require('emmet/lib/parser/abbreviation')

/**
 * Extract abbreviation from a line of text (assume cursor at end)
 */
function extract(line) {
  const ABBR_REG = /(({[^{}}]+})|(\[[^\[\]]+\])|[^\ ]+)+$/
  return (ABBR_REG.exec(line) || [null])[0]
}


/**
 * Expand an abbreviation to mithril expression
 */
function expand(abbr, { tab = '  ', indentLevel = 0 } = {}) {
  const root = parser.parse(abbr, { syntax: 'html' })

  let output = (root.children || [])
    .map(node => expandNode(node))
    .join(',\n')
  output = indent(output, { skipFirstLine: true, indentLevel })
  output = removeTabStops(output)
  return output

  function expandNode(node) {
    const name = node.name() == 'div' ? '' : node.name()
    const content = node.content
    const attrs = node.attributeList() || []
    const classStr = toClass(attrs)
    const id = toId(attrs)
    const otherAttr = toOtherAttr(attrs)
    const children = toChildren(node.children || [], content)

    return `m('${name}${id}${classStr}'${otherAttr}${children})`
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

  function removeTabStops(input) {
    const TABSTOP_REG = /\${[^{}]+}/g

    // TODO
    // wait until vscode support dynamic snippet & tab stop
    // issue: https://github.com/Microsoft/vscode/issues/3210
    return input.replace(TABSTOP_REG, '')
  }
}


module.exports = { expand, extract }
