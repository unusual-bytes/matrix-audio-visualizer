const AudioMotionAnalyzer = require("./external-modules/audioMotion-analyzer/audioMotion-analyzer");

let currentEffect = "vis1";
let controlGlow,
  upsideDown,
  fill = false;

module.exports = {
  handleStream: function handleStream(stream) {
    let frequencyArr;

    const audioMotion = new AudioMotionAnalyzer(null, {
      useCanvas: false,
      fftSize: 2048,
      //minDecibels: -130,
      //maxDecibels: -10,
      mode: 6,
      onCanvasDraw: (instance) => {
        frequencyArr = [];
        audioMotion.getBars().map((e) => frequencyArr.push(e.value[0]));
        realtimeFrequencyData(frequencyArr);
      },
    });

    var desktopStream = audioMotion.audioCtx.createMediaStreamSource(stream);
    audioMotion.connectInput(desktopStream);
    audioMotion.volume = 0;
  },

  setCurrentEffect: (setCurrentEffect = (
    setEffect,
    setControlGlow,
    setUpsideDown,
    setFill
  ) => {
    currentEffect = setEffect;
    controlGlow = setControlGlow;
    upsideDown = setUpsideDown;
    fill = setFill;
  }),
};

function realtimeFrequencyData(frequencyArr) {
  if (currentEffect.includes("vis"))
    if (currentEffect == "vis1") {
      // 25 Hz - 15585 Hz
      frequencyArr.splice(0, 1);
      frequencyArr.splice(frequencyArr.length - 1, 1);
    }

  if (currentEffect == "vis2") {
    // 30 Hz - 18796 Hz
    frequencyArr.splice(0, 2);
  }

  if (currentEffect == "vis3") {
    // 20 Hz - 12726 Hz
    frequencyArr.splice(frequencyArr.length - 2, 2);
  }

  ipcRenderer.send("SEND-SERIAL", frequencyArr, upsideDown, fill);
}
