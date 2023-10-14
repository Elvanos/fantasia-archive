import { i18n } from 'app/src/i18n/externalFileLoader'

import { I_appMenusDataList } from 'app/interfaces/I_appMenusDataList'

// TODO - add functionality for all buttons and conditions
import { toggleDevTools } from 'app/src/scripts/appInfo/toggleDevTools'
import { openDialogMarkdownDocument } from 'app/src/scripts/appInfo/openDialogMarkdownDocument'

export const helpInfo: I_appMenusDataList = {
  title: i18n.global.t('AppControlMenus.helpInfo.title'),
  data: [
    {
      mode: 'item',
      text: i18n.global.t('AppControlMenus.helpInfo.items.showKeybindsCheatsheet'),
      icon: 'mdi-keyboard-settings',
      submenu: undefined,
      trigger: undefined,
      conditions: true,
      specialColor: undefined
    },
    {
      mode: 'item',
      text: i18n.global.t('AppControlMenus.helpInfo.items.advancedSearchGuide'),
      icon: 'mdi-file-question',
      submenu: undefined,
      trigger: openDialogMarkdownDocument,
      triggerArguments: ['advancedSearchGuide'],
      conditions: true,
      specialColor: undefined
    },
    {
      mode: 'item',
      text: i18n.global.t('AppControlMenus.helpInfo.items.tipsTricksTrivia'),
      icon: 'mdi-fire-alert',
      submenu: undefined,
      trigger: undefined,
      conditions: true,
      specialColor: undefined
    },
    {
      mode: 'separator'
    },
    {
      mode: 'item',
      text: i18n.global.t('AppControlMenus.helpInfo.items.changelog'),
      icon: 'mdi-clipboard-text',
      submenu: undefined,
      trigger: openDialogMarkdownDocument,
      triggerArguments: ['changeLog'],
      conditions: true,
      specialColor: undefined
    },
    {
      mode: 'item',
      text: i18n.global.t('AppControlMenus.helpInfo.items.aboutFantsiaArchive'),
      icon: 'mdi-information-variant',
      submenu: undefined,
      trigger: undefined,
      conditions: true,
      specialColor: undefined
    },
    {
      mode: 'item',
      text: i18n.global.t('AppControlMenus.helpInfo.items.license'),
      icon: 'mdi-script-text-outline',
      submenu: undefined,
      trigger: openDialogMarkdownDocument,
      triggerArguments: ['license'],
      conditions: true,
      specialColor: undefined
    },
    {
      mode: 'separator'
    },
    {
      mode: 'item',
      text: i18n.global.t('AppControlMenus.helpInfo.items.toggleDeveloperTools'),
      icon: 'mdi-code-tags',
      submenu: undefined,
      trigger: toggleDevTools,
      conditions: true,
      specialColor: undefined
    }
  ]
}
