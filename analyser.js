let currentEffect = "vis1";
let controlGlow,
  upsideDown,
  fill = false;

module.exports = {
  handleStream: function handleStream(stream) {
    var audioCtx = new AudioContext();
    var src = audioCtx.createMediaStreamSource(stream);
    var analyser = audioCtx.createAnalyser();
    analyser.minDecibels = -130;
    analyser.maxDecibels = -10;

    analyser.fftSize = 2048;
    let frequencyArr = new Uint8Array(analyser.frequencyBinCount);

    src.connect(analyser);
    setInterval(realtimeFrequencyData, 0, frequencyArr, analyser);
  },

  setCurrentEffect: function setCurrentEffect(
    setEffect,
    setControlGlow,
    setUpsideDown,
    setFill
  ) {
    currentEffect = setEffect;
    controlGlow = setControlGlow;
    upsideDown = setUpsideDown;
    fill = setFill;
  },
};

function realtimeFrequencyData(frequencyArr, analyser) {
  analyser.getByteFrequencyData(frequencyArr);
  console.log(currentEffect);
  const binnedArray = [];
  const binSize = frequencyArr.length / 48;

  if (currentEffect == "vis1") {
    // max value
    for (let i = 0; i < 32; i++) {
      const start = i * binSize;
      const end = start + binSize;
      const bin = frequencyArr.slice(start, end);

      binnedArray.push(Math.max.apply(Math, bin));
    }
  }

  if (currentEffect == "vis2") {
    // average value
    for (let i = 0; i < 32; i++) {
      const start = i * binSize;
      const end = start + binSize;
      const bin = frequencyArr.slice(start, end);
      const nonZeroValues = bin.filter((value) => value !== 0);
      let binnedValue = 0;
      if (nonZeroValues.length > 0) {
        binnedValue =
          nonZeroValues.reduce((a, b) => a + b) / nonZeroValues.length;
      }
      binnedArray.push(binnedValue);
    }
  }

  ipcRenderer.send("SEND-SERIAL", binnedArray, upsideDown);
}
