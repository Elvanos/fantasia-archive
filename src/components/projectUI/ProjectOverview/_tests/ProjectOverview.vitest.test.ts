import { mount } from '@vue/test-utils'
import { beforeEach, expect, test, vi } from 'vitest'

const pickRandomTipCaptionMock = vi.hoisted(() => {
  return vi.fn(() => 'Fixture tip text.')
})

const {
  chartLoadingRef,
  emptyCtaModeRef,
  lastOpenedItemsRef,
  showContentRowRef,
  showEmptyCtaRef,
  showMascotInTipCardRef,
  showTipCardRef,
  totalDocumentCountRef
} = vi.hoisted(() => {
  const { ref } = require('vue') as typeof import('vue')
  return {
    chartLoadingRef: ref(false),
    emptyCtaModeRef: ref('createDocument' as const),
    lastOpenedItemsRef: ref([] as Array<{ documentId: string }>),
    showContentRowRef: ref(false),
    showEmptyCtaRef: ref(true),
    showMascotInTipCardRef: ref(true),
    showTipCardRef: ref(false),
    totalDocumentCountRef: ref(0)
  }
})

const onEmptyCtaClickMock = vi.hoisted(() => vi.fn())

vi.mock('../scripts/projectOverview_manager', () => {
  return {
    useProjectOverview: () => {
      return {
        chartHeightPx: 445,
        chartLoading: chartLoadingRef.value,
        chartOptions: {},
        chartSeries: [],
        emptyCtaMode: emptyCtaModeRef.value,
        graphCardHeightPx: 587,
        graphCardWidthPx: 1386,
        lastOpenedItems: lastOpenedItemsRef.value,
        onEmptyCtaClick: onEmptyCtaClickMock,
        onLastOpenedContextAddUnder: vi.fn(),
        onLastOpenedContextCopyBackgroundColor: vi.fn(),
        onLastOpenedContextCopyDocument: vi.fn(),
        onLastOpenedContextCopyName: vi.fn(),
        onLastOpenedContextCopyTextColor: vi.fn(),
        onLastOpenedContextDelete: vi.fn(),
        onLastOpenedContextEdit: vi.fn(),
        onLastOpenedContextOpen: vi.fn(),
        onLastOpenedRowAuxClick: vi.fn(),
        onLastOpenedRowClick: vi.fn(),
        projectDisplayName: 'Fixture Project',
        randomTipCaption: pickRandomTipCaptionMock(),
        resolveLastOpenedItemChromeStyle: () => undefined,
        resolveLastOpenedWorldIndicatorColor: () => null,
        showContentRow: showContentRowRef.value,
        showEmptyCta: showEmptyCtaRef.value,
        showMascotInTipCard: showMascotInTipCardRef.value,
        showTipCard: showTipCardRef.value,
        showWorldIndicators: false,
        totalDocumentCount: totalDocumentCountRef.value
      }
    }
  }
})

vi.mock('app/src/components/elements/FantasiaMascotImage/FantasiaMascotImage.vue', () => {
  return {
    default: {
      name: 'FantasiaMascotImageStub',
      props: ['fantasiaImage'],
      template: '<div data-test-locator="fantasiaMascotImage-stub" />'
    }
  }
})

vi.mock('../ProjectOverviewChartPanel.vue', () => {
  return {
    default: {
      name: 'ProjectOverviewChartPanelStub',
      props: [
        'emptyCtaMode',
        'showEmptyCta',
        'onEmptyCtaClick',
        'totalDocumentCount'
      ],
      template: `
        <div data-test-locator="projectOverview-graphParent">
          <div
            v-if="showEmptyCta"
            data-test-locator="projectOverview-emptyCta"
          >
            <p data-test-locator="projectOverview-emptyCtaWelcome">
              projectUI.projectOverview.emptyCtaWelcome
            </p>
            <button
              data-test-locator="projectOverview-emptyCtaButton"
              @click="onEmptyCtaClick"
            >
              {{ emptyCtaMode === 'createDocument'
                ? 'projectUI.projectOverview.emptyCtaCreateDocument'
                : emptyCtaMode === 'assignTemplate'
                  ? 'projectUI.projectOverview.emptyCtaAssignTemplate'
                  : 'projectUI.projectOverview.emptyCtaCreateDocumentTemplate' }}
            </button>
          </div>
        </div>
      `
    }
  }
})

