// TITLEBAR

// exit/minimize
const exitButton = document.getElementById("exit-button");
const minimizeButton = document.getElementById("minimize-button");

exitButton.addEventListener("click", () => closeApp());
minimizeButton.addEventListener("click", () => minimizeApp());

const closeApp = () => ipcRenderer.send("CLOSE-APP");
const minimizeApp = () => ipcRenderer.send("MINIMIZE-APP");

// ----------------------------------------------------------------

// menu buttons
const settingsPageButton = document.getElementById("settings-page-button");
const settingsPage = document.getElementById("settings-contents");

const effectsPageButton = document.getElementById("effects-page-button");
const effectsPage = document.getElementById("effects-contents");

let settingsActive = true,
  effectsActive;

settingsPageButton.addEventListener("click", () => openSettingsPage());
effectsPageButton.addEventListener("click", () => openEffectsPage());

settingsPageButton.addEventListener("mouseenter", () =>
  enableHoverColor(settingsPageButton, settingsActive)
);
settingsPageButton.addEventListener("mouseleave", () =>
  disableHoverColor(settingsPageButton, settingsActive)
);
effectsPageButton.addEventListener("mouseenter", () =>
  enableHoverColor(effectsPageButton, effectsActive)
);
effectsPageButton.addEventListener("mouseleave", () =>
  disableHoverColor(effectsPageButton, effectsActive)
);

const enableHoverColor = (buttonElement, buttonBool) => {
  if (!buttonBool) buttonElement.style.backgroundColor = "#7743608a";
};
const disableHoverColor = (buttonElement, buttonBool) => {
  if (!buttonBool) buttonElement.style.backgroundColor = "#4C3A51";
};

const openSettingsPage = () => {
  settingsPageButton.style.backgroundColor = "#774360";
  effectsPageButton.style.backgroundColor = "#4C3A51";

  settingsPage.removeAttribute("hidden");
  effectsPage.setAttribute("hidden", "");

  settingsActive = true;
  effectsActive = false;
};
const openEffectsPage = () => {
  settingsPageButton.style.backgroundColor = "#4C3A51";
  effectsPageButton.style.backgroundColor = "#774360";

  effectsPage.removeAttribute("hidden");
  settingsPage.setAttribute("hidden", "");

  settingsActive = false;
  effectsActive = true;
};

// ----------------------------------------------------------------

// DROPDOWN
const dropdown = document.querySelector(".dropdown");
const dropdownContentPorts = document.getElementById("dropdown-content-ports");
const dropdownContentEffects = document.getElementById("dropdown-content-fx");

const dropdownButtonSpan = document.getElementById("dropdown-button-span");
const statusText = document.getElementById("status-text");

const connectButton = document.getElementById("connect-button");

let selectedPort = null;

setPorts();

async function setPorts() {
  const options = await handleSerial.getAvailablePorts();

  for (i = 0; i < options.length; i++) {
    let el = document.createElement("a");
    el.textContent = options[i].friendlyName;
    el.value = options[i].path;
    el.className = "dropdown-item";
    dropdownContentPorts.appendChild(el);

    el.addEventListener("click", function (event) {
      selectedPort = el.value;
      dropdownButtonSpan.textContent = selectedPort;
    });
  }
}

const connectToPort = () => {
  if (selectedPort !== null) {
    ipcRenderer.send("START-SERIAL", selectedPort);
    statusText.textContent = handleSerial.hasConnected;
  } else {
    alert("No port selected");
  }
};

dropdown.addEventListener("click", function (event) {
  event.stopPropagation();
  dropdown.classList.toggle("is-active");
});

connectButton.addEventListener("click", function (event) {
  connectToPort();
});

window.onclick = function (event) {
  if (!event.target.matches(".dropdown")) {
    dropdown.classList.remove("is-active");
  }
};
