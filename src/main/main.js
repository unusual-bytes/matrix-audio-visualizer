const { app, BrowserWindow, ipcMain } = require("electron");
const handleSerial = require("../handle-serial");

var win;

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 550,
    //resizable: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      backgroundThrottling: false,
    },
  });

  win.loadFile("src/index.html");

  win.webContents.on("did-finish-load", () => {
    win.webContents.send("SET_SOURCE");
  });

  win.on("focus", () => {
    win.webContents.send("IS_FOCUS", true);
  });

  win.on("blur", () => {
    win.webContents.send("IS_FOCUS", false);
  });
};

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.on("START-SERIAL", (event, port) => {
  handleSerial.startSerial(port);
});

ipcMain.on("SEND-SERIAL", (event, data, isCustomEffect, upsideDown, fill) => {
  handleSerial.sendDataOverSerial(data, isCustomEffect, upsideDown);
  if(!isCustomEffect) win.webContents.send("SET_MATRIX", data, isCustomEffect, upsideDown, fill);
});

ipcMain.on(
  "SET-VISUALIZER-SETTINGS",
  (event, controlGlow, upsideDown, fill) => {
    handleSerial.setVisualizerSettings(controlGlow, upsideDown, fill);
  }
);

ipcMain.on("VISUALIZER-HAS-PLAY-PRIORITY", (event, visualizerHasPriority) => {
  handleSerial.setPlayPriority(visualizerHasPriority);
});

ipcMain.on("CLOSE-APP", (event) => {
  win.close();
  app.quit();
});

ipcMain.on("MINIMIZE-APP", (event) => {
  win.minimize();
});
