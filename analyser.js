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
};

function realtimeFrequencyData(frequencyArr, analyser) {
  analyser.getByteFrequencyData(frequencyArr);

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