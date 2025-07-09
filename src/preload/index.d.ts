import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      ipcRenderer: typeof import('electron').ipcRenderer
      appVersion?: string
      getAppVersion?: () => string
    }
  }
}
