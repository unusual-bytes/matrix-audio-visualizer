const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const startAudioRecorder = require('./audio');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration:true,
      contextIsolation: false,
      },
  })

  win.loadFile('index.html')
}
// In Electron, BrowserWindows can only be created after the app module's ready event is fired. 
// You can wait for this event by using the app.whenReady() API and calling createWindow() once its promise is fulfilled.
app.whenReady().then(() => {
  createWindow()
})

// Quit the app when all windows are closed (Windows & Linux)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })

ipcMain.on('start-recording', (event, arg) => {
  startAudioRecorder()
})