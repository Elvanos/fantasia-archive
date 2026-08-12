import type { I_dialogComponentStoreLike } from 'app/types/I_dialogComponentStoreLike'
import type {
  I_dialogQuickSearchDocumentDocumentOption,
  I_dialogQuickSearchDocumentDocumentSource,
  I_dialogQuickSearchDocumentTemplateIconSource,
  I_dialogQuickSearchDocumentWorldOption,
  I_dialogQuickSearchDocumentWorldSource
} from 'app/types/I_dialogQuickSearchDocument'
import type { T_faSelectInputModelValue } from 'app/types/I_faSelectInput'
import type { T_dialogName } from 'app/types/T_appDialogsAndDocuments'
import type { T_faUserSettingsLanguageCode } from 'app/types/faUserSettingsLanguageRegistry'
import type { I_computedRef, I_ref } from 'app/types/I_vueCompositionShims'

/** FaSelectInput expose used for document auto-open after dialog show. */
export interface I_dialogQuickSearchDocumentFaSelectInputLike {
  openPopup: () => void
}

/** Mutable refs held for one Quick-Search Document dialog session. */
export interface I_dialogQuickSearchDocumentSession {
  dialogModel: I_ref<boolean>
  documentName: I_ref<string>
  documentOptions: I_computedRef<I_dialogQuickSearchDocumentDocumentOption[]>
  documentSelectRef: I_ref<I_dialogQuickSearchDocumentFaSelectInputLike | null>
  documents: I_ref<I_dialogQuickSearchDocumentDocumentSource[]>
  focusGeneration: I_ref<number>
  selectedDocumentId: I_ref<string | null>
  selectedWorldId: I_ref<string | null>
  showWorldSelect: I_computedRef<boolean>
  skipNextWorldChangeReopen: I_ref<boolean>
  templateIconsById: I_ref<Map<string, I_dialogQuickSearchDocumentTemplateIconSource>>
  worldOptions: I_computedRef<I_dialogQuickSearchDocumentWorldOption[]>
  worlds: I_ref<I_dialogQuickSearchDocumentWorldSource[]>
}

/** Public API returned by runDialogQuickSearchDocumentSession / useDialogQuickSearchDocument. */
export interface I_dialogQuickSearchDocumentApi {
  bindDocumentSelectRef: (el: unknown) => void
  dialogModel: I_ref<boolean>
  documentName: I_ref<string>
  documentOptions: I_computedRef<I_dialogQuickSearchDocumentDocumentOption[]>
  documentSelectActivateOnly: I_computedRef<boolean>
  documentSelectRef: I_ref<I_dialogQuickSearchDocumentFaSelectInputLike | null>
  onDialogHide: () => void
  onDialogShow: () => void
  onDocumentAddUnderClick: (documentId: string, event?: Event) => void
  onDocumentContextAddUnder: (documentId: string) => void
  onDocumentContextCopyBackgroundColor: (documentId: string) => void
  onDocumentContextCopyDocument: (documentId: string) => void
  onDocumentContextCopyName: (documentId: string) => void
  onDocumentContextCopyTextColor: (documentId: string) => void
  onDocumentContextDelete: (documentId: string) => void
  onDocumentContextEdit: (documentId: string) => void
  onDocumentContextOpen: (documentId: string) => void
  onDocumentCopyClick: (documentId: string, event?: Event) => void
  onDocumentEditClick: (documentId: string, event?: Event) => void
  onDocumentOptionAuxClick: (
    value: T_faSelectInputModelValue | null | undefined,
    event: Event
  ) => void
  onDocumentSelect: (value: T_faSelectInputModelValue | null | undefined) => void
  onWorldSelect: (value: T_faSelectInputModelValue | null | undefined) => void
  selectedDocumentId: I_ref<string | null>
  selectedDocumentOption: I_computedRef<I_dialogQuickSearchDocumentDocumentOption | null>
  selectedWorldId: I_ref<string | null>
  selectedWorldOption: I_computedRef<I_dialogQuickSearchDocumentWorldOption | null>
  showWorldSelect: I_computedRef<boolean>
  worldOptions: I_computedRef<I_dialogQuickSearchDocumentWorldOption[]>
}

