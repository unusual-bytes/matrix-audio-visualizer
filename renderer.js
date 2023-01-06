const { ipcRenderer } = require('electron')

ipcRenderer.on('SET_SOURCE', async (event, sourceId) => {
    console.log("received")

    const constraints = {
      audio: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: sourceId
        }
      },
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: sourceId
        }
      }
    }

    try {
        console.log(`tryin with ${sourceId}`)
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

const information = document.getElementById('info')
information.innerText = `This app is using Chrome (v${process.versions.chrome}), Node.js (v${process.versions.node}), and Electron (v${process.versions.electron})`