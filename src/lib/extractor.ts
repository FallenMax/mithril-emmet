const find = (
  text: string,
  regex: RegExp,
): {
  match: string
  start: number
  end: number
} => {
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
 * Extract abbreviation from a line of text
 */
export function extract(
  line: string,
  cursorPos: number,
): {
  abbr: string
  abbrStart: number
  abbrEnd: number
} {
  // official extractor doesnt work great :(
  // let's continue to use our own
  //
  // const e = emmet.extract(line, cursorPos, { lookAhead: true, type: 'markup' })
  // if (!e) {
  //   return { abbr: '', abbrStart: 0, abbrEnd: 0 }
  // }
  // const { abbreviation, start, end } = e
  // return {
  //   abbr: abbreviation,
  //   abbrStart: start,
  //   abbrEnd: end,
  // }

  const before = line.substring(0, cursorPos)
  const after = line.substring(cursorPos, line.length)
  const ABBR_BEFORE = /((({[^{}]+})|(\[[^\[\]]+\])|[\w\.\*\>\+\-#]+)+({[^\{\}]*)?)$/
  const ABBR_AFTER = /^(([^\{\}]*})?(({[^{}]+})|(\[[^\[\]]+\])|([\w\.\*\>\+\-#]+))+)/
  const { match: abbrBefore, start: startBefore, end: endBefore } = find(
    before,
    ABBR_BEFORE,
  )
  const { match: abbrAfter, start: startAfter, end: endAfter } = find(
    after,
    ABBR_AFTER,
  )
  return {
    abbr: abbrBefore + abbrAfter,
    abbrStart: startBefore,
    abbrEnd: before.length + endAfter,
  }
}
