import { expect, test, vi } from 'vitest'

import {
  attachProjectOverviewApexTooltipAboveBarEvents,
  createProjectOverviewApexTooltipAboveBarChartEvents
} from '../projectOverviewApexTooltipAboveBarWiring'

/**
 * attachProjectOverviewApexTooltipAboveBarEvents
 * Merges mouse events onto chart.options.chart.events.
 */
test('Test that attachProjectOverviewApexTooltipAboveBarEvents merges chart mouse events', () => {
  const attached = attachProjectOverviewApexTooltipAboveBarEvents({
    chart: {
      type: 'bar',
      events: {
        mounted: () => undefined
      }
    },
    colors: ['#111']
  })

  const chart = attached.chart as {
    events: {
      dataPointMouseEnter: (event: Event) => void
      dataPointMouseLeave: (event: Event) => void
      mounted: () => void
      mouseMove: (event: Event) => void
    }
    type: string
  }

  expect(chart.type).toBe('bar')
  expect(typeof chart.events.mounted).toBe('function')
  expect(typeof chart.events.dataPointMouseEnter).toBe('function')
  expect(typeof chart.events.dataPointMouseLeave).toBe('function')
  expect(typeof chart.events.mouseMove).toBe('function')
  expect(attached.colors).toEqual(['#111'])
})

/**
 * createProjectOverviewApexTooltipAboveBarChartEvents
 * Ignores non-bar targets without throwing.
 */
test('Test that createProjectOverviewApexTooltipAboveBarChartEvents ignores non-bar targets', () => {
  const frameId = 1
  const frameTime = 0
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    callback(frameTime)
    return frameId
  })

  const events = createProjectOverviewApexTooltipAboveBarChartEvents()
  expect(() => {
    events.mouseMove({
      target: document.createElement('div')
    } as unknown as Event)
  }).not.toThrow()

  vi.unstubAllGlobals()
})

/**
 * createProjectOverviewApexTooltipAboveBarChartEvents
 * Pins tip with CSS variables so Apex inline left/top cannot win.
 */
test('Test that createProjectOverviewApexTooltipAboveBarChartEvents pins tip with css vars', () => {
  const frameId = 1
  const frameTime = 0
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    callback(frameTime)
    return frameId
  })

  const canvas = document.createElement('div')
  canvas.className = 'apexcharts-canvas'
  canvas.getBoundingClientRect = () => ({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    bottom: 400,
    right: 500,
    width: 500,
    height: 400,
    toJSON: () => ({})
  })

  const bar = document.createElement('path')
  bar.className = 'apexcharts-bar-area'
  bar.getBoundingClientRect = () => ({
    x: 200,
    y: 120,
    top: 120,
    left: 200,
    bottom: 160,
    right: 220,
    width: 20,
    height: 40,
    toJSON: () => ({})
  })

  const tooltip = document.createElement('div')
  tooltip.className = 'apexcharts-tooltip projectOverview__apexTooltip apexcharts-active'
  Object.defineProperty(tooltip, 'offsetWidth', {
    configurable: true,
    value: 100
  })
  Object.defineProperty(tooltip, 'offsetHeight', {
    configurable: true,
    value: 50
  })

  canvas.appendChild(bar)
  canvas.appendChild(tooltip)
  document.body.appendChild(canvas)

  const events = createProjectOverviewApexTooltipAboveBarChartEvents()
  events.dataPointMouseEnter({ target: bar } as unknown as Event)

  expect(tooltip.classList.contains('projectOverview__apexTooltip--anchored')).toBe(true)
  expect(tooltip.style.getPropertyValue('--fa-po-tt-left')).toBe('160px')
  expect(tooltip.style.getPropertyValue('--fa-po-tt-top')).toBe('64px')

  canvas.remove()
  vi.unstubAllGlobals()
})

/**
 * createProjectOverviewApexTooltipAboveBarChartEvents
 * Apex may call dataPointMouseLeave without a DOM Event — must not throw.
 */
