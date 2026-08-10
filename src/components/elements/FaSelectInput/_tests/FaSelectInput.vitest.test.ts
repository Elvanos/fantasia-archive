/** @vitest-environment jsdom */
/* eslint-disable vue/one-component-per-file -- QSelect stubs colocated with mount helpers */
import { defineComponent, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { expect, test, vi } from 'vitest'

import FaSelectInput from '../FaSelectInput.vue'

const qSelectStubShowPopup = vi.fn()

const qSelectStub = defineComponent({
  name: 'QSelect',
  props: {
    modelValue: {
      type: [String, Array, Object],
      default: null
    },
    options: {
      type: Array,
      default: () => []
    },
    optionsSelectedClass: {
      type: String,
      default: undefined
    }
  },
  emits: ['update:modelValue', 'filter', 'focus', 'popup-show', 'new-value', 'keydown', 'keyup'],
  setup () {
    return {
      getOptionIndex: () => 0,
      showPopup: qSelectStubShowPopup
    }
  },
  computed: {
    selectedItemOpt () {
      const value = (this as { modelValue: unknown }).modelValue
      if (Array.isArray(value)) {
        return value[0]
      }
      return value
    },
    optionsSelectedClassProbe () {
      const value = (this as { optionsSelectedClass?: string }).optionsSelectedClass
      return value === undefined ? 'unset' : value === '' ? 'empty' : value
    }
  },
  template: `
    <div
      :data-test-locator="$attrs['data-test-locator']"
      :data-options-selected-class-probe="optionsSelectedClassProbe"
    >
      <button
        type="button"
        data-test-locator="faSelectInput-stub-select"
        @click="$emit('update:modelValue', 'test 1')"
      />
      <button
        type="button"
        data-test-locator="faSelectInput-stub-focus"
        @click="$emit('focus')"
      />
      <button
        type="button"
        data-test-locator="faSelectInput-stub-popup"
        @click="$emit('popup-show')"
      />
      <button
        type="button"
        data-test-locator="faSelectInput-stub-new"
        @click="$emit('new-value', 'brand new')"
      />
      <button
        type="button"
        data-test-locator="faSelectInput-stub-filter"
        @click="$emit('filter', 'e', (callbackFn, afterFn) => { callbackFn(); afterFn && afterFn({}) })"
      />
      <button
        type="button"
        data-test-locator="faSelectInput-stub-enter"
        @click="$emit('keydown', { key: 'Enter' })"
      />
      <button
        type="button"
        data-test-locator="faSelectInput-stub-tab"
        @click="$emit('keyup', { key: 'Tab' })"
      />
      <slot
        name="selected-item"
        :opt="selectedItemOpt"
        :index="0"
        :tabindex="0"
        :removeAtIndex="() => undefined"
      />
      <div
        v-for="(opt, index) in options"
        :key="index"
      >
        <slot
          name="option"
          :opt="opt"
          :index="index"
          :itemProps="{ activeClass: 'text-primary-bright', active: index === 0, onClick: () => undefined }"
          :selected="index === 0"
          :toggleOption="() => undefined"
        />
      </div>
    </div>
  `
})

function mountFaSelectInput (props: Record<string, unknown> = {}) {
  return mount(FaSelectInput, {
    global: {
      stubs: {
        QSelect: qSelectStub,
        QChip: {
          props: {
            removable: {
              type: Boolean,
              default: true
            }
          },
          emits: ['remove'],
          template: '<div class="q-chip-stub" :data-removable="removable ? \'true\' : \'false\'"><button v-if="removable" type="button" class="q-chip-remove" @click="$emit(\'remove\')"><slot /></button><template v-else><slot /></template></div>'
        },
        QIcon: {
          props: ['name'],
          inheritAttrs: false,
          template: '<i class="q-icon-stub" :class="$attrs.class" :data-name="name" :data-has-style="$attrs.style ? \'true\' : \'false\'" />'
        },
        QItem: {
          props: {
            activeClass: {
              type: String,
              default: undefined
            }
          },
          inheritAttrs: false,
          template: '<div class="q-item-stub" :class="$attrs.class" :data-test-locator="$attrs[\'data-test-locator\']" :data-test-locator-separator-alt="$attrs[\'data-test-locator-separator-alt\']" :data-active-class-probe="activeClass === undefined ? \'unset\' : activeClass === \'\' ? \'empty\' : activeClass" @click="typeof $attrs.onClick === \'function\' && $attrs.onClick($event)"><slot /></div>'
        },
        QItemSection: {
          template: '<div class="q-item-section-stub"><slot /></div>'
        },
        QItemLabel: {
          template: '<div class="q-item-label-stub"><slot /></div>'
        }
      }
    },
    props: {
      mode: 'simple',
      modelValue: '',
      options: ['test 1', 'test 2'],
      testLocator: 'faSelectInput-test',
      ...props
    }
  })
}

/**
 * FaSelectInput
 * Empty optionsSelectedClass + strip activeClass — selected label stays idle color.
 */
test('Test that FaSelectInput clears Quasar selected option text color class', () => {
  const wrapper = mountFaSelectInput()

  expect(
    wrapper.find('[data-test-locator="faSelectInput-test"]')
      .attributes('data-options-selected-class-probe')
  ).toBe('empty')
  expect(
    wrapper.find('.q-item-stub').attributes('data-active-class-probe')
  ).toBe('unset')
})

/**
 * FaSelectInput
 * option-activate fires on option row click even when Quasar would skip model update.
 */
test('Test that FaSelectInput emits option-activate when option row is clicked', async () => {
  const wrapper = mountFaSelectInput({
    modelValue: 'Venus',
    options: ['Venus', 'Earth']
  })

  await wrapper.get('.q-item-stub').trigger('click')
  expect(wrapper.emitted('option-activate')?.[0]).toEqual(['Venus'])
})

/**
 * FaSelectInput
 * Enter on focused option uses emitOptionActivate (same-value reselect path).
 */
test('Test that FaSelectInput emits option-activate on Enter keydown', async () => {
  const wrapper = mountFaSelectInput({
    modelValue: 'Venus',
    options: ['Venus', 'Earth']
  })

  await wrapper.get('[data-test-locator="faSelectInput-stub-popup"]').trigger('click')
  await wrapper.get('[data-test-locator="faSelectInput-stub-enter"]').trigger('click')
  expect(wrapper.emitted('option-activate')?.[0]).toEqual(['Venus'])
})

/**
 * FaSelectInput
 * Tab keyup opens Quasar popup via selectRef.showPopup.
 */
test('Test that FaSelectInput opens popup on Tab keyup', async () => {
  qSelectStubShowPopup.mockClear()
  const wrapper = mountFaSelectInput()

  await wrapper.get('[data-test-locator="faSelectInput-stub-tab"]').trigger('click')
  expect(qSelectStubShowPopup).toHaveBeenCalledTimes(1)
})

/**
 * FaSelectInput
 * Inline selection shows label for nonempty value and hides empty string.
 */
test('Test that FaSelectInput inline selection shows nonempty and hides empty', () => {
  const shown = mountFaSelectInput({
    modelValue: 'Venus',
    options: ['Venus'],
    selectionPresentation: 'inline'
  })
  expect(shown.find('[data-test-locator="faSelectInput-test-selected"]').exists()).toBe(true)
  expect(shown.find('[data-test-locator="faSelectInput-test-selected"]').text()).toContain('Venus')
  expect(shown.find('.q-chip-stub').exists()).toBe(false)

  const hidden = mountFaSelectInput({
    modelValue: '',
    options: ['Venus'],
    selectionPresentation: 'inline'
  })
  expect(hidden.find('[data-test-locator="faSelectInput-test-selected"]').exists()).toBe(false)
})

/**
 * FaSelectInput
 * Inline object selection renders icon + color glyph class beside the label.
 */
test('Test that FaSelectInput inline selection shows tinted object icon', () => {
  const wrapper = mountFaSelectInput({
    mode: 'document',
    modelValue: {
      color: '#ad3131',
      icon: 'mdi-earth',
      id: '1',
      name: 'Venus'
    },
    options: [{
      color: '#ad3131',
      icon: 'mdi-earth',
      id: '1',
      name: 'Venus'
    }],
    selectionPresentation: 'inline'
  })

  const selected = wrapper.get('[data-test-locator="faSelectInput-test-selected"]')
  expect(selected.text()).toContain('Venus')
  const icon = selected.get('.q-icon-stub')
  expect(icon.attributes('data-name')).toBe('mdi-earth')
  expect(icon.classes()).toContain('fa-color-glyph')
  expect(icon.attributes('data-has-style')).toBe('true')
})

/**
 * FaSelectInput
 * Object color token applies fa-color-glyph class and glyph style on option icon.
 */
test('Test that FaSelectInput applies color glyph class and style on tinted option', () => {
  const wrapper = mountFaSelectInput({
    mode: 'document',
    modelValue: {
      color: '#ad3131',
      icon: 'mdi-earth',
      id: '1',
      name: 'Venus'
    },
    options: [{
      color: '#ad3131',
      icon: 'mdi-earth',
      id: '1',
      name: 'Venus'
    }]
  })

  const icon = wrapper.get('.q-icon-stub')
  expect(icon.classes()).toContain('fa-color-glyph')
  expect(icon.attributes('data-has-style')).toBe('true')
})

/**
 * FaSelectInput
 * Filter optionMatch class still applies on the selected (active) option row.
 */
test('Test that FaSelectInput keeps filter optionMatch on selected option', async () => {
  const wrapper = mountFaSelectInput({
    modelValue: 'Venus',
    options: ['Venus', 'Earth']
  })

  await wrapper.get('[data-test-locator="faSelectInput-stub-filter"]').trigger('click')
  await nextTick()

  const selectedOption = wrapper.get('[data-test-locator="faSelectInput-test-option-0"]')
  expect(selectedOption.find('.faSelectInput__optionMatch').exists()).toBe(true)
  expect(selectedOption.find('.faSelectInput__optionMatch').text()).toBe('Venus')
})

/**
 * FaSelectInput
 * Empty single model hides selected chip (no ghost remove control).
 */
test('Test that FaSelectInput hides chip when single simple value is empty', () => {
  const wrapper = mountFaSelectInput({
    modelValue: ''
  })

  expect(wrapper.find('.q-chip-stub').exists()).toBe(false)
})

/**
 * FaSelectInput
 * Option list uses menu separatorAlt border before every row after the first.
 */
test('Test that FaSelectInput renders separatorAlt between dropdown options', () => {
  const wrapper = mountFaSelectInput({
    options: ['test 1', 'test 2', 'test 3']
  })

  expect(wrapper.find('[data-test-locator-separator-alt="faSelectInput-test-separatorAlt-0"]').exists())
    .toBe(false)
  expect(wrapper.find('[data-test-locator-separator-alt="faSelectInput-test-separatorAlt-1"]').exists())
    .toBe(true)
  expect(wrapper.find('[data-test-locator-separator-alt="faSelectInput-test-separatorAlt-2"]').exists())
    .toBe(true)
  expect(wrapper.get('[data-test-locator="faSelectInput-test-option-1"]')
    .classes())
    .toContain('faSelectInput__option--separatorAlt')
})

/**
 * FaSelectInput
 * Non-empty single model renders selected chip.
 */
test('Test that FaSelectInput shows chip when single simple value is set', () => {
  const wrapper = mountFaSelectInput({
    modelValue: 'test 1'
  })

  expect(wrapper.find('.q-chip-stub').exists()).toBe(true)
  expect(wrapper.find('.q-chip-stub').attributes('data-removable')).toBe('true')
})

/**
 * FaSelectInput
 * chipRemovable false keeps chip visual without remove control.
 */
test('Test that FaSelectInput hides chip remove when chipRemovable is false', () => {
  const wrapper = mountFaSelectInput({
    chipRemovable: false,
    modelValue: 'test 1'
  })

  expect(wrapper.find('.q-chip-stub').exists()).toBe(true)
  expect(wrapper.find('.q-chip-stub').attributes('data-removable')).toBe('false')
  expect(wrapper.find('.q-chip-remove').exists()).toBe(false)
})

/**
 * FaSelectInput
 * Chip remove invokes selected-item removeAtIndex.
 */
test('Test that FaSelectInput chip remove calls removeAtIndex', async () => {
  const removeAtIndex = vi.fn()
  const qSelectWithRemove = defineComponent({
    name: 'QSelect',
    props: {
      modelValue: {
        type: [String, Array, Object],
        default: null
      },
      options: {
        type: Array,
        default: () => []
      }
    },
    setup () {
      return { removeAtIndex }
    },
    template: `
      <div>
        <slot
          name="selected-item"
          :opt="modelValue"
          :index="0"
          :tabindex="0"
          :removeAtIndex="removeAtIndex"
        />
      </div>
    `
  })

  const wrapper = mount(FaSelectInput, {
    global: {
      stubs: {
        QSelect: qSelectWithRemove,
        QChip: {
          emits: ['remove'],
          template: '<div class="q-chip-stub"><button type="button" class="q-chip-remove" @click="$emit(\'remove\')" /></div>'
        },
        QIcon: true,
        QItem: true,
        QItemSection: true,
        QItemLabel: true,
        QSeparator: true
      }
    },
    props: {
      mode: 'simple',
      modelValue: 'test 1',
      options: ['test 1'],
      testLocator: 'faSelectInput-test'
    }
  })

  await wrapper.get('.q-chip-remove').trigger('click')
  expect(removeAtIndex).toHaveBeenCalledWith(0)
})

/**
 * FaSelectInput
 * Mounts with test locator and emits update on select stub click.
 */
test('Test that FaSelectInput emits update:modelValue from QSelect', async () => {
  const wrapper = mountFaSelectInput({
    modelValue: ''
  })

  await wrapper.get('[data-test-locator="faSelectInput-stub-select"]').trigger('click')
  expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['test 1'])
})

