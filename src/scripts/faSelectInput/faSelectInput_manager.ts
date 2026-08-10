import {
  createBuildFaSelectInputOptionIconStyle,
  resolveFaSelectInputOptionIconColor
} from './functions/buildFaSelectInputOptionIconStyle'
import { clearFaSelectInputIsNewFlags } from './functions/faSelectInputClearIsNew'
import { createFaSelectInputNewItem } from './functions/faSelectInputCreateNewItem'
import {
  filterFaSelectInputOptionsByQuery,
  isFaSelectInputObjectItem
} from './functions/filterFaSelectInputOptionsByQuery'
import {
  appendFaSelectInputCreatedValue,
  createFaSelectInputChangePayload,
  resolveFaSelectInputChangeAction
} from './functions/faSelectInputModelChange'
import {
  createFaSelectInputEmptyModel,
  isFaSelectInputMediaModeStub,
  isFaSelectInputObjectMode,
  normalizeFaSelectInputOptions
} from './functions/faSelectInputModeNormalize'
import { splitFaSelectInputLabelForFilterHighlight } from './functions/faSelectInputLabelFilterHighlight'
import { resolveFaSelectInputOptionIcon } from './functions/resolveFaSelectInputOptionIcon'
import { shouldShowFaSelectInputSelectedChip } from './functions/faSelectInputSelectedChipVisibility'
import {
  bindFaSelectInputOptionItemActivateProps,
  stripFaSelectInputOptionItemActiveClass
} from './functions/stripFaSelectInputOptionItemActiveClass'

export {
  appendFaSelectInputCreatedValue,
  bindFaSelectInputOptionItemActivateProps,
  clearFaSelectInputIsNewFlags,
  createBuildFaSelectInputOptionIconStyle,
  createFaSelectInputChangePayload,
  createFaSelectInputEmptyModel,
  createFaSelectInputNewItem,
  filterFaSelectInputOptionsByQuery,
  isFaSelectInputMediaModeStub,
  isFaSelectInputObjectItem,
  isFaSelectInputObjectMode,
  normalizeFaSelectInputOptions,
  resolveFaSelectInputChangeAction,
  resolveFaSelectInputOptionIcon,
  resolveFaSelectInputOptionIconColor,
  shouldShowFaSelectInputSelectedChip,
  splitFaSelectInputLabelForFilterHighlight,
  stripFaSelectInputOptionItemActiveClass
}
