import type {
  I_faSelectInputObjectItem,
  I_faSelectInputUseDeps,
  I_faSelectInputUseInput,
  T_faSelectInputLabelHighlightSegment,
  T_faSelectInputModelValue,
  T_faSelectInputOption
} from 'app/types/I_faSelectInput'
import type { I_computedRef, I_ref } from 'app/types/I_vueCompositionShims'

type T_faSelectInputQSelectRef = {
  getOptionIndex?: () => number
  moveOptionSelection?: (offset: number, skipInputValue?: boolean) => void
  setOptionIndex?: (index: number) => void
  showPopup?: () => void
  updateInputValue?: (value: string) => void
}

type T_faSelectInputFilterUpdate = (
  callbackFn: () => void,
  afterFn?: (selectRef: T_faSelectInputQSelectRef) => void
) => void

type T_faSelectInputNewValueDoneMode = 'add' | 'add-unique' | 'toggle'
type T_faSelectInputNewValueDone = (
  value?: string | I_faSelectInputObjectItem,
  mode?: T_faSelectInputNewValueDoneMode
) => void

type T_faSelectInputApi = {
  chipColorForOption: (opt: T_faSelectInputOption) => string
  clearIsNewFlags: (ids: readonly string[]) => void
  filteredOptions: I_ref<T_faSelectInputOption[]>
  isObjectMode: I_computedRef<boolean>
  onFilter: (needle: string, update: T_faSelectInputFilterUpdate) => void
  onFocus: () => void
  onNewValue: (typedText: string, done?: T_faSelectInputNewValueDone) => void
  onPopupShow: () => void
  onSelectKeydown: (e: { key?: string, keyCode?: number }) => void
  onSelectKeyup: (e: { key?: string, keyCode?: number }) => void
  onUpdateModelValue: (value: T_faSelectInputModelValue) => void
  openPopup: () => void
  optionLabelHighlightSegments: (
    opt: T_faSelectInputOption
  ) => T_faSelectInputLabelHighlightSegment[]
  resolveOptionIcon: (opt: T_faSelectInputOption) => string | null
  selectRef: I_ref<T_faSelectInputQSelectRef | null>
}

function highlightFirstOption (
  select: T_faSelectInputQSelectRef | null | undefined,
  optionCount: number
): void {
  if (select == null || optionCount <= 0) {
    return
  }
  if (
    typeof select.setOptionIndex !== 'function' ||
    typeof select.moveOptionSelection !== 'function'
  ) {
    return
  }
  select.setOptionIndex(-1)
  select.moveOptionSelection(1, true)
}

function createFaSelectInputFilterCore (
  deps: I_faSelectInputUseDeps,
  input: I_faSelectInputUseInput,
  selectRef: I_ref<T_faSelectInputQSelectRef | null>
) {
  const filterNeedle = deps.ref('')
  const filteredOptions = deps.ref<T_faSelectInputOption[]>(
    deps.normalizeFaSelectInputOptions(input.getMode(), input.getOptions())
  )

  function refreshFilteredOptions (needle: string): void {
    filterNeedle.value = needle
    const normalized = deps.normalizeFaSelectInputOptions(
      input.getMode(),
      input.getOptions()
    )
    const filterFn = input.getFilterFn() ?? deps.filterFaSelectInputOptionsByQuery
    filteredOptions.value = filterFn(needle, normalized)
  }

  function optionLabelHighlightSegments (
    opt: T_faSelectInputOption
  ): T_faSelectInputLabelHighlightSegment[] {
    const label = typeof opt === 'string' ? opt : opt.name
    return deps.splitFaSelectInputLabelForFilterHighlight(label, filterNeedle.value)
  }

  function onFilter (needle: string, update: T_faSelectInputFilterUpdate): void {
    update(
      () => {
        refreshFilteredOptions(needle)
      },
      () => {
        highlightFirstOption(selectRef.value, filteredOptions.value.length)
      }
    )
  }

  return {
    filteredOptions,
    onFilter,
    optionLabelHighlightSegments,
    refreshFilteredOptions
  }
}

