export function rgbToHex (color: string) {
  const colorStringRegexMatch = color.match(/\d+/g)
  if (colorStringRegexMatch !== null) {
    const colorString = colorStringRegexMatch.map(function (x) {
      x = parseInt(x).toString(16)
      return (x.length === 1) ? '0' + x : x
    }).join('')
    return '#' + colorString
  }
  return false
}

export function hexToRgb (hex: string) {
  const bigint = parseInt(hex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255

  return r + ',' + g + ',' + b
}
