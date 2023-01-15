const { ipcRenderer } = require('electron')

const handleSerial = require('./handle-serial');

const constraints = {
  audio: { mandatory: { chromeMediaSource: 'desktop' } },
  video: { mandatory: { chromeMediaSource: 'desktop' } }
}

const delay = ms => new Promise(res => setTimeout(res, ms));

ipcRenderer.on('SET_SOURCE', async (event) => {
  try {

    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    handleStream(stream)

  } catch (e) {
    console.log(e)
  }
})

function handleStream(stream) {
  var audioCtx = new AudioContext();
  var src = audioCtx.createMediaStreamSource(stream);
  var analyser = audioCtx.createAnalyser();

  analyser.fftSize = 64;
  let frequencyArr = new Uint8Array(analyser.frequencyBinCount);

  src.connect(analyser);
  setInterval(realtimeFrequencyData, 0, frequencyArr, analyser);
}

function realtimeFrequencyData(frequencyArr, analyser) // TODO: Fix: All frequencies under ~900Hz get grouped in the first few values. Elements like 808s and kicks as well as parts of the melody get missed and shown all in one group of pixels (just 3 pixels on the LED matrix).
{
  analyser.getByteFrequencyData(frequencyArr);
  //visualizeDataToCanvas(frequencyArr);
  ipcRenderer.send('SEND-SERIAL', frequencyArr);
}

function visualizeDataToCanvas(dataArr) {
  var canvas = document.getElementById("audioVisualizerCanvas");
  var ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.moveTo(0, 0);
  ctx.beginPath();

  for (w = 0; w < dataArr.length; w++) {
    ctx.lineTo(w * 2, dataArr[w])
  }

  ctx.stroke();

}