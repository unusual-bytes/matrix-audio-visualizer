const { desktopCapturer } = require('electron')

module.exports = function startAudioRecorder() {
    // implementation of audio recorder function goes here
    console.log("start audio recorder called")
    //setupAudioCapturer();
  }

  // TODO: 
  // Record realtime desktop output audio
  // Process audio volume data

  function setupAudioCapturer() {

    desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
        for (const source of sources) {
          if (source.name === "Entire Screen" || "Screen 1") {
            mainWindow.webContents.send('SET_SOURCE', source.id)
            return
          }
        }
    })
     
  }