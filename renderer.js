const {ipcRenderer} = require('electron')

// Handle the button press and then tell the backend (main process) to act on the button press
document.getElementById('startRecordBTN').addEventListener('click', () =>{
    ipcRenderer.send('start-recording')
})

const information = document.getElementById('info')
information.innerText = `This app is using Chrome (v${process.versions.chrome}), Node.js (v${process.versions.node}), and Electron (v${process.versions.electron})`