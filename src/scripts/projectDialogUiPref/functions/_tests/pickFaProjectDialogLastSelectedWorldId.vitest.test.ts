import { describe, expect, test } from 'vitest'

import { pickFaProjectDialogLastSelectedWorldId } from '../pickFaProjectDialogLastSelectedWorldId'

describe('pickFaProjectDialogLastSelectedWorldId', () => {
  const worlds = [
    { id: 'world-a' },
    { id: 'world-b' }
  ]

  function pickFirst (): string | null {
    return 'world-a'
  }

  test('uses saved world when it still exists', () => {
    expect(pickFaProjectDialogLastSelectedWorldId({
      worlds,
      savedWorldId: 'world-b',
      pickFirstWorldId: pickFirst
    })).toBe('world-b')
  })

  test('falls back to first world when saved id is missing', () => {
    expect(pickFaProjectDialogLastSelectedWorldId({
      worlds,
      savedWorldId: 'deleted-world',
      pickFirstWorldId: pickFirst
    })).toBe('world-a')
  })

  test('falls back when saved id is null', () => {
    expect(pickFaProjectDialogLastSelectedWorldId({
      worlds,
      savedWorldId: null,
      pickFirstWorldId: pickFirst
    })).toBe('world-a')
  })
})
