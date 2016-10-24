/* eslint-env jest */


const trim = str => str.replace(/ +\n/g, '\n')

it('extract abbreviation', () => {
  const { extract } = require('../lib/expander')
  const input = `aaa bbb  #header.test☯` // use ☯ as cursor pos
  const output = extract(input.replace('☯', ''), input.indexOf('☯'))

  expect(output).toEqual({
    abbr: `#header.test`,
    abbrStart: 9,
    abbrEnd: 21,
  })
})

it('extract abbreviation: with []/{} behind', () => {
  const { extract } = require('../lib/expander')
  const input = 'a random[] and{} .real-dom>p{A paragraph}+.row>.col*5☯'
  const output = extract(input.replace('☯', ''), input.indexOf('☯'))

  expect(output).toEqual({
    abbr: `.real-dom>p{A paragraph}+.row>.col*5`,
    abbrStart: 17,
    abbrEnd: 53,
  })
})

it('extract abbreviation: with []/{} behind and cursor inside', () => {
  const { extract } = require('../lib/expander')
  const input = 'a random[] and{} .rea☯l-dom>p{A paragraph}+.row>.col*5'
  const output = extract(input.replace('☯', ''), input.indexOf('☯'))

  expect(output).toEqual({
    abbr: `.real-dom>p{A paragraph}+.row>.col*5`,
    abbrStart: 17,
    abbrEnd: 53,
  })
})

it('extract abbreviation: with unpaired []/{} behind', () => {
  const { extract } = require('../lib/expander')
  const input = 'a random[ and{ .fake-dom>.row>.col*5 .real-dom>p{A paragraph}+.row>.col*5☯'
  const output = extract(input.replace('☯', ''), input.indexOf('☯'))

  expect(output).toEqual({
    abbr: `.real-dom>p{A paragraph}+.row>.col*5`,
    abbrStart: 37,
    abbrEnd: 73,
  })
})

it('extract abbreviation: only take last abbr', () => {
  const { extract } = require('../lib/expander')
  const input = 'a random[] and{} .fake-dom>.row>.col*5 .real-dom>p{A paragraph}+.row>.col*5☯'
  const output = extract(input.replace('☯', ''), input.indexOf('☯'))

  expect(output).toEqual({
    abbr: `.real-dom>p{A paragraph}+.row>.col*5`,
    abbrStart: 39,
    abbrEnd: 75,
  })
})

it('extract abbreviation: cursor inside abbr (1)', () => {
  const { extract } = require('../lib/expander')
  const input = 'a random[] and{} .☯fake-dom>.row>.col*5 .real-dom>p{A paragraph}+.row>.col*5 somerandom'
  const output = extract(input.replace('☯', ''), input.indexOf('☯'))

  expect(output).toEqual({
    abbr: `.fake-dom>.row>.col*5`,
    abbrStart: 17,
    abbrEnd: 38,
  })
})

it('extract abbreviation: cursor inside abbr (2)', () => {
  const { extract } = require('../lib/expander')
  const input = 'a random[] and{} .fake-dom>.row>☯.col*5 .real-dom>p{A paragraph}+.row>.col*5 somerandom ]'
  const output = extract(input.replace('☯', ''), input.indexOf('☯'))

  expect(output).toEqual({
    abbr: `.fake-dom>.row>.col*5`,
    abbrStart: 17,
    abbrEnd: 38,
  })
})

it('extract abbreviation: cursor inside abbr (3)', () => {
  const { extract } = require('../lib/expander')
  const input = 'a random[] and{} .fake-dom>.row>.col*5 .real-dom>p{☯A paragraph}+.row>.col*5 somerandom }'
  const output = extract(input.replace('☯', ''), input.indexOf('☯'))

  expect(output).toEqual({
    abbr: `.real-dom>p{A paragraph}+.row>.col*5`,
    abbrStart: 39,
    abbrEnd: 75,
  })
})


it('extract abbreviation: cursor inside abbr (4)', () => {
  const { extract } = require('../lib/expander')
  const input = 'a random[] and{} .fake-dom>.row>.col*5 .real-dom>p{A paragraph☯}+.row>.col*5 somerandom }'
  const output = extract(input.replace('☯', ''), input.indexOf('☯'))

  expect(output).toEqual({
    abbr: `.real-dom>p{A paragraph}+.row>.col*5`,
    abbrStart: 39,
    abbrEnd: 75,
  })
})

it('extract abbreviation: cursor inside abbr (5)', () => {
  const { extract } = require('../lib/expander')
  const input = 'a random[] and{} .fake-dom>.row>.col*5 .real-dom>p{A paragraph}+.row☯>.col*5 somerandom }'
  const output = extract(input.replace('☯', ''), input.indexOf('☯'))

  expect(output).toEqual({
    abbr: `.real-dom>p{A paragraph}+.row>.col*5`,
    abbrStart: 39,
    abbrEnd: 75,
  })
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
