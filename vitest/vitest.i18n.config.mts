import path from 'path'
import { fileURLToPath } from 'url'

import { defineConfig } from 'vitest/config'

import {
  vitestCoverageBaseExclude,
  vitestCoverageSkipFull,
  vitestCoverageStrictThresholdsPerFile
} from './vitest.coverage.shared'
import { vitestTerminalReporters } from './vitest.reporters.shared'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')

/**
 * Node unit tests for repo-root i18n (vue-i18n message registry, specialCharacterFixer, externalFileLoader).
 * Colocate Vitest specs under i18n/_tests. This project does not use vitest.setup.ts so externalFileLoader stays real during coverage.
 * Enforces 95% v8 on scoped i18n TypeScript sources outside i18n/_tests (yarn test:coverage:i18n).
 * Include globs must contain a wildcard: Vitest 5 treats a pattern with no glob as a directory.
 */
export default defineConfig({
  resolve: {
    alias: {
      '#q-app/wrappers': path.resolve(
        repoRoot,
        'node_modules/@quasar/app-vite/exports/wrappers/wrappers.js'
      ),
      app: repoRoot,
      src: path.resolve(repoRoot, 'src'),
      'src-electron': path.resolve(repoRoot, 'src-electron')
    }
  },
  assetsInclude: ['**/*.md'],
  test: {
    name: 'unit-i18n',
    environment: 'node',
    clearMocks: false,
    include: ['i18n/**/*.vitest.test.ts'],
    reporters: [...vitestTerminalReporters],
    outputFile: 'test-results/vitest-report/test-results-vitest-i18n.json',
    globalSetup: [path.resolve(__dirname, 'vitest.coverageTmpSetup.mts')],
    coverage: {
      provider: 'v8',
      skipFull: vitestCoverageSkipFull,
      include: [
        '**/i18n/index.ts',
        '**/i18n/externalFileLoader.ts',
        '**/i18n/specialCharactersFixer.ts',
        '**/i18n/*/index.ts'
      ],
      exclude: [...vitestCoverageBaseExclude],
      thresholds: { ...vitestCoverageStrictThresholdsPerFile }
    }
  }
})
