/** @vitest-environment jsdom */
import { mount } from '@vue/test-utils'
import { expect, test, vi } from 'vitest'

import ProjectOverviewChartPanel from '../ProjectOverviewChartPanel.vue'

/**
 * ProjectOverviewChartPanel
 * Renders document count label and graph parent locator.
 */
test('Test that ProjectOverviewChartPanel renders document count label', () => {
  const wrapper = mount(ProjectOverviewChartPanel, {
    global: {
      mocks: {
        $t: (key: string) => key
      },
      stubs: {
        apexchart: true,
        FaHelpTooltipIcon: {
          template: '<span data-test-locator="projectOverview-worldLegendHelpIcon"><slot /></span>'
        },
        'q-card': { template: '<div><slot /></div>' },
        'q-card-section': { template: '<div><slot /></div>' },
        'q-inner-loading': true,
        'q-tooltip': { template: '<div><slot /></div>' }
      }
    },
    props: {
      chartHeightPx: 445,
      chartLoading: false,
      chartOptions: {},
      chartSeries: [{
        color: '#ff0000',
        data: [1, 2],
        name: 'World'
      }],
      emptyCtaMode: 'createTemplate',
      fullsize: true,
      graphCardWidthPx: 1386,
      onEmptyCtaClick: vi.fn(),
      showEmptyCta: false,
      totalDocumentCount: 3
    }
  })

  expect(wrapper.find('[data-test-locator=projectOverview-graphParent]').exists()).toBe(true)
  expect(wrapper.find('[data-test-locator=projectOverview-graphScroll]').exists()).toBe(true)
  expect(wrapper.find('[data-test-locator=projectOverview-docCountLabel]').text()).toContain(
    'projectUI.projectOverview.documentDistributionTitlePrefix'
  )
  expect(wrapper.find('[data-test-locator=projectOverview-docCountLabel]').text()).toContain('3')
  expect(wrapper.find('[data-test-locator=projectOverview-worldLegendHelpIcon]').exists()).toBe(true)

  wrapper.unmount()
})

/**
 * ProjectOverviewChartPanel
 * Empty CTA: welcome + outline button inside the graph card.
 */
test('Test that ProjectOverviewChartPanel renders empty CTA welcome and outline button', async () => {
  const onEmptyCtaClick = vi.fn()
  const wrapper = mount(ProjectOverviewChartPanel, {
    global: {
      mocks: {
        $t: (key: string) => key
      },
      stubs: {
        apexchart: true,
        FaHelpTooltipIcon: true,
        'q-btn': {
          template: '<button @click="$attrs.onClick"><slot />{{ $attrs.label }}</button>'
        },
        'q-card': { template: '<div><slot /></div>' },
        'q-card-section': { template: '<div><slot /></div>' },
        'q-inner-loading': true
      }
    },
    props: {
      chartHeightPx: 445,
      chartLoading: false,
      chartOptions: {},
      chartSeries: [],
      emptyCtaMode: 'createTemplate',
      fullsize: true,
      graphCardWidthPx: 1386,
      onEmptyCtaClick,
      showEmptyCta: true,
      totalDocumentCount: 0
    }
  })

  expect(wrapper.find('[data-test-locator=projectOverview-emptyCta]').exists()).toBe(true)
  expect(wrapper.find('[data-test-locator=projectOverview-emptyCtaWelcome]').text()).toBe(
    'projectUI.projectOverview.emptyCtaWelcome'
  )
  expect(wrapper.find('[data-test-locator=projectOverview-docCountLabel]').exists()).toBe(false)
  expect(wrapper.find('[data-test-locator=projectOverview-emptyCtaButton]').text()).toContain(
    'projectUI.projectOverview.emptyCtaCreateDocumentTemplate'
  )
  expect(wrapper.find('.projectOverview__graphCard--emptyCta').exists()).toBe(true)
  expect(wrapper.find('.projectOverview__graphCard').attributes('style') ?? '').not.toContain('width:')
  await wrapper.find('[data-test-locator=projectOverview-emptyCtaButton]').trigger('click')
  expect(onEmptyCtaClick).toHaveBeenCalledTimes(1)

  wrapper.unmount()
})

/**
 * ProjectOverviewChartPanel
 * Empty CTA label switches for assignTemplate and createDocument modes.
 */
