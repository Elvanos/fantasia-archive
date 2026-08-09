import type {
  I_createUseProjectOverviewDeps,
  I_useProjectOverviewApi
} from 'app/types/I_faProjectOverview'

import { createProjectOverviewSession } from './createProjectOverviewSessionWiring'

export function createUseProjectOverview (
  deps: I_createUseProjectOverviewDeps
): () => I_useProjectOverviewApi {
  return function useProjectOverview (): I_useProjectOverviewApi {
    return createProjectOverviewSession(deps)
  }
}
