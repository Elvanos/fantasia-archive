import { expect, test, vi } from 'vitest'

const bootMock = vi.hoisted(() => {
  return vi.fn((callback: unknown) => callback)
})

const vueApexChartsMock = vi.hoisted(() => {
  return { name: 'apexchart-stub' }
})

vi.mock('#q-app/wrappers', () => {
  return {
    defineBoot: bootMock
  }
})

vi.mock('vue3-apexcharts', () => {
  return {
    default: vueApexChartsMock
  }
})

import apexchartsBoot from '../apexcharts'

/**
 * apexcharts boot file
 * Registers the global apexchart component from vue3-apexcharts.
 */
test('Test that apexcharts boot registers the apexchart component on the app', () => {
  const appComponentMock = vi.fn()

  apexchartsBoot({
    app: {
      component: appComponentMock
    }
  } as never)

  expect(appComponentMock).toHaveBeenCalledOnce()
  expect(appComponentMock).toHaveBeenCalledWith('apexchart', vueApexChartsMock)
})