test('Test that createProjectOverviewApexTooltipAboveBarChartEvents handles leave without event', () => {
  const frameId = 1
  const frameTime = 0
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    callback(frameTime)
    return frameId
  })

  const canvas = document.createElement('div')
  canvas.className = 'apexcharts-canvas'
  canvas.getBoundingClientRect = () => ({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    bottom: 400,
    right: 500,
    width: 500,
    height: 400,
    toJSON: () => ({})
  })

  const bar = document.createElement('path')
  bar.className = 'apexcharts-bar-area'
  bar.getBoundingClientRect = () => ({
    x: 200,
    y: 120,
    top: 120,
    left: 200,
    bottom: 160,
    right: 220,
    width: 20,
    height: 40,
    toJSON: () => ({})
  })

  const tooltip = document.createElement('div')
  tooltip.className = 'apexcharts-tooltip projectOverview__apexTooltip apexcharts-active projectOverview__apexTooltip--anchored'
  tooltip.style.setProperty('--fa-po-tt-left', '10px')
  tooltip.style.setProperty('--fa-po-tt-top', '20px')
  Object.defineProperty(tooltip, 'offsetWidth', {
    configurable: true,
    value: 100
  })
  Object.defineProperty(tooltip, 'offsetHeight', {
    configurable: true,
    value: 50
  })

  canvas.appendChild(bar)
  canvas.appendChild(tooltip)
  document.body.appendChild(canvas)

  const events = createProjectOverviewApexTooltipAboveBarChartEvents()
  events.dataPointMouseEnter({ target: bar } as unknown as Event)
  expect(() => {
    events.dataPointMouseLeave(undefined)
    events.dataPointMouseLeave(null)
  }).not.toThrow()
  expect(tooltip.classList.contains('projectOverview__apexTooltip--anchored')).toBe(false)

  canvas.remove()
  vi.unstubAllGlobals()
})

/**
 * attachProjectOverviewApexTooltipAboveBarEvents
 * Accepts options without an existing chart.events object.
 */
test('Test that attachProjectOverviewApexTooltipAboveBarEvents seeds chart events when missing', () => {
  const attached = attachProjectOverviewApexTooltipAboveBarEvents({
    colors: ['#abc']
  })
  const chart = attached.chart as {
    events: {
      dataPointMouseEnter: (event?: Event | null) => void
      dataPointMouseLeave: (event?: Event | null) => void
      mouseMove: (event?: Event | null) => void
    }
  }
  expect(typeof chart.events.dataPointMouseEnter).toBe('function')
  expect(typeof chart.events.mouseMove).toBe('function')
  expect(() => {
    chart.events.dataPointMouseEnter(null)
    chart.events.mouseMove(undefined)
    chart.events.dataPointMouseLeave(null)
  }).not.toThrow()
})

/**
 * createProjectOverviewApexTooltipAboveBarChartEvents
 * Resolves bars via closest(), stacked j segments, and no-j bars.
 */