vi.mock('../ProjectOverviewLastOpenedList.vue', () => {
  return {
    default: {
      name: 'ProjectOverviewLastOpenedListStub',
      template: '<div data-test-locator="projectOverview-lastOpened" />'
    }
  }
})

import ProjectOverview from '../ProjectOverview.vue'

const mountGlobal = {
  mocks: {
    $t: (key: string) => key
  }
}

beforeEach(() => {
  showTipCardRef.value = false
  showMascotInTipCardRef.value = true
  showEmptyCtaRef.value = true
  showContentRowRef.value = false
  emptyCtaModeRef.value = 'createDocument'
  lastOpenedItemsRef.value = []
  totalDocumentCountRef.value = 0
  chartLoadingRef.value = false
  onEmptyCtaClickMock.mockClear()
})

/**
 * ProjectOverview
 * Keeps overview chrome and shows empty CTA inside the graph card.
 */
test('Test that ProjectOverview renders subtitle, project name, and empty CTA', () => {
  const wrapper = mount(ProjectOverview, {
    global: mountGlobal
  })

  expect(wrapper.find('[data-test-locator=projectOverview-subtitle]').text()).toBe(
    'projectUI.projectOverview.projectOverviewFor'
  )
  expect(wrapper.find('[data-test-locator=projectOverview-projectName]').text()).toBe(
    'Fixture Project'
  )
  expect(wrapper.find('[data-test-locator=projectOverview-tipCard]').exists()).toBe(false)
  expect(wrapper.find('[data-test-locator=projectOverview-graphParent]').exists()).toBe(true)
  expect(wrapper.find('[data-test-locator=projectOverview-emptyCta]').exists()).toBe(true)
  expect(wrapper.find('[data-test-locator=projectOverview-emptyCtaWelcome]').exists()).toBe(true)
  expect(wrapper.find('[data-test-locator=projectOverview-emptyCtaButton]').text()).toContain(
    'projectUI.projectOverview.emptyCtaCreateDocument'
  )
  expect(wrapper.find('[data-test-locator=projectOverview-content]').classes()).toContain(
    'projectOverview__content--emptyCta'
  )

  wrapper.unmount()
})

/**
 * ProjectOverview
 * Shows tip card when showTipCard is true and documents exist.
 */
test('Test that ProjectOverview renders tip card when showTipCard is true', () => {
  showTipCardRef.value = true
  showEmptyCtaRef.value = false
  showContentRowRef.value = true

  const wrapper = mount(ProjectOverview, {
    global: mountGlobal
  })

  expect(wrapper.find('[data-test-locator=projectOverview-tipCard]').exists()).toBe(true)
  expect(wrapper.find('[data-test-locator=projectOverview-tipHeading]').text()).toBe(
    'globalFunctionality.unsortedAppTexts.didYouKnow'
  )
  expect(wrapper.find('[data-test-locator=projectOverview-tipMessage]').text()).toBe(
    'Fixture tip text.'
  )
  expect(wrapper.find('[data-test-locator=fantasiaMascotImage-stub]').exists()).toBe(true)

  wrapper.unmount()
})

/**
 * ProjectOverview
 * Tip card hides mascot when showMascotInTipCard is false.
 */
test('Test that ProjectOverview hides tip mascot when showMascotInTipCard is false', () => {
  showTipCardRef.value = true
  showEmptyCtaRef.value = false
  showContentRowRef.value = true
  showMascotInTipCardRef.value = false

  const wrapper = mount(ProjectOverview, {
    global: mountGlobal
  })

  expect(wrapper.find('[data-test-locator=projectOverview-tipCard]').exists()).toBe(true)
  expect(wrapper.find('[data-test-locator=fantasiaMascotImage-stub]').exists()).toBe(false)

  wrapper.unmount()
})