/** Injected deps for createUseDialogQuickSearchDocument (level-1 factory). */
export interface I_createUseDialogQuickSearchDocumentDeps {
  buildDocumentOptions: (input: {
    documents: readonly I_dialogQuickSearchDocumentDocumentSource[]
    resolveDocumentIcon: (
      document: I_dialogQuickSearchDocumentDocumentSource,
      templatesById: ReadonlyMap<string, I_dialogQuickSearchDocumentTemplateIconSource>
    ) => string
    templatesById: ReadonlyMap<string, I_dialogQuickSearchDocumentTemplateIconSource>
  }) => I_dialogQuickSearchDocumentDocumentOption[]
  buildWorldOptions: (input: {
    preferredLanguageCode: T_faUserSettingsLanguageCode
    resolveWorldLabel: (
      displayNameTranslations: I_dialogQuickSearchDocumentWorldSource['displayNameTranslations'],
      languageCode: T_faUserSettingsLanguageCode
    ) => string
    worlds: readonly I_dialogQuickSearchDocumentWorldSource[]
  }) => I_dialogQuickSearchDocumentWorldOption[]
  computed: <T>(getter: () => T) => I_computedRef<T>
  isDialogQuickSearchDocumentDirectInput: (input: T_dialogName | undefined) => boolean
  isDialogQuickSearchDocumentStoreTarget: (dialogToOpen: unknown) => boolean
  loadDocumentsForWorld: (worldId: string) => Promise<I_dialogQuickSearchDocumentDocumentSource[]>
  loadQuickSearchDocumentSources: () => Promise<{
    templates: I_dialogQuickSearchDocumentTemplateIconSource[]
    worlds: I_dialogQuickSearchDocumentWorldSource[]
  }>
  nextTick: () => Promise<void>
  onBeforeUnmount: (hook: () => void) => void
  onMounted: (hook: () => void) => void
  pickFirstWorldId: (
    worlds: readonly { id: string }[]
  ) => string | null
  pickWorldIdWithSavedPreference: (input: {
    worlds: readonly { id: string }[]
    savedWorldId: string | null
    pickFirstWorldId: (
      worlds: readonly { id: string }[]
    ) => string | null
  }) => string | null
  readDisableCloseAfterSelectQuickSearch: () => boolean
  readLastSelectedWorldId: () => Promise<string | null>
  ref: <T>(value: T) => I_ref<T>
  registerComponentDialogStackGuard: (dialogModel: I_ref<boolean>) => void
  resolveDialogComponentStoreOrNull: () => I_dialogComponentStoreLike | null
  resolveDocumentOptionIcon: (
    document: I_dialogQuickSearchDocumentDocumentSource,
    templatesById: ReadonlyMap<string, I_dialogQuickSearchDocumentTemplateIconSource>
  ) => string
  resolvePreferredLanguageCode: () => T_faUserSettingsLanguageCode
  resolveWorldOptionLabel: (
    displayNameTranslations: I_dialogQuickSearchDocumentWorldSource['displayNameTranslations'],
    languageCode: T_faUserSettingsLanguageCode
  ) => string
  runDialogQuickSearchDocumentSession: (
    deps: I_createUseDialogQuickSearchDocumentDeps,
    props: { directInput?: T_dialogName | undefined }
  ) => I_dialogQuickSearchDocumentApi
  runFaAction: (
    actionId:
      | 'openHierarchyTreeDocument'
      | 'editHierarchyTreeDocument'
      | 'copyHierarchyTreeDocument'
      | 'addHierarchyTreeChildDocument'
      | 'copyHierarchyTreeDocumentName'
      | 'copyHierarchyTreeDocumentTextColor'
      | 'copyHierarchyTreeDocumentBackgroundColor'
      | 'deleteHierarchyTreeDocument',
    payload: {
      documentId: string
      openMode?: import('app/types/I_faOpenedDocumentsDomain').T_faOpenedDocumentOpenMode | undefined
    }
  ) => void
  sleep: (ms: number) => Promise<void>
  documentFocusMs: number
  watch: (
    source: I_ref<unknown> | (() => unknown),
    effect: (value?: unknown, oldValue?: unknown) => void | Promise<void>
  ) => void
  writeLastSelectedWorldId: (worldId: string) => Promise<void>
}
