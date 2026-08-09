import { defineBoot } from '#q-app/wrappers'
import VueApexCharts from 'vue3-apexcharts'

/**
 * Registers the global ApexCharts Vue component as 'apexchart'.
 */
export default defineBoot(({ app }) => {
  // Library registers as single-word 'apexchart' (vue3-apexcharts convention).
  /* eslint-disable vue/multi-word-component-names, vue/component-definition-name-casing -- third-party tag name */
  app.component('apexchart', VueApexCharts)
  /* eslint-enable vue/multi-word-component-names, vue/component-definition-name-casing */
})
