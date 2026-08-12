import { i18n } from 'app/i18n/externalFileLoader'

import type { I_appMenuBuildSession, I_appMenuList } from 'app/types/I_appMenusDataList'

import {
  faMenuItem,
  faMenuSeparator
} from 'app/src/components/globals/AppControlMenus/_data/menuDataHelpers'
import { runFaAction } from 'app/src/scripts/actionManager/faActionManagerRun_manager'

export function buildDocumentsMenu (session: I_appMenuBuildSession): I_appMenuList {
  const gate = session.hasActiveProject

  return {
    data: [
      faMenuItem('appControlMenus.documents.items.quickAddNewDocument', 'mdi-text-box-plus-outline', {
        conditions: gate,
        keybindCommandId: 'quickNewDocument',
        trigger: () => runFaAction('openQuickAddDocumentDialog', undefined)
      }),
      faMenuItem('appControlMenus.documents.items.quickSearchDocument', 'mdi-database-search', {
        conditions: gate,
        keybindCommandId: 'quickExistingDocument',
        trigger: () => runFaAction('openQuickSearchDocumentDialog', undefined)
      }),
      faMenuSeparator('documents-sep-after-search'),
      faMenuItem('appControlMenus.documents.items.massDeleteDocument', 'mdi-text-box-remove-outline', {
        conditions: false,
        specialColor: 'secondary'
      }),
      faMenuSeparator('documents-sep-before-export'),
      faMenuItem('appControlMenus.documents.items.exportProjectDocuments', 'mdi-database-export-outline', {
        conditions: false
      })
    ],
    title: i18n.global.t('appControlMenus.documents.title')
  }
}
