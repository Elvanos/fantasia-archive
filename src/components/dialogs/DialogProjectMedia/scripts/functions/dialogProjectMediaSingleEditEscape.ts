import type {
  I_bindFaProjectMediaSingleEditSlideEscapeInput,
  I_dialogProjectMediaSingleEditKeydownEvent
} from 'app/types/I_bindDialogProjectMediaSingleEdit'

/**
 * True when Escape must not reach the sticky Project Media QDialog.
 */
export function shouldStopFaProjectMediaSingleEditSlideEscapePropagation (input: {
  isSlideOpen: boolean
  key: string
}): boolean {
  return input.isSlideOpen && input.key === 'Escape'
}

/**
 * True when Escape should dismiss the list single-edit slide.
 */
export function shouldCloseFaProjectMediaSingleEditSlideOnEscape (input: {
  isDirty: boolean
  isFieldActive: boolean
  isSlideOpen: boolean
  key: string
}): boolean {
  return input.isSlideOpen &&
    !input.isDirty &&
    !input.isFieldActive &&
    input.key === 'Escape'
}

/**
 * True when Escape should leave an edit field instead of closing the slide.
 */
export function shouldBlurFaProjectMediaSingleEditSlideFieldOnEscape (input: {
  isFieldActive: boolean
  isSlideOpen: boolean
  key: string
}): boolean {
  return input.isSlideOpen && input.isFieldActive && input.key === 'Escape'
}

/**
 * Attach Escape while the list single-edit slide is open. Detach on close and unmount.
 * Caller must use capture so QDialog escape-key never sees the keydown (no sticky shake).
 */
export function bindFaProjectMediaSingleEditSlideEscape (
  input: I_bindFaProjectMediaSingleEditSlideEscapeInput
): void {
  function onSingleEditSlideKeydown (event: I_dialogProjectMediaSingleEditKeydownEvent): void {
    if (!shouldStopFaProjectMediaSingleEditSlideEscapePropagation({
      isSlideOpen: input.isSlideOpen.value,
      key: event.key
    })) {
      return
    }
    event.preventDefault()
    event.stopPropagation()
    const isFieldActive = input.isSlideFieldActive(event.target)
    if (shouldBlurFaProjectMediaSingleEditSlideFieldOnEscape({
      isFieldActive,
      isSlideOpen: input.isSlideOpen.value,
      key: event.key
    })) {
      input.blurActiveElement()
      return
    }
    if (!shouldCloseFaProjectMediaSingleEditSlideOnEscape({
      isDirty: input.isDirty.value,
      isFieldActive,
      isSlideOpen: input.isSlideOpen.value,
      key: event.key
    })) {
      return
    }
    input.closeSlide()
  }
  input.watch(() => input.isSlideOpen.value, () => {
    if (input.isSlideOpen.value) {
      input.attachWindowKeydown(onSingleEditSlideKeydown)
      return
    }
    input.detachWindowKeydown(onSingleEditSlideKeydown)
  })
  input.onBeforeUnmount(() => {
    input.detachWindowKeydown(onSingleEditSlideKeydown)
  })
}
