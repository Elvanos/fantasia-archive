import { findFaKeybindCommandDefinition } from './findFaKeybindCommandDefinitionWiring'
import {
  faKeybindResolveEffectiveChord,
  sortFaKeybindMods
} from './functions/faKeybindsChordEqualityAndResolve'

import { createFaKeybindsChordUiFormatting } from './functions/createFaKeybindsChordUiFormatting'

const faKeybindsChordUiFormattingApi = createFaKeybindsChordUiFormatting({
  faKeybindResolveEffectiveChord,
  findFaKeybindCommandDefinition,
  sortFaKeybindMods
})

export const formatFaKeybindChordForUi =
  faKeybindsChordUiFormattingApi.formatFaKeybindChordForUi

export const formatFaKeybindCommandLabelFromSnapshot =
  faKeybindsChordUiFormattingApi.formatFaKeybindCommandLabelFromSnapshot
