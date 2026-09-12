import { expect, test } from 'vitest'

import {
  FA_DIALOG_PROJECT_MEDIA_ADD_ONLINE_URLS_PANEL,
  FA_DIALOG_PROJECT_MEDIA_ADD_PANEL,
  FA_DIALOG_PROJECT_MEDIA_LIST_PANEL,
  FA_DIALOG_PROJECT_MEDIA_MASS_EDIT_PANEL,
  FA_DIALOG_PROJECT_MEDIA_SINGLE_EDIT_PANEL,
  normalizeFaProjectMediaPanel,
  resolveFaProjectMediaDialogPersistent,
  resolveFaProjectMediaDialogTitleI18nKey,
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
  expect(normalizeFaProjectMediaPanel(FA_DIALOG_PROJECT_MEDIA_ADD_ONLINE_URLS_PANEL)).toBe(
    FA_DIALOG_PROJECT_MEDIA_ADD_ONLINE_URLS_PANEL
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
 * Known initialPanel wins. Missing or unknown ids: add if empty, list if any media.
 */
test('Test that resolveFaProjectMediaOpenPanel prefers explicit ids then add or list', () => {
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
    initialPanelRaw: 'nope'
  })).toBe(FA_DIALOG_PROJECT_MEDIA_LIST_PANEL)
  expect(resolveFaProjectMediaOpenPanel({
    hasAnyMedia: true,
    initialPanelRaw: FA_DIALOG_PROJECT_MEDIA_MASS_EDIT_PANEL
  })).toBe(FA_DIALOG_PROJECT_MEDIA_MASS_EDIT_PANEL)
  expect(resolveFaProjectMediaOpenPanel({
    hasAnyMedia: false,
    initialPanelRaw: FA_DIALOG_PROJECT_MEDIA_ADD_ONLINE_URLS_PANEL
  })).toBe(FA_DIALOG_PROJECT_MEDIA_ADD_ONLINE_URLS_PANEL)
})

/**
 * resolveFaProjectMediaDialogPersistent
 * Sticky flag follows the active slide only.
 */
test('Test that resolveFaProjectMediaDialogPersistent follows the active panel only', () => {
  expect(resolveFaProjectMediaDialogPersistent({
    onlineUrlsDraft: 'https://example.com',
    selectedPanel: FA_DIALOG_PROJECT_MEDIA_ADD_PANEL,
    singleEditDirty: false
  })).toBe(false)
  expect(resolveFaProjectMediaDialogPersistent({
    onlineUrlsDraft: '',
    selectedPanel: FA_DIALOG_PROJECT_MEDIA_ADD_ONLINE_URLS_PANEL,
    singleEditDirty: false
  })).toBe(false)
  expect(resolveFaProjectMediaDialogPersistent({
    onlineUrlsDraft: '   ',
    selectedPanel: FA_DIALOG_PROJECT_MEDIA_ADD_ONLINE_URLS_PANEL,
    singleEditDirty: false
  })).toBe(false)
  expect(resolveFaProjectMediaDialogPersistent({
    onlineUrlsDraft: 'https://example.com',
    selectedPanel: FA_DIALOG_PROJECT_MEDIA_ADD_ONLINE_URLS_PANEL,
    singleEditDirty: false
  })).toBe(true)
  expect(resolveFaProjectMediaDialogPersistent({
    onlineUrlsDraft: '',
    selectedPanel: FA_DIALOG_PROJECT_MEDIA_MASS_EDIT_PANEL,
    singleEditDirty: false
  })).toBe(true)
  expect(resolveFaProjectMediaDialogPersistent({
    onlineUrlsDraft: '',
    selectedPanel: FA_DIALOG_PROJECT_MEDIA_LIST_PANEL,
    singleEditDirty: false
  })).toBe(true)
  expect(resolveFaProjectMediaDialogPersistent({
    onlineUrlsDraft: '',
    selectedPanel: FA_DIALOG_PROJECT_MEDIA_SINGLE_EDIT_PANEL,
    singleEditDirty: false
  })).toBe(false)
  expect(resolveFaProjectMediaDialogPersistent({
    onlineUrlsDraft: '',
    selectedPanel: FA_DIALOG_PROJECT_MEDIA_SINGLE_EDIT_PANEL,
    singleEditDirty: true
  })).toBe(true)
})

/**
 * resolveFaProjectMediaDialogTitleI18nKey
 * Each slide maps to its dialog heading message key.
 */
test('Test that resolveFaProjectMediaDialogTitleI18nKey follows the active panel', () => {
  expect(resolveFaProjectMediaDialogTitleI18nKey(FA_DIALOG_PROJECT_MEDIA_LIST_PANEL))
    .toBe('dialogs.projectMedia.titleList')
  expect(resolveFaProjectMediaDialogTitleI18nKey(FA_DIALOG_PROJECT_MEDIA_SINGLE_EDIT_PANEL))
    .toBe('dialogs.projectMedia.titleSingle')
  expect(resolveFaProjectMediaDialogTitleI18nKey(FA_DIALOG_PROJECT_MEDIA_ADD_PANEL))
    .toBe('dialogs.projectMedia.titleAdd')
  expect(resolveFaProjectMediaDialogTitleI18nKey(FA_DIALOG_PROJECT_MEDIA_ADD_ONLINE_URLS_PANEL))
    .toBe('dialogs.projectMedia.titleAddOnline')
  expect(resolveFaProjectMediaDialogTitleI18nKey(FA_DIALOG_PROJECT_MEDIA_MASS_EDIT_PANEL))
    .toBe('dialogs.projectMedia.titleMassEdit')
})