/**
 * FaSelectInput
 * Emits request-options on focus.
 */
test('Test that FaSelectInput emits request-options on focus', async () => {
  const wrapper = mountFaSelectInput()
  await wrapper.get('[data-test-locator="faSelectInput-stub-focus"]').trigger('click')
  expect(wrapper.emitted('request-options')).toBeTruthy()
})

/**
 * FaSelectInput
 * Create-new emits new-value when allowCreateNew is on.
 */
test('Test that FaSelectInput emits new-value when allowCreateNew is enabled', async () => {
  const wrapper = mountFaSelectInput({
    allowCreateNew: true,
    modelValue: [] as string[],
    multiple: true
  })

  await wrapper.get('[data-test-locator="faSelectInput-stub-new"]').trigger('click')
  await nextTick()
  expect(wrapper.emitted('new-value')?.[0]).toEqual(['brand new'])
})

/**
 * FaSelectInput
 * Document mode create-new uses manager UUID and renders icons / highlight segments.
 */
test('Test that FaSelectInput document mode create-new and option icons work', async () => {
  const uuidSpy = vi.spyOn(crypto, 'randomUUID').mockReturnValue(
    '11111111-1111-4111-8111-111111111111'
  )

  const wrapper = mountFaSelectInput({
    allowCreateNew: true,
    mode: 'document',
    modelValue: null,
    options: [
      {
        id: '1',
        name: 'Alpha Doc',
        icon: 'mdi-account'
      },
      {
        id: '2',
        name: 'Beta Doc'
      }
    ]
  })

  await wrapper.get('[data-test-locator="faSelectInput-stub-new"]').trigger('click')
  await nextTick()
  expect(uuidSpy).toHaveBeenCalled()
  expect(wrapper.emitted('new-value')?.[0]).toEqual([{
    id: '11111111-1111-4111-8111-111111111111',
    isNew: true,
    name: 'brand new'
  }])
  expect(wrapper.find('[data-test-locator="faSelectInput-test-option-0"]').exists()).toBe(true)
  expect(wrapper.find('.q-icon-stub').exists()).toBe(true)

  uuidSpy.mockRestore()
})

