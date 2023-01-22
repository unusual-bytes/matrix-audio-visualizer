const { ipcRenderer } = require("electron");
const handleSerial = require("./handle-serial");

const constraints = {
  audio: { mandatory: { chromeMediaSource: "desktop" } },
  video: { mandatory: { chromeMediaSource: "desktop" } },
};

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

ipcRenderer.on("SET_SOURCE", async (event) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleStream(stream);
  } catch (e) {
    console.log(e);
  }
});

function handleStream(stream) {
  var audioCtx = new AudioContext();
  var src = audioCtx.createMediaStreamSource(stream);
  var analyser = audioCtx.createAnalyser();
  analyser.minDecibels = -130;
  analyser.maxDecibels = -10;

  analyser.fftSize = 2048;
  let frequencyArr = new Uint8Array(analyser.frequencyBinCount);

  src.connect(analyser);
  setInterval(realtimeFrequencyData, 0, frequencyArr, analyser);
}

function realtimeFrequencyData(frequencyArr, analyser) {
  // TODO: Fix: All frequencies under ~900Hz get grouped in the first few values. Elements like 808s and kicks as well as parts of the melody get missed and shown all in one group of pixels (just 3 pixels on the LED matrix).
  analyser.getByteFrequencyData(frequencyArr);
  visualizeDataToCanvas(frequencyArr);

  const binnedArray = [];
  const binSize = frequencyArr.length / 48;

  // average value
  // for (let i = 0; i < 32; i++) {
  //   const start = i * binSize;
  //   const end = start + binSize;
  //   const bin = frequencyArr.slice(start, end);
  //   const nonZeroValues = bin.filter((value) => value !== 0);
  //   let binnedValue = 0;
  //   if (nonZeroValues.length > 0) {
  //     binnedValue =
  //       nonZeroValues.reduce((a, b) => a + b) / nonZeroValues.length;
  //   }
  //   binnedArray.push(binnedValue);
  // }

  // max value
  for (let i = 0; i < 32; i++) {
    const start = i * binSize;
    const end = start + binSize;
    const bin = frequencyArr.slice(start, end);

    binnedArray.push(Math.max.apply(Math, bin));
  }

  ipcRenderer.send("SEND-SERIAL", binnedArray);
}

function visualizeDataToCanvas(dataArr) {
  var canvas = document.getElementById("audioVisualizerCanvas");
  var ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.moveTo(0, 0);
  ctx.beginPath();

  for (w = 0; w < dataArr.length; w++) {
    ctx.lineTo(w * 2, dataArr[w]);
  }

  ctx.stroke();
}
