import type {
  I_faSelectInputUseDeps,
  I_faSelectInputUseInput
} from 'app/types/I_faSelectInput'

/**
 * Factory for FaSelectInput composable — API builder injected by manager (no functions/ value imports).
 */
export function createUseFaSelectInput<TApi> (
  deps: I_faSelectInputUseDeps,
  createApi: (
    deps: I_faSelectInputUseDeps,
    input: I_faSelectInputUseInput
  ) => TApi
): (input: I_faSelectInputUseInput) => TApi {
  return function useFaSelectInput (input: I_faSelectInputUseInput): TApi {
    return createApi(deps, input)
  }
}
