<template>
  <q-select
    ref="selectRef"
    class="faSelectInput"
    :class="{
      'faSelectInput--inline': selectionPresentation === 'inline'
    }"
    :color="color"
    :dark="dark"
    :dense="dense"
    :disable="disable"
    :filled="filled"
    :input-debounce="0"
    :label="label"
    :loading="loading"
    :model-value="modelValue"
    :multiple="multiple"
    :options="filteredOptions"
    :option-label="isObjectMode ? 'name' : undefined"
    :option-value="isObjectMode ? 'id' : undefined"
    :map-options="isObjectMode"
    :options-selected-class="FA_SELECT_INPUT_OPTIONS_SELECTED_CLASS"
    :use-chips="selectionPresentation === 'chips'"
    use-input
    menu-anchor="bottom middle"
    menu-self="top middle"
    :popup-content-class="popupContentClass"
    :virtual-scroll-item-size="FA_SELECT_INPUT_VIRTUAL_SCROLL_ITEM_SIZE"
    :virtual-scroll-slice-size="FA_SELECT_INPUT_VIRTUAL_SCROLL_SLICE_SIZE"
    :data-test-locator="testLocator"
    :data-test-locator-filter="`${testLocator}-filter`"
    @filter="onFilter"
    @focus="onFocus"
    @keydown="onSelectKeydown"
    @keyup="onSelectKeyup"
    @new-value="onNewValue"
    @popup-show="onPopupShow"
    @update:model-value="onUpdateModelValue"
  >
    <template #selected-item="scope">
      <q-chip
        v-if="selectionPresentation === 'chips' && shouldShowFaSelectInputSelectedChip(scope.opt)"
        class="text-bold"
        :color="chipColorForOption(scope.opt)"
        dense
        :removable="chipRemovable"
        :ripple="false"
        :tabindex="scope.tabindex"
        :text-color="FA_SELECT_INPUT_CHIP_TEXT_COLOR"
        :data-test-locator="`${testLocator}-chip`"
        @remove="scope.removeAtIndex(scope.index)"
      >
        <q-icon
          v-if="resolveOptionIcon(scope.opt) !== null"
          class="q-mr-xs"
          :class="optionIconClass(scope.opt)"
          :name="resolveOptionIcon(scope.opt) ?? undefined"
          :style="optionIconStyle(scope.opt) ?? undefined"
          size="16px"
        />
        {{ objectOptionLabel(scope.opt) }}
      </q-chip>
      <div
        v-else-if="selectionPresentation === 'inline' && shouldShowFaSelectInputInlineSelection(scope.opt)"
        class="faSelectInput__selectedInline row items-center no-wrap"
        :data-test-locator="`${testLocator}-selected`"
      >
        <q-icon
          v-if="resolveOptionIcon(scope.opt) !== null"
          class="q-mr-sm"
          :class="optionIconClass(scope.opt)"
          :name="resolveOptionIcon(scope.opt) ?? undefined"
          :style="optionIconStyle(scope.opt) ?? undefined"
        />
        <span>{{ objectOptionLabel(scope.opt) }}</span>
      </div>
    </template>

    <!-- One root per option; CSS separatorAlt. Extra nodes → virtual-scroll empty gap. -->
    <template #option="scope">
      <q-item
        v-bind="optionItemProps(scope)"
        :class="{
          'faSelectInput__option--separatorAlt': scope.index > 0
        }"
        :data-test-locator="`${testLocator}-option-${scope.index}`"
        :data-test-locator-separator-alt="scope.index > 0
          ? `${testLocator}-separatorAlt-${scope.index}`
          : undefined"
      >
        <q-item-section
          v-if="resolveOptionIcon(scope.opt) !== null"
          avatar
        >
          <q-icon
            :class="optionIconClass(scope.opt)"
            :name="resolveOptionIcon(scope.opt) ?? undefined"
            :style="optionIconStyle(scope.opt) ?? undefined"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <span
              v-for="(segment, segmentIndex) in optionLabelHighlightSegments(scope.opt)"
              :key="`${segmentIndex}-${segment.text}`"
              :class="{
                faSelectInput__optionMatch: segment.isMatch
              }"
            >{{ segment.text }}</span>
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import type { I_faColorGlyphCssCustomProperties } from 'app/types/I_faColorContrast'
import {
  FA_SELECT_INPUT_CHIP_TEXT_COLOR,
  FA_SELECT_INPUT_OPTIONS_SELECTED_CLASS,
  FA_SELECT_INPUT_VIRTUAL_SCROLL_ITEM_SIZE,
  FA_SELECT_INPUT_VIRTUAL_SCROLL_SLICE_SIZE,
  type I_faSelectInputChangePayload,
  type I_faSelectInputObjectItem,
  type T_faSelectInputFilterFn,
  type T_faSelectInputMode,
  type T_faSelectInputModelValue,
  type T_faSelectInputOption,
  type T_faSelectInputOptions,
  type T_faSelectInputSelectionPresentation
} from 'app/types/I_faSelectInput'

