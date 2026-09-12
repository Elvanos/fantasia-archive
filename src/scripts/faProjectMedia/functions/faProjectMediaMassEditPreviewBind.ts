import type { T_faProjectMediaPreviewKind } from 'app/types/I_faProjectMediaDomain'

/**
 * Computed thumbnail flags from the active probe URL, embed body, and load/fail state.
 */
export function createFaProjectMediaMassEditPreviewBindFlags (deps: {
  computedFn: <T>(getter: () => T) => { readonly value: T }
  embedBody: { readonly value: string }
  isEmbedPreview: { readonly value: boolean }
  previewFailed: { readonly value: boolean }
  previewLoaded: { readonly value: boolean }
  probeSrc: { readonly value: string }
  resolveKindFn: (url: string) => T_faProjectMediaPreviewKind
  resolveTypeIconNameFn: (kind: T_faProjectMediaPreviewKind) => string
}) {
  const previewKind = deps.computedFn((): T_faProjectMediaPreviewKind => {
    if (deps.isEmbedPreview.value) {
      return 'embed'
    }
    return deps.resolveKindFn(deps.probeSrc.value)
  })
  const previewImagePending = deps.computedFn(() => {
    return !deps.isEmbedPreview.value &&
      deps.probeSrc.value.length > 0 &&
      !deps.previewLoaded.value
  })
  const previewTypeIconName = deps.computedFn(() => {
    return deps.resolveTypeIconNameFn(previewKind.value)
  })
  const showPreviewAudio = deps.computedFn(() => {
    return !deps.isEmbedPreview.value &&
      deps.probeSrc.value.length > 0 &&
      previewKind.value === 'audio'
  })
  const showPreviewImage = deps.computedFn(() => {
    return !deps.isEmbedPreview.value &&
      deps.probeSrc.value.length > 0 &&
      previewKind.value === 'image'
  })
  const showPreviewTypeIcon = deps.computedFn(() => {
    if (deps.isEmbedPreview.value) {
      return deps.embedBody.value.trim().length > 0
    }
    return deps.previewLoaded.value &&
      !deps.previewFailed.value &&
      previewKind.value !== 'image'
  })
  const showPreviewVideo = deps.computedFn(() => {
    return !deps.isEmbedPreview.value &&
      deps.probeSrc.value.length > 0 &&
      previewKind.value === 'video'
  })
  const showPreviewWarning = deps.computedFn(() => {
    if (deps.isEmbedPreview.value) {
      return deps.embedBody.value.trim().length === 0
    }
    return deps.probeSrc.value.length === 0 || deps.previewFailed.value
  })

  return {
    previewImagePending,
    previewKind,
    previewTypeIconName,
    showPreviewAudio,
    showPreviewImage,
    showPreviewTypeIcon,
    showPreviewVideo,
    showPreviewWarning
  }
}

interface I_faProjectMediaMassEditPreviewBindLogic {
  applyProbeFn: (
    probeSrc: { value: string },
    previewLoaded: { value: boolean },
    previewFailed: { value: boolean },
    nextUrl: string
  ) => void
  markFailedFn: (
    previewFailed: { value: boolean },
    previewLoaded: { value: boolean }
  ) => void
  markLoadedFn: (
    previewFailed: { value: boolean },
    previewLoaded: { value: boolean }
  ) => void
  resolveKindFn: (url: string) => T_faProjectMediaPreviewKind
  resolveTypeIconNameFn: (kind: T_faProjectMediaPreviewKind) => string
}

interface I_faProjectMediaMassEditPreviewBindVueDeps {
  clearTimeoutFn: (id: unknown) => void
  computedFn: <T>(getter: () => T) => { readonly value: T }
  debounceMs: number
  embedBody: { readonly value: string }
  isEmbedPreview: { readonly value: boolean }
  onBeforeUnmountFn: (hook: () => void) => void
  previewUrl: { readonly value: string }
  refFn: <T>(value: T) => { value: T }
  setTimeoutFn: (handler: () => void, timeout: number) => unknown
  watchFn: (source: { readonly value: unknown }, cb: () => void) => void
}

/**
 * Delayed thumbnail probe: hide until load, keep a prior fail until then.
 */
export function createFaProjectMediaMassEditPreviewBindWithLogic (
  logic: I_faProjectMediaMassEditPreviewBindLogic,
  deps: I_faProjectMediaMassEditPreviewBindVueDeps
) {
  const probeSrc = deps.refFn(deps.previewUrl.value)
  const previewFailed = deps.refFn(deps.previewUrl.value.length === 0)
  const previewLoaded = deps.refFn(false)
  let previewDebounceTimer: unknown

  const {
    previewImagePending,
    previewKind,
    previewTypeIconName,
    showPreviewAudio,
    showPreviewImage,
    showPreviewTypeIcon,
    showPreviewVideo,
    showPreviewWarning
  } = createFaProjectMediaMassEditPreviewBindFlags({
    computedFn: deps.computedFn,
    embedBody: deps.embedBody,
    isEmbedPreview: deps.isEmbedPreview,
    previewFailed,
    previewLoaded,
    probeSrc,
    resolveKindFn: logic.resolveKindFn,
    resolveTypeIconNameFn: logic.resolveTypeIconNameFn
  })

  function onPreviewLoad (): void {
    logic.markLoadedFn(previewFailed, previewLoaded)
  }

  function onPreviewError (): void {
    logic.markFailedFn(previewFailed, previewLoaded)
  }

  function clearPreviewDebounceTimer (): void {
    if (previewDebounceTimer === undefined) {
      return
    }
    deps.clearTimeoutFn(previewDebounceTimer)
    previewDebounceTimer = undefined
  }

  function schedulePreviewProbe (): void {
    if (deps.isEmbedPreview.value) {
      clearPreviewDebounceTimer()
      return
    }
    clearPreviewDebounceTimer()
    previewDebounceTimer = deps.setTimeoutFn(() => {
      previewDebounceTimer = undefined
      logic.applyProbeFn(
        probeSrc,
        previewLoaded,
        previewFailed,
        deps.previewUrl.value
      )
    }, deps.debounceMs)
  }

  deps.watchFn(deps.previewUrl, schedulePreviewProbe)
  deps.watchFn(deps.isEmbedPreview, schedulePreviewProbe)
  deps.onBeforeUnmountFn(clearPreviewDebounceTimer)

  return {
    onPreviewError,
    onPreviewLoad,
    previewImagePending,
    previewKind,
    previewTypeIconName,
    probeSrc,
    showPreviewAudio,
    showPreviewImage,
    showPreviewTypeIcon,
    showPreviewVideo,
    showPreviewWarning
  }
}

/**
 * Bind Vue timers to injected preview logic.
 */
export function createFaProjectMediaMassEditPreviewBindFactory (
  logic: I_faProjectMediaMassEditPreviewBindLogic
) {
  function createBind (deps: I_faProjectMediaMassEditPreviewBindVueDeps) {
    return createFaProjectMediaMassEditPreviewBindWithLogic(logic, deps)
  }

  return createBind
}