function createFaSelectInputModelHandlers (
  deps: I_faSelectInputUseDeps,
  input: I_faSelectInputUseInput,
  selectRef: I_ref<T_faSelectInputQSelectRef | null>
) {
  function maybeClearSearchInputAfterSelect (): void {
    if (!input.getClearInputOnSelect()) {
      return
    }
    void deps.nextTick(() => {
      selectRef.value?.updateInputValue?.('')
    })
  }

  function emitModelAndChange (nextValue: T_faSelectInputModelValue): void {
    const previousValue = input.getModelValue()
    input.emitModelValue(nextValue)
    input.emitChange(deps.createFaSelectInputChangePayload(
      previousValue,
      nextValue,
      input.getMultiple()
    ))
  }

  function onUpdateModelValue (value: T_faSelectInputModelValue): void {
    emitModelAndChange(value)
    maybeClearSearchInputAfterSelect()
  }

  function onNewValue (typedText: string, done?: T_faSelectInputNewValueDone): void {
    if (!input.getAllowCreateNew()) {
      done?.()
      return
    }
    const created = deps.createFaSelectInputNewItem(
      input.getMode(),
      typedText,
      deps.createId
    )
    if (created === null) {
      done?.()
      return
    }
    emitModelAndChange(deps.appendFaSelectInputCreatedValue(
      input.getModelValue(),
      created,
      input.getMultiple()
    ))
    input.emitNewValue(created)
    maybeClearSearchInputAfterSelect()
    done?.()
  }

  function clearIsNewFlags (ids: readonly string[]): void {
    const nextValue = deps.clearFaSelectInputIsNewFlags(input.getModelValue(), ids)
    if (nextValue === input.getModelValue()) {
      return
    }
    emitModelAndChange(nextValue)
  }

  return {
    clearIsNewFlags,
    onNewValue,
    onUpdateModelValue
  }
}

/** Level-1 FaSelectInput API (filter, highlight, create-new, openPopup, Enter activate). */
export function createFaSelectInputApi (
  deps: I_faSelectInputUseDeps,
  input: I_faSelectInputUseInput
): T_faSelectInputApi {
  const selectRef = deps.ref<T_faSelectInputQSelectRef | null>(null)
  const isObjectMode = deps.computed(() => deps.isFaSelectInputObjectMode(input.getMode()))
  const filterCore = createFaSelectInputFilterCore(deps, input, selectRef)
  const modelHandlers = createFaSelectInputModelHandlers(deps, input, selectRef)

  function openPopup (): void {
    selectRef.value?.showPopup?.()
  }

  function onFocus (): void {
    input.emitRequestOptions()
  }

  function onPopupShow (): void {
    input.emitRequestOptions()
    filterCore.refreshFilteredOptions('')
    highlightFirstOption(selectRef.value, filterCore.filteredOptions.value.length)
  }

  // Tab keyup lands on newly focused field — open without click race (QSelect inheritAttrs false).
  function onSelectKeyup (e: { key?: string, keyCode?: number }): void {
    if (e.key === 'Tab' || e.keyCode === 9) {
      openPopup()
    }
  }

  // Enter uses toggleOption (not option onClick); same-value still needs option-activate.
  function onSelectKeydown (e: { key?: string, keyCode?: number }): void {
    if (e.key !== 'Enter' && e.keyCode !== 13) {
      return
    }
    const index = selectRef.value?.getOptionIndex?.()
    if (typeof index !== 'number' || index < 0) {
      return
    }
    const opt = filterCore.filteredOptions.value[index]
    if (opt !== undefined) {
      input.emitOptionActivate(opt)
    }
  }

  function chipColorForOption (opt: T_faSelectInputOption): string {
    if (typeof opt !== 'string' && opt.isNew === true) {
      return deps.newChipColor
    }
    return deps.defaultChipColor
  }

  function resolveOptionIcon (opt: T_faSelectInputOption): string | null {
    return deps.resolveFaSelectInputOptionIcon(
      opt,
      input.getMode(),
      deps.emptyDocumentTemplateIcon
    )
  }

  return {
    chipColorForOption,
    clearIsNewFlags: modelHandlers.clearIsNewFlags,
    filteredOptions: filterCore.filteredOptions,
    isObjectMode,
    onFilter: filterCore.onFilter,
    onFocus,
    onNewValue: modelHandlers.onNewValue,
    onPopupShow,
    onSelectKeydown,
    onSelectKeyup,
    onUpdateModelValue: modelHandlers.onUpdateModelValue,
    openPopup,
    optionLabelHighlightSegments: filterCore.optionLabelHighlightSegments,
    resolveOptionIcon,
    selectRef
  }
}
