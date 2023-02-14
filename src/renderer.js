const { ipcRenderer } = require("electron");
const handleSerial = require("./handle-serial");
const analyser = require("./analyser");

const constraints = {
  audio: { mandatory: { chromeMediaSource: "desktop" } },
  video: { mandatory: { chromeMediaSource: "desktop" } },
};

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

ipcRenderer.on("SET_SOURCE", async (event) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    analyser.handleStream(stream);
  } catch (e) {
    console.log(e);
  }
});
