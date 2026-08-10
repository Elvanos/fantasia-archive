/**
 * Drop Quasar QSelect activeClass (text-{color}) so selected option labels stay idle color.
 * Selection chrome is side bars in FaSelectInput menu SCSS — not brighter text.
 */
export function stripFaSelectInputOptionItemActiveClass <
  T extends Record<string, unknown>
> (itemProps: T): Omit<T, 'activeClass'> {
  const rest = { ...itemProps }
  delete rest.activeClass
  return rest as Omit<T, 'activeClass'>
}

type T_faSelectInputOptionItemClick = (evt: Event) => void

/**
 * Strip activeClass and wrap onClick so parents learn about option activation even when
 * Quasar skips update:modelValue for an already-selected single value.
 */
export function bindFaSelectInputOptionItemActivateProps <
  T extends Record<string, unknown>
> (
  itemProps: T,
  onActivate: () => void
): Omit<T, 'activeClass' | 'onClick'> & { onClick: T_faSelectInputOptionItemClick } {
  const withoutActiveClass = stripFaSelectInputOptionItemActiveClass(itemProps)
  const previousOnClick = withoutActiveClass.onClick
  const rest = { ...withoutActiveClass } as Record<string, unknown>
  delete rest.onClick

  function onClick (evt: Event): void {
    if (typeof previousOnClick === 'function') {
      (previousOnClick as T_faSelectInputOptionItemClick)(evt)
    }
    onActivate()
  }

  return {
    ...rest,
    onClick
  } as Omit<T, 'activeClass' | 'onClick'> & { onClick: T_faSelectInputOptionItemClick }
}
