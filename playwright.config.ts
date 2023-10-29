import { defineConfig } from '@playwright/test'

export default defineConfig({
  workers: 3,
  fullyParallel: false,
  testMatch: '**/*playwright.@(spec|test).?(c|m)[jt]s?(x)',
  reporter: [
    ['list'],
    ['json', { outputFile: 'test-results/test-results.json' }]
  ]
})
