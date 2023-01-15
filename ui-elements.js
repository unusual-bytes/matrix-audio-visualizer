// TITLEBAR

// exit/minimize
const exitButton = document.getElementById('exit-button');
const minimizeButton = document.getElementById('minimize-button');

exitButton.addEventListener('click', () => closeApp())
minimizeButton.addEventListener('click', () => minimizeApp())

const closeApp = () => ipcRenderer.send('CLOSE-APP') 
const minimizeApp = () => ipcRenderer.send('MINIMIZE-APP') 

// ----------------------------------------------------------------

// menu buttons
const settingsPageButton = document.getElementById('settings-page-button');
const settingsPage = document.getElementById('settings-contents');

const effectsPageButton = document.getElementById('effects-page-button');
const effectsPage = document.getElementById('effects-contents');

let settingsActive = true, effectsActive;

settingsPageButton.addEventListener('click', () => openSettingsPage())
effectsPageButton.addEventListener('click', () => openEffectsPage())

settingsPageButton.addEventListener('mouseenter', () => enableHoverColor(settingsPageButton, settingsActive))
settingsPageButton.addEventListener('mouseleave', () => disableHoverColor(settingsPageButton, settingsActive))
effectsPageButton.addEventListener('mouseenter', () => enableHoverColor(effectsPageButton, effectsActive))
effectsPageButton.addEventListener('mouseleave', () => disableHoverColor(effectsPageButton, effectsActive))

const enableHoverColor = (buttonElement, buttonBool) => {
  if(!buttonBool) buttonElement.style.backgroundColor = "#7743608a";
}
const disableHoverColor = (buttonElement, buttonBool) => {
  if(!buttonBool) buttonElement.style.backgroundColor = "#4C3A51";
}

const openSettingsPage = () => {
  settingsPageButton.style.backgroundColor = "#774360";
  effectsPageButton.style.backgroundColor = "#4C3A51";

  settingsPage.removeAttribute("hidden");
  effectsPage.setAttribute("hidden", "");

  settingsActive = true;
  effectsActive = false;
} 
const openEffectsPage = () => {
  settingsPageButton.style.backgroundColor = "#4C3A51";
  effectsPageButton.style.backgroundColor = "#774360";

  effectsPage.removeAttribute("hidden");
  settingsPage.setAttribute("hidden", "");

  settingsActive = false;
  effectsActive = true;
}

// ----------------------------------------------------------------

// DROPDOWN

const dropdown = document.querySelector('.dropdown');

dropdown.addEventListener('click', function(event) {
  event.stopPropagation();
  dropdown.classList.toggle('is-active');
});

window.onclick = function(event) {
    if (!event.target.matches('.dropdown')) {
        dropdown.classList.remove('is-active');
    }
  } 