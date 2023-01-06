const { ipcRenderer } = require('electron')

// Handle the button press and then tell the backend (main process) to act on the button press
// document.getElementById('startRecordBTN').addEventListener('click', () =>{
//     ipcRenderer.send('start-recording')
// })

ipcRenderer.on('ping', (event, message) => {
    console.log(message) // Prints 'whoooooooh!'
  })

ipcRenderer.on('SET_SOURCE', (event, sourceId) => {
    console.log("received")
    try {
        console.log("tryin")
      const stream = navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: sourceId.message,
            minWidth: 1280,
            maxWidth: 1280,
            minHeight: 720,
            maxHeight: 720
          }
        }
      })
      handleStream(stream)
    } catch (e) {
      handleError(e)
    }
  })
  
  function handleStream (stream) {
    console.log("handleStream called")
    const video = document.querySelector('video')
    //video.src = URL.createObjectURL(stream)
    video.srcObject = stream
    video.onloadedmetadata = (e) => video.play()
  }
  
  function handleError (e) {
    console.log(e)
  }

const information = document.getElementById('info')
information.innerText = `This app is using Chrome (v${process.versions.chrome}), Node.js (v${process.versions.node}), and Electron (v${process.versions.electron})`