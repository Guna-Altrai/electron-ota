import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'

log.transports.file.level = 'info'
autoUpdater.logger = log

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true
    }
  })

  ipcMain.handle('get-app-version', () => app.getVersion())

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    console.log('Window is ready')
    setupAutoUpdater()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function setupAutoUpdater() {
  autoUpdater.on('checking-for-update', () => {
    console.log('Checking for updates...')
  })

  autoUpdater.on('update-available', (info) => {
    console.log('Update available:', info)
  })

  autoUpdater.on('update-not-available', (info) => {
    console.log('No updates available:', info)
  })

  autoUpdater.on('error', (err) => {
    console.error('Update error:', err)
  })

  autoUpdater.on('download-progress', (progress) => {
    console.log(`Downloaded ${progress.percent.toFixed(2)}%`)
  })

  autoUpdater.on('update-downloaded', () => {
    console.log('Update downloaded; will install on quit.')
    autoUpdater.quitAndInstall()
  })

  // Check for updates
  autoUpdater.checkForUpdates()
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')
  createWindow()

  if (app.isPackaged) {
    // setupAutoUpdater()
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
