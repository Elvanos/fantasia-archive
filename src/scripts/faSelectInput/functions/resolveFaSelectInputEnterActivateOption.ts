import type {
  T_faSelectInputModelValue,
  T_faSelectInputOption
} from 'app/types/I_faSelectInput'

/**
 * Resolve the option Enter should activate: keyboard highlight index first, else current
 * single model value in the filtered list (Quasar may clear index on same-value Enter).
 */
export function resolveFaSelectInputEnterActivateOption (input: {
  filteredOptions: readonly T_faSelectInputOption[]
  getOptionIndex?: (() => number) | undefined
  modelValue: T_faSelectInputModelValue
}): T_faSelectInputOption | undefined {
  const index = input.getOptionIndex?.()
  if (typeof index === 'number' && index >= 0) {
    const fromIndex = input.filteredOptions[index]
    if (fromIndex !== undefined) {
      return fromIndex
    }
  }
  const model = input.modelValue
  if (model === null || model === undefined || Array.isArray(model)) {
    return undefined
  }
  return input.filteredOptions.find((candidate) => {
    if (typeof candidate === 'string' || typeof model === 'string') {
      return candidate === model
    }
    return candidate.id === model.id
  })
}
