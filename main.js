const { app, BrowserWindow, ipcMain } = require("electron");
const handleSerial = require("./handle-serial");

var win;

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 550,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      backgroundThrottling: false,
    },
  });

  win.loadFile("index.html");

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

ipcMain.on("SEND-SERIAL", (event, data, upsideDown) => {
  handleSerial.sendDataOverSerial(data, upsideDown);
  win.webContents.send("SET_MATRIX", data, upsideDown);
});

ipcMain.on(
  "SET-VISUALIZER-SETTINGS",
  (event, controlGlow, upsideDown, fill) => {
    handleSerial.setVisualizerSettings(controlGlow, upsideDown, fill);
  }
);

ipcMain.on("CLOSE-APP", (event) => {
  win.close();
  app.quit();
});

ipcMain.on("MINIMIZE-APP", (event) => {
  win.minimize();
});
