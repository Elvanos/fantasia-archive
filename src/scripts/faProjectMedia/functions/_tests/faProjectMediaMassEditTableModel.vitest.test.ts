import { expect, test } from 'vitest'

import {
  buildFaProjectMediaMassEditSelectOptionLists,
  selectFaProjectMediaMassEditOptionById
} from '../faProjectMediaMassEditTableModel'

test('Test that mass-edit select option lists use i18n keys as names and db ids', () => {
  const lists = buildFaProjectMediaMassEditSelectOptionLists((key) => key)
  expect(lists.typeOptions.map((option) => option.id)).toEqual(['internal', 'external'])
  expect(lists.internalTypeOptions.map((option) => option.id)).toEqual([
    'embedded',
    'linked_outside',
    'linked_in_project'
  ])
  expect(lists.externalTypeOptions.map((option) => option.id)).toEqual(['linked', 'embed'])
  expect(lists.externalTypeOptions[1]?.icon).toBe('fa-solid fa-file-code')
  expect(lists.typeOptions[0]?.name).toBe('dialogs.projectMedia.massEditTypeInternal')
})

test('Test that mass-edit option lookup matches id or returns null', () => {
  const lists = buildFaProjectMediaMassEditSelectOptionLists((key) => key)
  expect(selectFaProjectMediaMassEditOptionById(lists.typeOptions, 'external')?.id).toBe('external')
  expect(selectFaProjectMediaMassEditOptionById(lists.typeOptions, '')).toBeNull()
})
