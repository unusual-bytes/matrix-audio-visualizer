var exitButton = document.getElementById('exit-button');
var minimizeButton = document.getElementById('minimize-button');

exitButton.addEventListener('click', function(){ closeApp() })
minimizeButton.addEventListener('click', function(){ minimizeApp() })

const closeApp = () => ipcRenderer.send('CLOSE-APP') 
const minimizeApp = () => ipcRenderer.send('MINIMIZE-APP') 