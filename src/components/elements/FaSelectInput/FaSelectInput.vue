<template>
  <div
    class="faSelectInput"
    :class="{
      'faSelectInput--inline': selectionPresentation === 'inline'
    }"
    @keydown.capture="onSelectKeydown"
    @keyup.capture="onSelectKeyup"
  >
    <q-select
      ref="selectRef"
      class="faSelectInput__field"
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
            :class="resolveFaSelectInputOptionIconClass(scope.opt)"
            :name="resolveOptionIcon(scope.opt) ?? undefined"
            :style="resolveFaSelectInputOptionIconStyle(scope.opt, buildFaSelectInputOptionIconStyle) ?? undefined"
            size="16px"
          />
          {{ resolveFaSelectInputObjectOptionLabel(scope.opt) }}
        </q-chip>
        <div
          v-else-if="selectionPresentation === 'inline' && shouldShowFaSelectInputInlineSelection(scope.opt)"
          class="faSelectInput__selectedInline row items-center no-wrap"
          :data-test-locator="`${testLocator}-selected`"
        >
          <q-icon
            v-if="resolveOptionIcon(scope.opt) !== null"
            class="faSelectInput__optionIcon q-mr-sm"
            :class="resolveFaSelectInputOptionIconClass(scope.opt)"
            :name="resolveOptionIcon(scope.opt) ?? undefined"
            :style="resolveFaSelectInputOptionIconStyle(scope.opt, buildFaSelectInputOptionIconStyle) ?? undefined"
          />
          <span>{{ resolveFaSelectInputObjectOptionLabel(scope.opt) }}</span>
        </div>
      </template>

      <!-- One root per option; CSS separatorAlt. -->
      <template #option="scope">
        <FaSelectInputOptionItem
          :activate-only="activateOnly === true"
          :icon-class="resolveFaSelectInputOptionIconClass(scope.opt)"
          :icon-name="resolveOptionIcon(scope.opt)"
          :icon-style="resolveFaSelectInputOptionIconStyle(scope.opt, buildFaSelectInputOptionIconStyle)"
          :index="scope.index"
          :item-props="scope.itemProps"
          :label-segments="optionLabelHighlightSegments(scope.opt)"
          :opt="scope.opt"
          :test-locator="testLocator"
          @option-activate="emit('option-activate', $event)"
          @option-auxclick="emit('option-auxclick', scope.opt, $event)"
        >
          <template
            v-if="$slots['option-trailing']"
            #option-trailing
          >
            <slot
              name="option-trailing"
              v-bind="scope"
            />
          </template>
          <template
            v-if="$slots['option-context-menu']"
            #option-context-menu
          >
            <slot
              name="option-context-menu"
              v-bind="scope"
            />
          </template>
        </FaSelectInputOptionItem>
      </template>
    </q-select>
  </div>
</template>

<script setup lang="ts">
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
  buildFaSelectInputOptionIconStyle,
  resolveFaSelectInputObjectOptionLabel,
  resolveFaSelectInputOptionIconClass,
  resolveFaSelectInputOptionIconStyle,
  shouldShowFaSelectInputInlineSelection,
  shouldShowFaSelectInputSelectedChip,
  useFaSelectInput
} from './scripts/faSelectInput_manager'
import FaSelectInputOptionItem from './FaSelectInputOptionItem.vue'

defineOptions({
  name: 'FaSelectInput'
})

const props = withDefaults(
  /* eslint-disable vue/require-default-prop -- exactOptionalPropertyTypes: omit undefined from withDefaults */
  defineProps<{
    activateOnly?: boolean
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
    activateOnly: false,
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
  'option-auxclick': [value: T_faSelectInputOption, event: MouseEvent]
  'request-options': []
  'update:modelValue': [value: T_faSelectInputModelValue]
}>()

const {
  chipColorForOption,
  clearIsNewFlags,
  filteredOptions,
  getFilterNeedle,
  hidePopup,
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
  getActivateOnly: () => props.activateOnly,
  getAllowCreateNew: () => props.allowCreateNew,
  getClearInputOnSelect: () => props.clearInputOnSelect,
  getFilterFn: () => props.filterFn,
  getMode: () => props.mode,
  getModelValue: () => props.modelValue,
  getMultiple: () => props.multiple,
  getOptions: () => props.options
})

defineExpose({
  clearIsNewFlags,
  getFilterNeedle,
  hidePopup,
  openPopup
})
</script>

<style lang="scss" src="./styles/FaSelectInput.unscoped.scss"></style>
