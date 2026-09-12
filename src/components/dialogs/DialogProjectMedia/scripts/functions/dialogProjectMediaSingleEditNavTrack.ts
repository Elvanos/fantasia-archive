/**
 * Pane order and track classes for the list single-edit nav animation.
 * Previous incoming from the left; next incoming from the right.
 */
export function resolveDialogProjectMediaSingleEditNavPanes (input: {
  direction: 'next' | 'previous' | null
  liveId: string | null
  outgoingId: string | null
}): Array<{ id: string, kind: 'live' | 'outgoing' }> {
  const liveId = input.liveId
  if (liveId === null) {
    return []
  }
  const livePane = {
    id: liveId,
    kind: 'live' as const
  }
  const outgoingId = input.outgoingId
  const direction = input.direction
  if (outgoingId === null || direction === null) {
    return [livePane]
  }
  const outgoingPane = {
    id: outgoingId,
    kind: 'outgoing' as const
  }
  if (direction === 'next') {
    return [outgoingPane, livePane]
  }
  return [livePane, outgoingPane]
}

/**
 * Split / direction / moving BEM modifiers for the nav track.
 */
export function resolveDialogProjectMediaSingleEditNavTrackClassList (input: {
  direction: 'next' | 'previous' | null
  isMoving: boolean
  isSplit: boolean
}): string[] {
  const direction = input.direction
  if (!input.isSplit || direction === null) {
    return []
  }
  const splitClass = 'dialogProjectMediaSingleEditSlide__track--split'
  const directionClass = `dialogProjectMediaSingleEditSlide__track--${direction}`
  if (!input.isMoving) {
    return [splitClass, directionClass]
  }
  return [
    splitClass,
    directionClass,
    'dialogProjectMediaSingleEditSlide__track--moving'
  ]
}

/**
 * Drop unmount echoes of the outgoing row after the live pane already swapped.
 */
export function shouldIgnoreFaProjectMediaSingleEditLiveRowUpdate (input: {
  liveId: string | null
  nextId: string
  outgoingId: string | null
}): boolean {
  if (input.outgoingId === null || input.liveId === null) {
    return false
  }
  return input.nextId === input.outgoingId && input.liveId !== input.nextId
}

/**
 * Finish only on the track transform, including empty property names from tests.
 */
export function shouldFinishDialogProjectMediaSingleEditNavTrackTransition (input: {
  currentTarget: unknown
  propertyName: string
  target: unknown
}): boolean {
  if (input.target !== input.currentTarget) {
    return false
  }
  return input.propertyName === '' || input.propertyName === 'transform'
}
