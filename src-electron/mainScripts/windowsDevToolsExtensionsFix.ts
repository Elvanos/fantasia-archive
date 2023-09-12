import { app, nativeTheme } from 'electron'
import path from 'path'

/**
  *Fix Windows related-bug with DevTools extensions and dark mode
  */
export const windowsDevToolsExtensionsFix = (platform: string) => {
  try {
    if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
      require('fs').unlinkSync(
        path.join(app.getPath('userData'), 'DevTools Extensions')
      )
    }
  } catch (_) {}
}