/**
 * FaSelectInput
 * Chip for object selection shows icon and teal for isNew.
 */
test('Test that FaSelectInput object chip shows icon and uses new chip color', () => {
  const wrapper = mountFaSelectInput({
    mode: 'document',
    modelValue: {
      id: '1',
      name: 'Doc',
      icon: 'mdi-file',
      isNew: true
    },
    options: [{
      id: '1',
      name: 'Doc',
      icon: 'mdi-file',
      isNew: true
    }]
  })

  expect(wrapper.find('.q-chip-stub').exists()).toBe(true)
  expect(wrapper.find('.q-icon-stub').exists()).toBe(true)
})

/**
 * FaSelectInput
 * Empty icon string on document option uses the shared file-outline placeholder.
 */
test('Test that FaSelectInput shows placeholder icon when document icon is empty', () => {
  const wrapper = mountFaSelectInput({
    mode: 'document',
    modelValue: {
      id: '1',
      name: 'Doc',
      icon: ''
    },
    options: [{
      id: '1',
      name: 'Doc',
      icon: ''
    }, {
      id: '2',
      name: 'Other'
    }]
  })

  expect(wrapper.find('.q-chip-stub').exists()).toBe(true)
  expect(wrapper.find('.q-icon-stub').exists()).toBe(true)
})

/**
 * FaSelectInput
 * Popup-show emits request-options.
 */
test('Test that FaSelectInput emits request-options on popup-show', async () => {
  const wrapper = mountFaSelectInput()
  await wrapper.get('[data-test-locator="faSelectInput-stub-popup"]').trigger('click')
  expect(wrapper.emitted('request-options')).toBeTruthy()
})

/**
 * FaSelectInput
 * Exposes clearIsNewFlags for object selections.
 */
test('Test that FaSelectInput expose clearIsNewFlags strips isNew on model', async () => {
  const wrapper = mountFaSelectInput({
    mode: 'document',
    modelValue: {
      id: '1',
      name: 'Doc',
      isNew: true
    },
    options: [{
      id: '1',
      name: 'Doc',
      isNew: true
    }]
  })

  const exposed = wrapper.vm as unknown as {
    clearIsNewFlags: (ids: readonly string[]) => void
  }
  exposed.clearIsNewFlags(['1'])
  await nextTick()
  expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([
    {
      id: '1',
      name: 'Doc'
    }
  ])
})
