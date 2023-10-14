export const specialCharacterFixer = (inputString: string) => {
  const specialCharacterList = [
    '@',
    '|'
  ]

  specialCharacterList.forEach(Character => {
    inputString = inputString.replaceAll(Character, `{'${Character}'}`)
  })

  return inputString
}
