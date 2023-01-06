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
  
  // HANDLE AUDIO ONLY, GET AUDIO VOLUME DATA
  function handleStream (stream) {
    console.log(stream)

    var context = new AudioContext();
    var src = context.createMediaStreamSource(stream);
    var analyser = context.createAnalyser();

    analyser.fftSize = 512;
    const bufferLength = analyser.frequencyBinCount;
    let frequencyArr = new Uint8Array(analyser.frequencyBinCount);

    src.connect(analyser);

    analyser.getByteFrequencyData(frequencyArr);
    console.log(frequencyArr);
    console.log(frequencyArr.filter(frequency => frequency>0));
    console.log(stream.getTracks()[0].enabled)

    setInterval(realtimeFrequencyData, 1, frequencyArr, analyser);

    // for video output
    // const video = document.querySelector('video')
    // video.srcObject = stream
    // video.onloadedmetadata = (e) => video.play()
  }

  

  function realtimeFrequencyData(frequencyArr, analyser)
  {
    analyser.getByteFrequencyData(frequencyArr);
    console.log(frequencyArr);
    console.log(frequencyArr.filter(frequency => frequency>0));
  }