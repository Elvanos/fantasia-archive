import { specialCharacterFixer } from '../specialCharactersFixer'

import T_helpInfo from './components/AppControlMenus/T_helpInfo'
import T_project from './components/AppControlMenus/T_project'
import T_tools from './components/AppControlMenus/T_tools'

import advancedSearchCheatSheet from './documents/advancedSearchCheatSheet.md'
import advancedSearchGuide from './documents/advancedSearchGuide.md'
import changeLog from './documents/changeLog.md'
import license from './documents/license.md'

export default {
  // GLOBAL - DOCUMENTS
  documents: {
    advancedSearchCheatSheet: specialCharacterFixer(advancedSearchCheatSheet),
    advancedSearchGuide: specialCharacterFixer(advancedSearchGuide),
    changeLog: specialCharacterFixer(changeLog),
    license: specialCharacterFixer(license)
  },

  // GLOBAL - APP TEXTS
  app: {
    name: 'FA - but in english!'
  },

  // PAGE - ERROR NOT FOUND
  ErrorNotFound: {
    title: 'ERROR/NOT FOUND',
    subTitleFirst: 'Something broke horribly somewhere',
    subTitleSecond: 'Fantasia is trying her best to fix it!',
    ctaText: 'Return to app start screen'
  },

  // COMPONENT - GLOBAL WINDOW BUTTONS
  GlobalWindowButtons: {
    minimizeButton: 'Minimize',
    resizeButton: 'Resize Down',
    maximizeButton: 'Maximize',
    close: 'Close'
  },

  // COMPONENT - APP CONTROL MENUS
  AppControlMenus: {
    project: T_project,
    tools: T_tools,
    helpInfo: T_helpInfo
  }

}
