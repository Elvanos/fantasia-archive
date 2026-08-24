import type { I_createFaActionDefinitionHandlersDialogsDeps } from 'app/types/I_createFaActionDefinitionHandlersDialogsDeps'

async function handleOpenKeybindSettingsDialog (
  deps: I_createFaActionDefinitionHandlersDialogsDeps
): Promise<void> {
  if (deps.tryDismissFaComponentDialogIfOpen('KeybindSettings')) {
    return
  }
  deps.openDialogComponent('KeybindSettings')
}

async function handleOpenAppSettingsDialog (
  deps: I_createFaActionDefinitionHandlersDialogsDeps
): Promise<void> {
  if (deps.tryDismissFaComponentDialogIfOpen('AppSettings')) {
    return
  }
  deps.openDialogComponent('AppSettings')
}

async function handleOpenProjectSettingsDialog (
  deps: I_createFaActionDefinitionHandlersDialogsDeps,
  payload?: { initialTab?: string } | void
): Promise<void> {
  if (deps.tryDismissFaComponentDialogIfOpen('ProjectSettings')) {
    return
  }
  if (!deps.S_FaActiveProject().hasActiveProject) {
    return
  }
  const initialTab =
    payload !== undefined && payload !== null && typeof payload === 'object'
      ? payload.initialTab
      : undefined
  deps.setProjectSettingsInitialTab(initialTab ?? null)
  deps.openDialogComponent('ProjectSettings')
}

async function handleOpenAppStylingWindow (
  deps: I_createFaActionDefinitionHandlersDialogsDeps
): Promise<void> {
  deps.openDialogComponent('WindowAppStyling')
}

async function handleOpenProjectStylingWindow (
  deps: I_createFaActionDefinitionHandlersDialogsDeps
): Promise<void> {
  if (!deps.S_FaActiveProject().hasActiveProject) {
    return
  }
  if (!deps.canOpenFloatingWindowWhileNoModal()) {
    return
  }
  deps.openDialogComponent('WindowProjectStyling')
}

async function handleOpenAdvancedSearchGuideDialog (
  deps: I_createFaActionDefinitionHandlersDialogsDeps
): Promise<void> {
  if (deps.tryDismissFaMarkdownDocumentIfOpen('advancedSearchGuide')) {
    return
  }
  deps.openDialogMarkdownDocument('advancedSearchGuide')
}

async function handleOpenChangelogDialog (
  deps: I_createFaActionDefinitionHandlersDialogsDeps
): Promise<void> {
  deps.openDialogMarkdownDocument('changeLog')
}

async function handleOpenLicenseDialog (
  deps: I_createFaActionDefinitionHandlersDialogsDeps
): Promise<void> {
  deps.openDialogMarkdownDocument('license')
}

async function handleOpenAboutFantasiaArchiveDialog (
  deps: I_createFaActionDefinitionHandlersDialogsDeps
): Promise<void> {
  deps.openDialogComponent('AboutFantasiaArchive')
}

async function handleOpenTipsTricksTriviaDialog (
  deps: I_createFaActionDefinitionHandlersDialogsDeps
): Promise<void> {
  deps.openDialogMarkdownDocument('tipsTricksTrivia')
}

async function handleOpenActionMonitorDialog (
  deps: I_createFaActionDefinitionHandlersDialogsDeps
): Promise<void> {
  if (deps.tryDismissFaComponentDialogIfOpen('ActionMonitor')) {
    return
  }
  deps.openDialogComponent('ActionMonitor')
}

async function handleOpenImportExportAppConfigDialog (
  deps: I_createFaActionDefinitionHandlersDialogsDeps
): Promise<void> {
  deps.openDialogComponent('ImportExportAppConfig')
}

async function handleOpenNewProjectDialog (
  deps: I_createFaActionDefinitionHandlersDialogsDeps
): Promise<void> {
  deps.openDialogComponent('NewProject')
}

