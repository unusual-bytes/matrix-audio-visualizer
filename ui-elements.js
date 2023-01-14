// TITLEBAR

var exitButton = document.getElementById('exit-button');
var minimizeButton = document.getElementById('minimize-button');

exitButton.addEventListener('click', () => closeApp())
minimizeButton.addEventListener('click', () => minimizeApp())

const closeApp = () => ipcRenderer.send('CLOSE-APP') 
const minimizeApp = () => ipcRenderer.send('MINIMIZE-APP') 

// ----------------------------------------------------------------

// DROPDOWN

var dropdown = document.querySelector('.dropdown');

dropdown.addEventListener('click', function(event) {
  event.stopPropagation();
  dropdown.classList.toggle('is-active');
});

window.onclick = function(event) {
    if (!event.target.matches('.dropdown')) {
        dropdown.classList.remove('is-active');
    }
  } 