test('Test that createProjectOverviewApexTooltipAboveBarChartEvents covers hover edge paths', () => {
  const frameId = 1
  const frameTime = 0
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    callback(frameTime)
    return frameId
  })

  const canvas = document.createElement('div')
  canvas.className = 'apexcharts-canvas'
  canvas.getBoundingClientRect = () => ({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    bottom: 400,
    right: 500,
    width: 500,
    height: 400,
    toJSON: () => ({})
  })

  const barTop = document.createElement('path')
  barTop.className = 'apexcharts-bar-area'
  barTop.setAttribute('j', '0')
  barTop.getBoundingClientRect = () => ({
    x: 200,
    y: 40,
    top: 40,
    left: 200,
    bottom: 80,
    right: 220,
    width: 20,
    height: 40,
    toJSON: () => ({})
  })

  const barBottom = document.createElement('path')
  barBottom.className = 'apexcharts-bar-area'
  barBottom.setAttribute('j', '0')
  barBottom.getBoundingClientRect = () => ({
    x: 200,
    y: 80,
    top: 80,
    left: 200,
    bottom: 160,
    right: 220,
    width: 20,
    height: 80,
    toJSON: () => ({})
  })

  const barChild = document.createElement('span')
  barTop.appendChild(barChild)

  const tooltip = document.createElement('div')
  tooltip.className = 'apexcharts-tooltip projectOverview__apexTooltip'
  Object.defineProperty(tooltip, 'offsetWidth', {
    configurable: true,
    value: 100
  })
  Object.defineProperty(tooltip, 'offsetHeight', {
    configurable: true,
    value: 50
  })

  canvas.appendChild(barTop)
  canvas.appendChild(barBottom)
  canvas.appendChild(tooltip)
  document.body.appendChild(canvas)

  const events = createProjectOverviewApexTooltipAboveBarChartEvents()
  events.mouseMove({ target: barChild } as unknown as Event)
  expect(tooltip.classList.contains('projectOverview__apexTooltip--anchored')).toBe(true)
  expect(tooltip.dataset.placement).toBe('top')

  Object.defineProperty(tooltip, 'offsetWidth', {
    configurable: true,
    value: 0
  })
  events.mouseMove({ target: barTop } as unknown as Event)

  events.dataPointMouseLeave({ target: barTop } as unknown as Event)
  expect(tooltip.classList.contains('projectOverview__apexTooltip--anchored')).toBe(false)

  const bareCanvas = document.createElement('div')
  bareCanvas.className = 'apexcharts-canvas'
  const bareBar = document.createElement('path')
  bareBar.className = 'apexcharts-bar-area'
  bareCanvas.appendChild(bareBar)
  document.body.appendChild(bareCanvas)
  events.mouseMove({ target: bareBar } as unknown as Event)

  const noJBar = document.createElement('path')
  noJBar.className = 'apexcharts-bar-area'
  noJBar.getBoundingClientRect = () => ({
    x: 10,
    y: 10,
    top: 10,
    left: 10,
    bottom: 20,
    right: 20,
    width: 10,
    height: 10,
    toJSON: () => ({})
  })
  const noJCanvas = document.createElement('div')
  noJCanvas.className = 'apexcharts-canvas'
  noJCanvas.getBoundingClientRect = canvas.getBoundingClientRect
  const noJTooltip = document.createElement('div')
  noJTooltip.className = 'apexcharts-tooltip projectOverview__apexTooltip'
  Object.defineProperty(noJTooltip, 'offsetWidth', {
    configurable: true,
    value: 40
  })
  Object.defineProperty(noJTooltip, 'offsetHeight', {
    configurable: true,
    value: 20
  })
  noJCanvas.appendChild(noJBar)
  noJCanvas.appendChild(noJTooltip)
  document.body.appendChild(noJCanvas)
  events.mouseMove({ target: noJBar } as unknown as Event)
  expect(noJTooltip.classList.contains('projectOverview__apexTooltip--anchored')).toBe(true)

  canvas.remove()
  bareCanvas.remove()
  noJCanvas.remove()
  vi.unstubAllGlobals()
})

/**
 * createProjectOverviewApexTooltipAboveBarChartEvents
 * Skips anchor when canvas is not an HTMLElement, tip missing, or rAF runs after leave.
 */
