import { extract } from './extractor'

it('extract abbreviation', () => {
  const input = `aaa bbb  #header.test☯` // use ☯ as cursor pos
  const output = extract(input.replace('☯', ''), input.indexOf('☯'))
  expect(output).toEqual({
    abbr: `#header.test`,
    abbrStart: 9,
    abbrEnd: 21,
  })
})
it('extract abbreviation: with []/{} behind', () => {
  const input = 'a random[] and{} .real-dom>p{A paragraph}+.row>.col*5☯'
  const output = extract(input.replace('☯', ''), input.indexOf('☯'))
  expect(output).toEqual({
    abbr: `.real-dom>p{A paragraph}+.row>.col*5`,
    abbrStart: 17,
    abbrEnd: 53,
  })
})
it('extract abbreviation: with []/{} behind and cursor inside', () => {
  const input = 'a random[] and{} .rea☯l-dom>p{A paragraph}+.row>.col*5'
  const output = extract(input.replace('☯', ''), input.indexOf('☯'))
  expect(output).toEqual({
    abbr: `.real-dom>p{A paragraph}+.row>.col*5`,
    abbrStart: 17,
    abbrEnd: 53,
  })
})
it('extract abbreviation: with unpaired []/{} behind', () => {
  const input =
    'a random[ and{ .fake-dom>.row>.col*5 .real-dom>p{A paragraph}+.row>.col*5☯'
  const output = extract(input.replace('☯', ''), input.indexOf('☯'))
  expect(output).toEqual({
    abbr: `.real-dom>p{A paragraph}+.row>.col*5`,
    abbrStart: 37,
    abbrEnd: 73,
  })
})
it('extract abbreviation: only take last abbr', () => {
  const input =
    'a random[] and{} .fake-dom>.row>.col*5 .real-dom>p{A paragraph}+.row>.col*5☯'
  const output = extract(input.replace('☯', ''), input.indexOf('☯'))
  expect(output).toEqual({
    abbr: `.real-dom>p{A paragraph}+.row>.col*5`,
    abbrStart: 39,
    abbrEnd: 75,
  })
})
it('extract abbreviation: cursor inside abbr (1)', () => {
  const input =
    'a random[] and{} .☯fake-dom>.row>.col*5 .real-dom>p{A paragraph}+.row>.col*5 somerandom'
  const output = extract(input.replace('☯', ''), input.indexOf('☯'))
  expect(output).toEqual({
    abbr: `.fake-dom>.row>.col*5`,
    abbrStart: 17,
    abbrEnd: 38,
  })
})
it('extract abbreviation: cursor inside abbr (2)', () => {
  const input =
    'a random[] and{} .fake-dom>.row>☯.col*5 .real-dom>p{A paragraph}+.row>.col*5 somerandom ]'
  const output = extract(input.replace('☯', ''), input.indexOf('☯'))
  expect(output).toEqual({
    abbr: `.fake-dom>.row>.col*5`,
    abbrStart: 17,
    abbrEnd: 38,
  })
})
it('extract abbreviation: cursor inside abbr (3)', () => {
  const input =
    'a random[] and{} .fake-dom>.row>.col*5 .real-dom>p{☯A paragraph}+.row>.col*5 somerandom }'
  const output = extract(input.replace('☯', ''), input.indexOf('☯'))
  expect(output).toEqual({
    abbr: `.real-dom>p{A paragraph}+.row>.col*5`,
    abbrStart: 39,
    abbrEnd: 75,
  })
})
it('extract abbreviation: cursor inside abbr (4)', () => {
  const input =
    'a random[] and{} .fake-dom>.row>.col*5 .real-dom>p{A paragraph☯}+.row>.col*5 somerandom }'
  const output = extract(input.replace('☯', ''), input.indexOf('☯'))
  expect(output).toEqual({
    abbr: `.real-dom>p{A paragraph}+.row>.col*5`,
    abbrStart: 39,
    abbrEnd: 75,
  })
})
it('extract abbreviation: cursor inside abbr (5)', () => {
  const input =
    'a random[] and{} .fake-dom>.row>.col*5 .real-dom>p{A paragraph}+.row☯>.col*5 somerandom }'
  const output = extract(input.replace('☯', ''), input.indexOf('☯'))
  expect(output).toEqual({
    abbr: `.real-dom>p{A paragraph}+.row>.col*5`,
    abbrStart: 39,
    abbrEnd: 75,
  })
})
it('extract abbreviation: cursor inside abbr (6)', () => {
  const input =
    'a random[] and{} .fake-dom>.row>.col*5 (.real-dom>p{A paragraph}+.row☯)}'
  const output = extract(input.replace('☯', ''), input.indexOf('☯'))
  expect(output).toEqual({
    abbr: `.real-dom>p{A paragraph}+.row`,
    abbrStart: 40,
    abbrEnd: 69,
  })
})