async function handleOpenQuickAddDocumentDialog (
  deps: I_createFaActionDefinitionHandlersDialogsDeps
): Promise<void> {
  if (!deps.S_FaActiveProject().hasActiveProject) {
    return
  }
  const allowSameKeyClose = deps.S_FaUserSettings().settings?.allowQuickPopupSameKeyClose === true
  if (allowSameKeyClose && deps.tryDismissFaComponentDialogIfOpen('QuickAddDocument')) {
    return
  }
  deps.openDialogComponent('QuickAddDocument')
}

async function handleOpenProjectMediaDialog (
  deps: I_createFaActionDefinitionHandlersDialogsDeps
): Promise<void> {
  if (deps.tryDismissFaComponentDialogIfOpen('ProjectMedia')) {
    return
  }
  if (!deps.S_FaActiveProject().hasActiveProject) {
    return
  }
  deps.openDialogComponent('ProjectMedia')
}

async function handleOpenQuickSearchDocumentDialog (
  deps: I_createFaActionDefinitionHandlersDialogsDeps
): Promise<void> {
  if (!deps.S_FaActiveProject().hasActiveProject) {
    return
  }
  const allowSameKeyClose = deps.S_FaUserSettings().settings?.allowQuickPopupSameKeyClose === true
  if (allowSameKeyClose && deps.tryDismissFaComponentDialogIfOpen('QuickSearchDocument')) {
    return
  }
  deps.openDialogComponent('QuickSearchDocument')
}

export function buildFaActionDefinitionHandlersDialogsOpens (
  deps: I_createFaActionDefinitionHandlersDialogsDeps
): {
    handleOpenKeybindSettingsDialog: () => Promise<void>
    handleOpenAppSettingsDialog: () => Promise<void>
    handleOpenProjectSettingsDialog: (
      payload?: { initialTab?: string } | void
    ) => Promise<void>
    handleOpenAppStylingWindow: () => Promise<void>
    handleOpenProjectStylingWindow: () => Promise<void>
    handleOpenAdvancedSearchGuideDialog: () => Promise<void>
    handleOpenChangelogDialog: () => Promise<void>
    handleOpenLicenseDialog: () => Promise<void>
    handleOpenAboutFantasiaArchiveDialog: () => Promise<void>
    handleOpenTipsTricksTriviaDialog: () => Promise<void>
    handleOpenActionMonitorDialog: () => Promise<void>
    handleOpenImportExportAppConfigDialog: () => Promise<void>
    handleOpenNewProjectDialog: () => Promise<void>
    handleOpenQuickAddDocumentDialog: () => Promise<void>
    handleOpenProjectMediaDialog: () => Promise<void>
    handleOpenQuickSearchDocumentDialog: () => Promise<void>
  } {
  return {
    handleOpenKeybindSettingsDialog: () => handleOpenKeybindSettingsDialog(deps),
    handleOpenAppSettingsDialog: () => handleOpenAppSettingsDialog(deps),
    handleOpenProjectSettingsDialog: (payload?) => {
      return handleOpenProjectSettingsDialog(deps, payload)
    },
    handleOpenAppStylingWindow: () => handleOpenAppStylingWindow(deps),
    handleOpenProjectStylingWindow: () => handleOpenProjectStylingWindow(deps),
    handleOpenAdvancedSearchGuideDialog: () => handleOpenAdvancedSearchGuideDialog(deps),
    handleOpenChangelogDialog: () => handleOpenChangelogDialog(deps),
    handleOpenLicenseDialog: () => handleOpenLicenseDialog(deps),
    handleOpenAboutFantasiaArchiveDialog: () => handleOpenAboutFantasiaArchiveDialog(deps),
    handleOpenTipsTricksTriviaDialog: () => handleOpenTipsTricksTriviaDialog(deps),
    handleOpenActionMonitorDialog: () => handleOpenActionMonitorDialog(deps),
    handleOpenImportExportAppConfigDialog: () => handleOpenImportExportAppConfigDialog(deps),
    handleOpenNewProjectDialog: () => handleOpenNewProjectDialog(deps),
    handleOpenQuickAddDocumentDialog: () => handleOpenQuickAddDocumentDialog(deps),
    handleOpenProjectMediaDialog: () => handleOpenProjectMediaDialog(deps),
    handleOpenQuickSearchDocumentDialog: () => handleOpenQuickSearchDocumentDialog(deps)
  }
}