test('Test that createProjectOverviewApexTooltipAboveBarChartEvents skips invalid canvas tip and stale rAF', () => {
  const frameCallbacks: FrameRequestCallback[] = []
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    frameCallbacks.push(callback)
    return frameCallbacks.length
  })

  const svgCanvas = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svgCanvas.setAttribute('class', 'apexcharts-canvas')
  const svgBar = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  svgBar.setAttribute('class', 'apexcharts-bar-area')
  svgCanvas.appendChild(svgBar)
  document.body.appendChild(svgCanvas)

  const events = createProjectOverviewApexTooltipAboveBarChartEvents()
  events.mouseMove({ target: svgBar } as unknown as Event)
  expect(frameCallbacks.length).toBe(1)
  frameCallbacks[0]!(0)

  const canvas = document.createElement('div')
  canvas.className = 'apexcharts-canvas'
  canvas.getBoundingClientRect = () => ({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    bottom: 100,
    right: 100,
    width: 100,
    height: 100,
    toJSON: () => ({})
  })
  const bar = document.createElement('path')
  bar.className = 'apexcharts-bar-area'
  bar.getBoundingClientRect = () => ({
    x: 10,
    y: 10,
    top: 10,
    left: 10,
    bottom: 20,
    right: 20,
    width: 10,
    height: 10,
    toJSON: () => ({})
  })
  canvas.appendChild(bar)
  document.body.appendChild(canvas)
  events.mouseMove({ target: bar } as unknown as Event)
  expect(frameCallbacks.length).toBe(2)
  frameCallbacks[1]!(0)

  const tipCanvas = document.createElement('div')
  tipCanvas.className = 'apexcharts-canvas'
  tipCanvas.getBoundingClientRect = canvas.getBoundingClientRect
  const tipBar = document.createElement('path')
  tipBar.className = 'apexcharts-bar-area'
  tipBar.getBoundingClientRect = bar.getBoundingClientRect
  const svgTip = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  svgTip.setAttribute('class', 'apexcharts-tooltip projectOverview__apexTooltip')
  tipCanvas.appendChild(tipBar)
  tipCanvas.appendChild(svgTip)
  document.body.appendChild(tipCanvas)
  events.mouseMove({ target: tipBar } as unknown as Event)
  frameCallbacks[2]!(0)

  const staleCanvas = document.createElement('div')
  staleCanvas.className = 'apexcharts-canvas'
  staleCanvas.getBoundingClientRect = canvas.getBoundingClientRect
  const staleBar = document.createElement('path')
  staleBar.className = 'apexcharts-bar-area'
  staleBar.getBoundingClientRect = bar.getBoundingClientRect
  const staleTip = document.createElement('div')
  staleTip.className = 'apexcharts-tooltip projectOverview__apexTooltip'
  Object.defineProperty(staleTip, 'offsetWidth', {
    configurable: true,
    value: 40
  })
  Object.defineProperty(staleTip, 'offsetHeight', {
    configurable: true,
    value: 20
  })
  staleCanvas.appendChild(staleBar)
  staleCanvas.appendChild(staleTip)
  document.body.appendChild(staleCanvas)
  events.mouseMove({ target: staleBar } as unknown as Event)
  events.dataPointMouseLeave({ target: staleBar } as unknown as Event)
  frameCallbacks[3]!(0)
  expect(staleTip.classList.contains('projectOverview__apexTooltip--anchored')).toBe(false)

  const orphanBar = document.createElement('path')
  orphanBar.className = 'apexcharts-bar-area'
  document.body.appendChild(orphanBar)
  events.dataPointMouseLeave({ target: orphanBar } as unknown as Event)

  const infiniteBar = document.createElement('path')
  infiniteBar.className = 'apexcharts-bar-area'
  infiniteBar.getBoundingClientRect = () => ({
    x: Number.POSITIVE_INFINITY,
    y: Number.POSITIVE_INFINITY,
    top: Number.POSITIVE_INFINITY,
    left: Number.POSITIVE_INFINITY,
    bottom: Number.POSITIVE_INFINITY,
    right: Number.POSITIVE_INFINITY,
    width: Number.NaN,
    height: Number.NaN,
    toJSON: () => ({})
  })
  const infiniteCanvas = document.createElement('div')
  infiniteCanvas.className = 'apexcharts-canvas'
  infiniteCanvas.getBoundingClientRect = canvas.getBoundingClientRect
  const infiniteTip = document.createElement('div')
  infiniteTip.className = 'apexcharts-tooltip projectOverview__apexTooltip'
  Object.defineProperty(infiniteTip, 'offsetWidth', {
    configurable: true,
    value: 40
  })
  Object.defineProperty(infiniteTip, 'offsetHeight', {
    configurable: true,
    value: 20
  })
  infiniteCanvas.appendChild(infiniteBar)
  infiniteCanvas.appendChild(infiniteTip)
  document.body.appendChild(infiniteCanvas)
  events.mouseMove({ target: infiniteBar } as unknown as Event)
  frameCallbacks[frameCallbacks.length - 1]!(0)

  svgCanvas.remove()
  canvas.remove()
  tipCanvas.remove()
  staleCanvas.remove()
  orphanBar.remove()
  infiniteCanvas.remove()
  vi.unstubAllGlobals()
})
