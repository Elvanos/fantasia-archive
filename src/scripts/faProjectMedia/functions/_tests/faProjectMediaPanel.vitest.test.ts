import { expect, test } from 'vitest'

import {
  FA_DIALOG_PROJECT_MEDIA_ADD_PANEL,
  FA_DIALOG_PROJECT_MEDIA_LIST_PANEL,
  FA_DIALOG_PROJECT_MEDIA_MASS_EDIT_PANEL,
  FA_DIALOG_PROJECT_MEDIA_SINGLE_EDIT_PANEL,
  normalizeFaProjectMediaPanel,
  resolveFaProjectMediaOpenPanel
} from '../faProjectMediaPanel'

/**
 * normalizeFaProjectMediaPanel
 * Known panel ids pass through; anything else becomes the list panel.
 */
test('Test that normalizeFaProjectMediaPanel maps known ids and garbage to list', () => {
  expect(normalizeFaProjectMediaPanel(FA_DIALOG_PROJECT_MEDIA_LIST_PANEL)).toBe(
    FA_DIALOG_PROJECT_MEDIA_LIST_PANEL
  )
  expect(normalizeFaProjectMediaPanel(FA_DIALOG_PROJECT_MEDIA_ADD_PANEL)).toBe(
    FA_DIALOG_PROJECT_MEDIA_ADD_PANEL
  )
  expect(normalizeFaProjectMediaPanel(FA_DIALOG_PROJECT_MEDIA_SINGLE_EDIT_PANEL)).toBe(
    FA_DIALOG_PROJECT_MEDIA_SINGLE_EDIT_PANEL
  )
  expect(normalizeFaProjectMediaPanel(FA_DIALOG_PROJECT_MEDIA_MASS_EDIT_PANEL)).toBe(
    FA_DIALOG_PROJECT_MEDIA_MASS_EDIT_PANEL
  )
  expect(normalizeFaProjectMediaPanel(undefined)).toBe(FA_DIALOG_PROJECT_MEDIA_LIST_PANEL)
  expect(normalizeFaProjectMediaPanel('nope')).toBe(FA_DIALOG_PROJECT_MEDIA_LIST_PANEL)
})

/**
 * resolveFaProjectMediaOpenPanel
 * Known initialPanel wins. Empty library defaults to add; nonempty to list.
 */
test('Test that resolveFaProjectMediaOpenPanel prefers explicit ids then empty-add', () => {
  expect(resolveFaProjectMediaOpenPanel({
    hasAnyMedia: false,
    initialPanelRaw: FA_DIALOG_PROJECT_MEDIA_LIST_PANEL
  })).toBe(FA_DIALOG_PROJECT_MEDIA_LIST_PANEL)
  expect(resolveFaProjectMediaOpenPanel({
    hasAnyMedia: false,
    initialPanelRaw: undefined
  })).toBe(FA_DIALOG_PROJECT_MEDIA_ADD_PANEL)
  expect(resolveFaProjectMediaOpenPanel({
    hasAnyMedia: true,
    initialPanelRaw: undefined
  })).toBe(FA_DIALOG_PROJECT_MEDIA_LIST_PANEL)
  expect(resolveFaProjectMediaOpenPanel({
    hasAnyMedia: false,
    initialPanelRaw: 'nope'
  })).toBe(FA_DIALOG_PROJECT_MEDIA_ADD_PANEL)
  expect(resolveFaProjectMediaOpenPanel({
    hasAnyMedia: true,
    initialPanelRaw: FA_DIALOG_PROJECT_MEDIA_MASS_EDIT_PANEL
  })).toBe(FA_DIALOG_PROJECT_MEDIA_MASS_EDIT_PANEL)
})
