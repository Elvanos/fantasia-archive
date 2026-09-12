import { expect, test } from 'vitest'

import {
  resolveDialogProjectMediaSingleEditNavPanes,
  resolveDialogProjectMediaSingleEditNavTrackClassList,
  shouldFinishDialogProjectMediaSingleEditNavTrackTransition,
  shouldIgnoreFaProjectMediaSingleEditLiveRowUpdate
} from '../dialogProjectMediaSingleEditNavTrack'

/**
 * resolveDialogProjectMediaSingleEditNavPanes
 * Idle, next, and previous pane order.
 */
test('Test that resolveDialogProjectMediaSingleEditNavPanes orders incoming from the button side', () => {
  expect(resolveDialogProjectMediaSingleEditNavPanes({
    direction: null,
    liveId: null,
    outgoingId: null
  })).toEqual([])
  expect(resolveDialogProjectMediaSingleEditNavPanes({
    direction: 'next',
    liveId: 'a',
    outgoingId: null
  })).toEqual([{
    id: 'a',
    kind: 'live'
  }])
  expect(resolveDialogProjectMediaSingleEditNavPanes({
    direction: 'next',
    liveId: 'b',
    outgoingId: 'a'
  })).toEqual([
    {
      id: 'a',
      kind: 'outgoing'
    },
    {
      id: 'b',
      kind: 'live'
    }
  ])
  expect(resolveDialogProjectMediaSingleEditNavPanes({
    direction: 'previous',
    liveId: 'a',
    outgoingId: 'b'
  })).toEqual([
    {
      id: 'a',
      kind: 'live'
    },
    {
      id: 'b',
      kind: 'outgoing'
    }
  ])
})

/**
 * resolveDialogProjectMediaSingleEditNavTrackClassList
 * Split start vs moving modifiers.
 */
test('Test that resolveDialogProjectMediaSingleEditNavTrackClassList builds split moving classes', () => {
  expect(resolveDialogProjectMediaSingleEditNavTrackClassList({
    direction: 'next',
    isMoving: false,
    isSplit: false
  })).toEqual([])
  expect(resolveDialogProjectMediaSingleEditNavTrackClassList({
    direction: null,
    isMoving: true,
    isSplit: true
  })).toEqual([])
  expect(resolveDialogProjectMediaSingleEditNavTrackClassList({
    direction: 'previous',
    isMoving: false,
    isSplit: true
  })).toEqual([
    'dialogProjectMediaSingleEditSlide__track--split',
    'dialogProjectMediaSingleEditSlide__track--previous'
  ])
  expect(resolveDialogProjectMediaSingleEditNavTrackClassList({
    direction: 'next',
    isMoving: true,
    isSplit: true
  })).toEqual([
    'dialogProjectMediaSingleEditSlide__track--split',
    'dialogProjectMediaSingleEditSlide__track--next',
    'dialogProjectMediaSingleEditSlide__track--moving'
  ])
})

/**
 * shouldIgnoreFaProjectMediaSingleEditLiveRowUpdate
 * Stale outgoing id after live already swapped.
 */
test('Test that shouldIgnoreFaProjectMediaSingleEditLiveRowUpdate drops stale outgoing echoes', () => {
  expect(shouldIgnoreFaProjectMediaSingleEditLiveRowUpdate({
    liveId: 'b',
    nextId: 'a',
    outgoingId: 'a'
  })).toBe(true)
  expect(shouldIgnoreFaProjectMediaSingleEditLiveRowUpdate({
    liveId: 'a',
    nextId: 'a',
    outgoingId: 'a'
  })).toBe(false)
  expect(shouldIgnoreFaProjectMediaSingleEditLiveRowUpdate({
    liveId: 'b',
    nextId: 'b',
    outgoingId: 'a'
  })).toBe(false)
  expect(shouldIgnoreFaProjectMediaSingleEditLiveRowUpdate({
    liveId: null,
    nextId: 'a',
    outgoingId: 'a'
  })).toBe(false)
  expect(shouldIgnoreFaProjectMediaSingleEditLiveRowUpdate({
    liveId: 'b',
    nextId: 'a',
    outgoingId: null
  })).toBe(false)
})

/**
 * shouldFinishDialogProjectMediaSingleEditNavTrackTransition
 * Track transform only.
 */
test('Test that shouldFinishDialogProjectMediaSingleEditNavTrackTransition requires the track transform', () => {
  const track = {}
  const child = {}
  expect(shouldFinishDialogProjectMediaSingleEditNavTrackTransition({
    currentTarget: track,
    propertyName: 'transform',
    target: track
  })).toBe(true)
  expect(shouldFinishDialogProjectMediaSingleEditNavTrackTransition({
    currentTarget: track,
    propertyName: '',
    target: track
  })).toBe(true)
  expect(shouldFinishDialogProjectMediaSingleEditNavTrackTransition({
    currentTarget: track,
    propertyName: 'opacity',
    target: track
  })).toBe(false)
  expect(shouldFinishDialogProjectMediaSingleEditNavTrackTransition({
    currentTarget: track,
    propertyName: 'transform',
    target: child
  })).toBe(false)
})
