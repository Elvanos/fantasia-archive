/**
 * Picks a world id from a saved dialog UI preference, falling back to first-by-sort helper.
 */
export function pickFaProjectDialogLastSelectedWorldId (input: {
  worlds: readonly { id: string }[]
  savedWorldId: string | null
  pickFirstWorldId: (worlds: readonly { id: string }[]) => string | null
}): string | null {
  const saved = input.savedWorldId
  if (saved !== null && saved.length > 0) {
    const match = input.worlds.find((world) => world.id === saved)
    if (match !== undefined) {
      return match.id
    }
  }
  return input.pickFirstWorldId(input.worlds)
}
