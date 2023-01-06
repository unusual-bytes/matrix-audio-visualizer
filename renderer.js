const { ipcRenderer } = require('electron')

const constraints = {
  audio: { mandatory: { chromeMediaSource: 'desktop' } },
  video: { mandatory: { chromeMediaSource: 'desktop' } }
}

ipcRenderer.on('SET_SOURCE', async (event) => {
    try {

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      handleStream(stream)

    } catch (e) { 
      console.log(e) 
    }
})
  
  function handleStream (stream) {
    var audioCtx = new AudioContext();
    var src = audioCtx.createMediaStreamSource(stream);
    var analyser = audioCtx.createAnalyser();

    analyser.fftSize = 64;
    let frequencyArr = new Uint8Array(analyser.frequencyBinCount);

    src.connect(analyser);
    setInterval(realtimeFrequencyData, 0, frequencyArr, analyser);
  }

  function realtimeFrequencyData(frequencyArr, analyser)
  {
    analyser.getByteFrequencyData(frequencyArr);
    visualizeDataToCanvas(frequencyArr);
  }

  function visualizeDataToCanvas(dataArr)
  {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.moveTo(0, 0);
    ctx.beginPath();

    for(w = 0; w < dataArr.length; w++){ 
      ctx.lineTo(w*2, dataArr[w])
    } 

    ctx.stroke();
    
  }