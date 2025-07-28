import { useEffect, useState } from 'react'
import electronLogo from './assets/electron.svg'

function App(): React.JSX.Element {
  const [version, setVersion] = useState<string>('')
  const [updateStatus, setUpdateStatus] = useState<string>('')

  useEffect(() => {
    window.electron.ipcRenderer.invoke('get-app-version').then(setVersion)

    window.electron.ipcRenderer.on('update-available', () => {
      setUpdateStatus('Update available! Downloading...')
    })
    window.electron.ipcRenderer.on('update-downloaded', () => {
      setUpdateStatus('Update downloaded. Restarting soon...')
    })
  }, [])

  useEffect(() => {
    window.electron.ipcRenderer.invoke('get-app-version').then(setVersion)
  }, [])

  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <div className="version">App Version: {version}</div>
    </>
  )
}

export default App
