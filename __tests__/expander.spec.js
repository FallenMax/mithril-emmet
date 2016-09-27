/* eslint-env jest */


const trim = str => str.replace(/ +\n/g, '\n')


it('extract abbreviation', () => {
  const { extract } = require('../lib/expander')
  const input = 'aaa bbb  #header.test'
  const output = extract(input)

  expect(output).toBe(
    `#header.test`
  )
})

it('extract abbreviation: with []/{} behind', () => {
  const { extract } = require('../lib/expander')
  const input = 'a random[] and{} .real-dom>p{A paragraph}+.row>.col*5'
  const output = extract(input)

  expect(output).toBe(
    `.real-dom>p{A paragraph}+.row>.col*5`
  )
})

it('extract abbreviation: with unpaired []/{} behind', () => {
  const { extract } = require('../lib/expander')
  const input = 'a random[ and{ .fake-dom>.row>.col*5 .real-dom>p{A paragraph}+.row>.col*5'
  const output = extract(input)

  expect(output).toBe(
    `.real-dom>p{A paragraph}+.row>.col*5`
  )
})

it('extract abbreviation: only take last abbr', () => {
  const { extract } = require('../lib/expander')
  const input = 'a random[] and{} .fake-dom>.row>.col*5 .real-dom>p{A paragraph}+.row>.col*5'
  const output = extract(input)

  expect(output).toBe(
    `.real-dom>p{A paragraph}+.row>.col*5`
  )
})



it('expand abbreviation: simple', () => {
  const { expand } = require('../lib/expander')
  const input =
    'header>{I\'m a heading}+section>.row>.col*4'
  const output = expand(input)

  expect(trim(output)).toBe(trim(
    `m('header', [
  m('', 'I'm a heading'),
  m('section',
    m('.row', [
      m('.col'),
      m('.col'),
      m('.col'),
      m('.col')
    ])
  )
])`
  ))
})

it('expand abbreviation: complex', () => {
  const { expand } = require('../lib/expander')
  const input =
    'a#nice+p{cool extension}+.row.text-red[enabled=true disabled=false]>.col*2+.middle-R>.col*2+.middle-R>.col+.middle-R>.col'
  const output = expand(input)

  expect(trim(output)).toBe(trim(
    `m('a#nice', { href: '' }),
m('p', 'cool extension'),
m('.row.text-red', {
  enabled: 'true',
  disabled: 'false'
}, [
  m('.col'),
  m('.col'),
  m('.middle-R', [
    m('.col'),
    m('.col'),
    m('.middle-R', [
      m('.col'),
      m('.middle-R',
        m('.col')
      )
    ])
  ])
])`
  ))
})

it('expand abbreviation: remove tab stop placeholders', () => {
  const { expand } = require('../lib/expander')
  const input = 'input'
  const output = expand(input)

  expect(trim(output)).toBe(trim(
    `m('input', { type: '' })`
  ))
})

it('expand abbreviation: with indent level', () => {
  const { expand } = require('../lib/expander')
  const input =
    'a#nice+p{cool extension}+.row.text-red[enabled=true disabled=false]>.col*2+.middle-R>.col*2+.middle-R>.col+.middle-R>.col'
  const output = expand(input, { indentLevel: 1 })

  expect(trim(output)).toBe(trim(
    `m('a#nice', { href: '' }),
  m('p', 'cool extension'),
  m('.row.text-red', {
    enabled: 'true',
    disabled: 'false'
  }, [
    m('.col'),
    m('.col'),
    m('.middle-R', [
      m('.col'),
      m('.col'),
      m('.middle-R', [
        m('.col'),
        m('.middle-R',
          m('.col')
        )
      ])
    ])
  ])`
  ))
})


it('expand abbreviation: with tab as "\\t"', () => {
  const { expand } = require('../lib/expander')
  const input =
    'a#nice+p{cool extension}+.row.text-red[enabled=true disabled=false]>.col*2+.middle-R>.col*2+.middle-R>.col+.middle-R>.col'
  const output = expand(input, { tab: '\t' })

  expect(trim(output)).toBe(trim(
    `m('a#nice', { href: '' }),
m('p', 'cool extension'),
m('.row.text-red', {
\tenabled: 'true',
\tdisabled: 'false'
}, [
\tm('.col'),
\tm('.col'),
\tm('.middle-R', [
\t\tm('.col'),
\t\tm('.col'),
\t\tm('.middle-R', [
\t\t\tm('.col'),
\t\t\tm('.middle-R',
\t\t\t\tm('.col')
\t\t\t)
\t\t])
\t])
])`
  ))
})
