import { expect, test } from 'vitest'

import {
  buildProjectOverviewApexChartTooltipHtml,
  escapeProjectOverviewApexTooltipCssColor,
  escapeProjectOverviewApexTooltipText
} from '../buildProjectOverviewApexChartTooltipHtml'

/**
 * escapeProjectOverviewApexTooltipText
 * Escapes HTML-sensitive characters in tooltip labels.
 */
test('Test that escapeProjectOverviewApexTooltipText escapes markup characters', () => {
  expect(escapeProjectOverviewApexTooltipText('A <b>"W"</b> & \'X\'')).toBe(
    'A &lt;b&gt;&quot;W&quot;&lt;/b&gt; &amp; &#39;X&#39;'
  )
})

/**
 * buildProjectOverviewApexChartTooltipHtml
 * Formats single-line world, template, and document count.
 */
test('Test that buildProjectOverviewApexChartTooltipHtml formats single-line tip', () => {
  const html = buildProjectOverviewApexChartTooltipHtml({
    categoryLabel: 'Characters',
    documentCount: 7,
    documentCountSeparator: ' - ',
    documentsLabelSuffix: ' documents',
    worldColor: '#ff0000',
    worldLabel: 'Earth'
  })
  expect(html).toContain('Earth, Characters')
  expect(html).toContain('class="projectOverview__graphTooltipSeparator">-</span>')
  expect(html).toContain('class="projectOverview__graphTooltipCountValue">7</span>')
  expect(html).toContain('class="projectOverview__graphTooltipDocumentsSuffix">documents</span>')
  expect(html).toContain('class="projectOverview__worldLegendSwatch"')
  expect(html).toContain('background-color: #ff0000')
  expect(html).not.toContain('projectOverview__graphTooltipCount">')
})

/**
 * buildProjectOverviewApexChartTooltipHtml
 * Omits the world swatch when the escaped color is empty.
 */
test('Test that buildProjectOverviewApexChartTooltipHtml omits swatch for blank world color', () => {
  const html = buildProjectOverviewApexChartTooltipHtml({
    categoryLabel: 'Places',
    documentCount: 1,
    documentCountSeparator: ' - ',
    documentsLabelSuffix: ' documents',
    worldColor: '',
    worldLabel: 'Void'
  })
  expect(html).toContain('Void, Places')
  expect(html).not.toContain('projectOverview__worldLegendSwatch')
})

/**
 * escapeProjectOverviewApexTooltipCssColor
 * Strips characters that could break out of an inline style value.
 */
test('Test that escapeProjectOverviewApexTooltipCssColor strips unsafe style characters', () => {
  expect(escapeProjectOverviewApexTooltipCssColor('#abc";color:red')).toBe('#abccolor:red')
})