import {
  bindFaSelectInputOptionItemActivateProps,
  buildFaSelectInputOptionIconStyle,
  resolveFaSelectInputObjectOptionLabel,
  resolveFaSelectInputOptionIconClass,
  resolveFaSelectInputOptionIconStyle,
  shouldShowFaSelectInputInlineSelection,
  shouldShowFaSelectInputSelectedChip,
  useFaSelectInput
} from './scripts/faSelectInput_manager'

defineOptions({
  name: 'FaSelectInput'
})

const objectOptionLabel = resolveFaSelectInputObjectOptionLabel
const optionIconClass = resolveFaSelectInputOptionIconClass

const props = withDefaults(
  /* eslint-disable vue/require-default-prop -- exactOptionalPropertyTypes: omit undefined from withDefaults */
  defineProps<{
    allowCreateNew?: boolean
    chipRemovable?: boolean
    clearInputOnSelect?: boolean
    color?: string
    dark?: boolean
    dense?: boolean
    disable?: boolean
    filled?: boolean
    filterFn?: T_faSelectInputFilterFn
    label?: string
    loading?: boolean
    mode: T_faSelectInputMode
    modelValue: T_faSelectInputModelValue
    multiple?: boolean
    options: T_faSelectInputOptions
    popupContentClass?: string
    selectionPresentation?: T_faSelectInputSelectionPresentation
    testLocator: string
  }>(),
  {
    allowCreateNew: false,
    chipRemovable: true,
    clearInputOnSelect: false,
    color: 'primary-bright',
    dark: true,
    dense: true,
    disable: false,
    filled: true,
    loading: false,
    multiple: false,
    popupContentClass: 'faSelectInput__menu',
    selectionPresentation: 'chips'
  }
  /* eslint-enable vue/require-default-prop */
)

const emit = defineEmits<{
  change: [payload: I_faSelectInputChangePayload]
  'new-value': [value: string | I_faSelectInputObjectItem]
  'option-activate': [value: T_faSelectInputOption]
  'request-options': []
  'update:modelValue': [value: T_faSelectInputModelValue]
}>()

const {
  chipColorForOption,
  clearIsNewFlags,
  filteredOptions,
  isObjectMode,
  onFilter,
  onFocus,
  onNewValue,
  onPopupShow,
  onSelectKeydown,
  onSelectKeyup,
  onUpdateModelValue,
  openPopup,
  optionLabelHighlightSegments,
  resolveOptionIcon,
  selectRef
} = useFaSelectInput({
  emitChange: (payload) => {
    emit('change', payload)
  },
  emitModelValue: (value) => {
    emit('update:modelValue', value)
  },
  emitNewValue: (value) => {
    emit('new-value', value)
  },
  emitOptionActivate: (value) => {
    emit('option-activate', value)
  },
  emitRequestOptions: () => {
    emit('request-options')
  },
  getAllowCreateNew: () => props.allowCreateNew,
  getClearInputOnSelect: () => props.clearInputOnSelect,
  getFilterFn: () => props.filterFn,
  getMode: () => props.mode,
  getModelValue: () => props.modelValue,
  getMultiple: () => props.multiple,
  getOptions: () => props.options
})

function optionItemProps (scope: {
  itemProps: Record<string, unknown>
  opt: T_faSelectInputOption
}): Record<string, unknown> {
  return bindFaSelectInputOptionItemActivateProps(
    scope.itemProps,
    () => {
      emit('option-activate', scope.opt)
    }
  )
}

function optionIconStyle (
  opt: T_faSelectInputOption
): I_faColorGlyphCssCustomProperties | null {
  return resolveFaSelectInputOptionIconStyle(opt, buildFaSelectInputOptionIconStyle)
}

defineExpose({
  clearIsNewFlags,
  openPopup
})
</script>

<style lang="scss" src="./styles/FaSelectInput.unscoped.scss"></style>
