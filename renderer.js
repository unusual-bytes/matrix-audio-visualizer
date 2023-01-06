const { ipcRenderer } = require('electron')

const constraints = {
  audio: { mandatory: { chromeMediaSource: 'desktop' } },
  video: { mandatory: { chromeMediaSource: 'desktop' } }
}

ipcRenderer.on('SET_SOURCE', async (event) => {
    console.log("received")

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      handleStream(stream)
    } catch (e) {
      handleError(e)
    }
  })
  
  function handleStream (stream) {
    console.log(stream)
    const video = document.querySelector('video')
    video.srcObject = stream
    video.onloadedmetadata = (e) => video.play()
  }
  
  function handleError (e) {
    console.log(e)
  }