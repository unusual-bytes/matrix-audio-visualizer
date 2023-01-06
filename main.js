const { app, BrowserWindow, ipcMain, desktopCapturer, webContents } = require('electron')
const path = require('path')
const startAudioRecorder = require('./audio');

let sourceID;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration:true,
      contextIsolation: false,
      },
  })

  desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
    for (const source of sources) {
      if (source.name === 'Entire Screen' || 'Screen 1') {
        console.log("should send")
          sourceID = source.id;
        return
      }
    }
})

  win.loadFile('index.html')
  win.webContents.on('did-finish-load', () => {
    win.webContents.send('SET_SOURCE', sourceID)
  })
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