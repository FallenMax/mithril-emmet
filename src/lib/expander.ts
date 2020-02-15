import * as emmet from 'emmet'
import * as prettier from 'prettier'
import { AbbreviationNode, Value } from '@emmetio/abbreviation'

type Node = {
  name: () => string
  content: string
  attributeList: () => Attr[]
  children?: Node[]
}

const pickFirstValue = (values: Value[] | undefined): string => {
  const value = (values || [])[0]
  return typeof value === 'string' ? value : ''
}

const asNode = (abbrNode: AbbreviationNode): Node => {
  return {
    name() {
      return abbrNode.name || ''
    },
    content: pickFirstValue(abbrNode.value),
    attributeList() {
      return (abbrNode.attributes || []).map((attr) => {
        return {
          name: attr.name || '',
          value: pickFirstValue(attr.value),
        }
      })
    },
    children: abbrNode.children?.map(asNode),
  }
}

type Attr = {
  name: string
  value: string
}

export type ExpandOptions = {
  vnodeFactoryFunctionName: string
  outputDefaultTagName: boolean
}

const toOtherAttrString = (attrs: Attr[]): string => {
  const otherAttrs = attrs.filter((attr) => !/^(class|id)$/.test(attr.name))

  return otherAttrs.length
    ? JSON.stringify(
        otherAttrs.reduce((o: any, { name, value }) => {
          o[name] = value
          return o
        }, {}),
      )
    : ''
}

const toClassString = (attrs: Attr[]): string => {
  const classAttr = attrs.find((attr) => attr.name === 'class')
  return classAttr == null
    ? ''
    : classAttr.value
        .split(' ')
        .map((s) => `.${s}`)
        .join('')
}

const toIdString = (attrs: Attr[]): string => {
  const idAttr = attrs.find((attr) => attr.name === 'id')
  return idAttr == null ? '' : `#${idAttr.value}`
}

const toChildrenString = (
  children: Node[],
  content: string,
  options: ExpandOptions,
): string => {
  return children.length === 0
    ? content === ''
      ? ''
      : JSON.stringify(content)
    : '[' + children.map((c) => expandNode(c, options)).join(',') + ']'
}

const expandNode = (node: Node, options: ExpandOptions) => {
  const name =
    !options.outputDefaultTagName && node.name() === 'div' ? '' : node.name()
  const content = node.content
  const attrs = node.attributeList() || []
  const classStr = toClassString(attrs)
  const id = toIdString(attrs)
  const otherAttr = toOtherAttrString(attrs)
  const children = toChildrenString(node.children || [], content, options)

  const isComponent = /^[A-Z]/.test(name)

  const selectorStr = isComponent
    ? name
    : "'" + [name, id, classStr].filter((s) => s !== '').join('') + "'"
  const bodyStr = [selectorStr, otherAttr, children]
    .filter((s) => s !== '')
    .join(',')

  return `${options.vnodeFactoryFunctionName}(${bodyStr})`
}

export function expand(
  abbr: string,
  {
    vnodeFactoryFunctionName = 'm',
    outputDefaultTagName = false,
  } = {} as Partial<ExpandOptions>,
) {
  const root = emmet.parseMarkup(abbr, emmet.resolveConfig({ syntax: 'html' }))

  const expanded: string = (root.children || [])
    .map((abbrNode) =>
      expandNode(asNode(abbrNode), {
        vnodeFactoryFunctionName,
        outputDefaultTagName,
      }),
    )
    .join(',')

  let formatted
  try {
    formatted = prettier.format(expanded, {
      semi: false,
      singleQuote: true,
      parser: 'babel',
    })
  } catch (error) {
    // console.error('[mithril-emmet]', error)
    formatted = expanded
  }

  return formatted
}
