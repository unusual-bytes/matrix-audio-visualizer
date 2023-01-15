const { app, BrowserWindow, ipcMain } = require('electron')
const handleSerial = require('./handle-serial');

var win;

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 550,
    frame: false,
    webPreferences: {
      nodeIntegration:true,
      contextIsolation: false,
      backgroundThrottling: false,
      },
  })

  win.loadFile('index.html')

  win.webContents.on('did-finish-load', () => {
    win.webContents.send('SET_SOURCE')
  })
}

// In Electron, BrowserWindows can only be created after the app module's ready event is fired. 
// You can wait for this event by using the app.whenReady() API and calling createWindow() once its promise is fulfilled.
app.whenReady().then(() => {
  createWindow()
  handleSerial.startSerial(`COM6`);
})

// Quit the app when all windows are closed (Windows & Linux)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('SEND-SERIAL', (event, data) => {
  handleSerial.sendDataOverSerial(data);
})

ipcMain.on('CLOSE-APP', (event) => {
  win.close();
  app.quit();
})

ipcMain.on('MINIMIZE-APP', (event) => {
  win.minimize();
})