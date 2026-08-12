import type {
  I_faSelectInputLabelQueryMatch,
  I_faSelectInputObjectItem,
  T_faSelectInputLabelHighlightSegment,
  T_faSelectInputOption
} from 'app/types/I_faSelectInput'

/**
 * Split a search needle into FA 1.0-style lowercase query tokens.
 * Uses single-space split like FA 1.0 advancedDocumentFilter, then drops empties.
 */
function splitFaSelectInputQueryWords (needle: string): string[] {
  return needle
    .toLowerCase()
    .split(' ')
    .filter((word) => {
      return word !== ''
    })
}

/**
 * Match a display label against a multi-word query the FA 1.0 way.
 * Ports advancedDocumentFilter quirks: no early break per token, exact equality also
 * counts as partial via includes, and one token may claim multiple unused label words.
 */
function matchFaSelectInputLabelByQueryWords (
  label: string,
  needle: string
): I_faSelectInputLabelQueryMatch {
  const filteredSearchWordList = splitFaSelectInputQueryWords(needle)

  if (label.toLowerCase() === filteredSearchWordList.join(' ') && filteredSearchWordList.length > 0) {
    return {
      exactMatch: true,
      fullWordMatch: 0,
      matchedLabelWordsLower: label
        .split(' ')
        .filter((word) => {
          return word !== ''
        })
        .map((word) => {
          return word.toLowerCase()
        }),
      matches: true,
      partialWordMatch: 0
    }
  }

  const documentWordList = label.toLowerCase().split(' ')
  let fullWordMatch = 0
  let partialWordMatch = 0
  let previousWordNotFound = false
  let filteredOut = false
  const foundWordList: string[] = []

  for (const filterWord of filteredSearchWordList) {
    let wordNotFound = true
    for (const docWord of documentWordList) {
      if (foundWordList.includes(docWord)) {
        continue
      }
      if (docWord === filterWord) {
        fullWordMatch += 1
        wordNotFound = false
        foundWordList.push(docWord)
      }
      if (docWord.includes(filterWord)) {
        partialWordMatch += 1
        wordNotFound = false
        foundWordList.push(docWord)
      }
    }
    filteredOut = !(!wordNotFound && !previousWordNotFound)
    previousWordNotFound = wordNotFound
  }

  return {
    exactMatch: false,
    fullWordMatch,
    matchedLabelWordsLower: foundWordList,
    matches: (fullWordMatch > 0 || partialWordMatch > 0) && !filteredOut,
    partialWordMatch
  }
}

/**
 * Compare two label-query match ranks (higher quality first), FA 1.0 sort order.
 */
function compareFaSelectInputLabelQueryMatchRank (
  a: I_faSelectInputLabelQueryMatch,
  b: I_faSelectInputLabelQueryMatch
): number {
  if (a.exactMatch !== b.exactMatch) {
    return a.exactMatch ? -1 : 1
  }
  if (a.fullWordMatch !== b.fullWordMatch) {
    return b.fullWordMatch - a.fullWordMatch
  }
  if (a.partialWordMatch !== b.partialWordMatch) {
    return b.partialWordMatch - a.partialWordMatch
  }
  return 0
}

/**
 * Build highlight segments from a label using FA 1.0 claimed-word matching.
 */
function buildFaSelectInputLabelHighlightSegmentsFromMatch (
  label: string,
  match: I_faSelectInputLabelQueryMatch
): T_faSelectInputLabelHighlightSegment[] {
  if (match.exactMatch) {
    return [{
      isMatch: true,
      text: label
    }]
  }

  const claimed = new Set(match.matchedLabelWordsLower)
  const segments: T_faSelectInputLabelHighlightSegment[] = []

  for (const part of label.split(/(\s+)/)) {
    if (part.length === 0) {
      continue
    }
    if (/^\s+$/.test(part)) {
      segments.push({
        isMatch: false,
        text: part
      })
      continue
    }
    segments.push({
      isMatch: claimed.has(part.toLowerCase()),
      text: part
    })
  }

  return segments
}

/**
 * Filter select options by needle using FA 1.0 multi-word label matching.
 * Simple options match the string; object options match name, with id fallback
 * only when the full needle (contiguous) is a case-insensitive substring of id.
 * Per-token id includes is wrong for UUID hex (e.g. 'af' + '11' false positives).
 * Matching rows sort by FA 1.0 rank (exact, then full-word, then partial).
 */
export function filterFaSelectInputOptionsByQuery (
  needle: string,
  items: readonly T_faSelectInputOption[]
): T_faSelectInputOption[] {
  const queryWords = splitFaSelectInputQueryWords(needle)
  if (queryWords.length === 0) {
    return [...items]
  }
  const idNeedle = needle.trim().toLowerCase()

  const ranked = items
    .map((item) => {
      const label = typeof item === 'string' ? item : item.name
      const labelMatch = matchFaSelectInputLabelByQueryWords(label, needle)
      if (labelMatch.matches) {
        return {
          match: labelMatch,
          option: item
        }
      }
      if (typeof item === 'string') {
        return null
      }
      if (!item.id.toLowerCase().includes(idNeedle)) {
        return null
      }
      return {
        match: {
          exactMatch: false,
          fullWordMatch: 0,
          matchedLabelWordsLower: [],
          matches: true,
          partialWordMatch: 0
        },
        option: item
      }
    })
    .filter((entry): entry is NonNullable<typeof entry> => {
      return entry !== null
    })

  ranked.sort((a, b) => {
    return compareFaSelectInputLabelQueryMatchRank(a.match, b.match)
  })

  return ranked.map((entry) => {
    return entry.option
  })
}

/**
 * Split a label into highlight segments for FA 1.0 multi-word filter matches.
 * Matched whitespace-delimited words are marked; surrounding words stay plain.
 */
export function splitFaSelectInputLabelForFilterHighlight (
  label: string,
  needle: string
): T_faSelectInputLabelHighlightSegment[] {
  const trimmedNeedle = needle.trim()
  if (trimmedNeedle.length === 0 || label.length === 0) {
    return [{
      isMatch: false,
      text: label
    }]
  }

  const match = matchFaSelectInputLabelByQueryWords(label, trimmedNeedle)
  if (!match.matches) {
    return [{
      isMatch: false,
      text: label
    }]
  }

  return buildFaSelectInputLabelHighlightSegmentsFromMatch(label, match)
}

/**
 * True when option is an object select item (not a simple string).
 */
export function isFaSelectInputObjectItem (
  item: T_faSelectInputOption
): item is I_faSelectInputObjectItem {
  return typeof item !== 'string'
}