test('Test that ProjectOverviewChartPanel empty CTA labels follow emptyCtaMode', () => {
  const mountEmpty = (emptyCtaMode: 'assignTemplate' | 'createDocument') => {
    return mount(ProjectOverviewChartPanel, {
      global: {
        mocks: {
          $t: (key: string) => key
        },
        stubs: {
          apexchart: true,
          FaHelpTooltipIcon: true,
          'q-btn': {
            template: '<button>{{ $attrs.label }}</button>'
          },
          'q-card': { template: '<div><slot /></div>' },
          'q-card-section': { template: '<div><slot /></div>' },
          'q-inner-loading': true
        }
      },
      props: {
        chartHeightPx: 445,
        chartLoading: false,
        chartOptions: {},
        chartSeries: [],
        emptyCtaMode,
        fullsize: false,
        graphCardWidthPx: 900,
        onEmptyCtaClick: vi.fn(),
        showEmptyCta: true,
        totalDocumentCount: 0
      }
    })
  }

  const assignWrapper = mountEmpty('assignTemplate')
  expect(assignWrapper.find('[data-test-locator=projectOverview-emptyCtaButton]').text()).toContain(
    'projectUI.projectOverview.emptyCtaAssignTemplate'
  )
  assignWrapper.unmount()

  const createDocWrapper = mountEmpty('createDocument')
  expect(createDocWrapper.find('[data-test-locator=projectOverview-emptyCtaButton]').text()).toContain(
    'projectUI.projectOverview.emptyCtaCreateDocument'
  )
  createDocWrapper.unmount()
})

/**
 * ProjectOverviewChartPanel
 * Loading state hides Apex; empty series skips world-legend help; width applies when not empty.
 */
test('Test that ProjectOverviewChartPanel covers loading legend and chart option branches', () => {
  const loadingWrapper = mount(ProjectOverviewChartPanel, {
    global: {
      mocks: {
        $t: (key: string) => key
      },
      stubs: {
        apexchart: {
          template: '<div data-test-locator="apexchart-stub" />'
        },
        FaHelpTooltipIcon: {
          template: '<span data-test-locator="projectOverview-worldLegendHelpIcon"><slot /></span>'
        },
        'q-card': { template: '<div><slot /></div>' },
        'q-card-section': { template: '<div><slot /></div>' },
        'q-inner-loading': {
          props: {
            showing: {
              type: Boolean,
              default: false
            }
          },
          template: '<div v-if="showing" data-test-locator="inner-loading" />'
        },
        'q-tooltip': { template: '<div><slot /></div>' }
      }
    },
    props: {
      chartHeightPx: 400,
      chartLoading: true,
      chartOptions: {
        chart: null
      },
      chartSeries: [],
      emptyCtaMode: 'createTemplate',
      fullsize: false,
      graphCardWidthPx: 1200,
      onEmptyCtaClick: vi.fn(),
      showEmptyCta: false,
      totalDocumentCount: 2
    }
  })

  expect(loadingWrapper.find('[data-test-locator=inner-loading]').exists()).toBe(true)
  expect(loadingWrapper.find('[data-test-locator=apexchart-stub]').exists()).toBe(false)
  expect(loadingWrapper.find('[data-test-locator=projectOverview-worldLegendHelpIcon]').exists()).toBe(false)
  expect(loadingWrapper.find('.projectOverview__graphCard').attributes('style') ?? '').toContain('width: 1200px')
  loadingWrapper.unmount()

  const legendWrapper = mount(ProjectOverviewChartPanel, {
    global: {
      mocks: {
        $t: (key: string) => key
      },
      stubs: {
        apexchart: {
          template: '<div data-test-locator="apexchart-stub" />'
        },
        FaHelpTooltipIcon: {
          template: '<span data-test-locator="projectOverview-worldLegendHelpIcon"><slot /></span>'
        },
        'q-card': { template: '<div><slot /></div>' },
        'q-card-section': { template: '<div><slot /></div>' },
        'q-inner-loading': true,
        'q-tooltip': { template: '<div><slot /></div>' }
      }
    },
    props: {
      chartHeightPx: 400,
      chartLoading: false,
      chartOptions: {
        chart: {
          animations: false
        }
      },
      chartSeries: [{
        color: '#ff0000',
        data: [1, 2],
        name: 'World'
      }],
      emptyCtaMode: 'createTemplate',
      fullsize: true,
      graphCardWidthPx: 1386,
      onEmptyCtaClick: vi.fn(),
      showEmptyCta: false,
      totalDocumentCount: 3
    }
  })

  expect(legendWrapper.find('[data-test-locator=apexchart-stub]').exists()).toBe(true)
  expect(legendWrapper.find('[data-test-locator=projectOverview-worldLegendHelpIcon]').exists()).toBe(true)
  expect(legendWrapper.find('[data-test-locator=projectOverview-worldLegendCount]').text()).toBe('3')
  legendWrapper.unmount()
})
