import { expand } from './expander'
import * as prettier from 'prettier'

const format = (str: string) => prettier.format(str, { parser: 'babel' })

it('expand abbreviation: simple', () => {
  const input = "header>{I'm a heading}+section>.row>.col*4"
  const output = expand(input)

  expect(format(output)).toBe(
    format(
      `m("header", [
        m("", "I'm a heading"),
        m("section", [m(".row", [m(".col"), m(".col"), m(".col"), m(".col")])])
      ])`,
    ),
  )
})

it('expand abbreviation: simple with custom vnode function', () => {
  const input = "header>{I'm a heading}+section>.row>.col*4"
  const output = expand(input, { vnodeFactoryFunctionName: 'h' })

  expect(format(output)).toBe(
    format(
      `h("header", [
        h("", "I'm a heading"),
        h("section", [h(".row", [h(".col"), h(".col"), h(".col"), h(".col")])])
      ])`,
    ),
  )
})

it('expand abbreviation: complex', () => {
  const input =
    'a#nice+p{cool extension}+.row.text-red[enabled=true disabled=false]>.col*2+.middle-R>.col*2+.middle-R>.col+.middle-R>.col'
  const output = expand(input)

  expect(format(output)).toBe(
    format(
      `m("a#nice", { href: "" }),
      m("p", "cool extension"),
      m(".row.text-red", { enabled: "true", disabled: "false" }, [
        m(".col"),
        m(".col"),
        m(".middle-R", [
          m(".col"),
          m(".col"),
          m(".middle-R", [m(".col"), m(".middle-R", [m(".col")])])
        ])
      ])`,
    ),
  )
})

// it('expand abbreviation: with stop placeholders', () => {
//   const input = 'input'
//   const output = expand(input)

//   expect(format(output)).toBe(format("m('input', { type: '${1:text}' })"))
// })

it('expand abbreviation: take CamelCase name as Component', () => {
  const input = 'Header>{Im a heading}+Section>.row>.col*4'
  const output = expand(input)

  expect(format(output)).toBe(
    format(`m(Header, [
    m("", "Im a heading"),
    m(Section, [m(".row", [m(".col"), m(".col"), m(".col"), m(".col")])])
  ])
  `),
  )
})
