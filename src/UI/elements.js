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

const fxBuilderPageButton = document.getElementById("fxBuilder-page-button");
const fxBuilderPage = document.getElementById("fxBuilder-contents");

let settingsActive = true,
  effectsActive,
  fxBuilderActive;

settingsPageButton.addEventListener("click", () => openSettingsPage());
effectsPageButton.addEventListener("click", () => openEffectsPage());
fxBuilderPageButton.addEventListener("click", () => openFxBuilderPage());

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
fxBuilderPageButton.addEventListener("mouseenter", () =>
  enableHoverColor(fxBuilderPageButton, fxBuilderActive)
);
fxBuilderPageButton.addEventListener("mouseleave", () =>
  disableHoverColor(fxBuilderPageButton, fxBuilderActive)
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
  fxBuilderPageButton.style.backgroundColor = "#4C3A51";

  settingsPage.removeAttribute("hidden");
  effectsPage.setAttribute("hidden", "");
  fxBuilderPage.setAttribute("hidden", "");

  fxBuilderPageButton.setAttribute("hidden", "");

  settingsActive = true;
  effectsActive = false;
  fxBuilderActive = false;
};
const openEffectsPage = () => {
  settingsPageButton.style.backgroundColor = "#4C3A51";
  effectsPageButton.style.backgroundColor = "#774360";
  fxBuilderPageButton.style.backgroundColor = "#4C3A51";

  effectsPage.removeAttribute("hidden");
  settingsPage.setAttribute("hidden", "");
  fxBuilderPage.setAttribute("hidden", "");

  fxBuilderPageButton.removeAttribute("hidden", "");

  settingsActive = false;
  effectsActive = true;
  fxBuilderActive = false;
};

const openFxBuilderPage = () => {
  settingsPageButton.style.backgroundColor = "#4C3A51";
  effectsPageButton.style.backgroundColor = "#4C3A51";
  fxBuilderPageButton.style.backgroundColor = "#774360";

  fxBuilderPage.removeAttribute("hidden");
  settingsPage.setAttribute("hidden", "");
  effectsPage.setAttribute("hidden", "");

  settingsActive = false;
  effectsActive = false;
  fxBuilderActive = true;
};

// ----------------------------------------------------------------

// DROPDOWN
const dropdowns = document.querySelectorAll(".dropdown");
const dropdownContentPorts = document.getElementById("dropdown-content-ports");
const dropdownContentEffects = document.getElementById("dropdown-content-fx");

const dropdownSpanPorts = document.getElementById("dropdown-button-span-ports");
const dropdownSpanEffects = document.getElementById("dropdown-button-span-fx");

const connectButton = document.getElementById("connect-button");
const applyButton = document.getElementById("apply-button");

const controlGlowCheckbox = document.getElementById("control-glow-check");
const upsideDownCheckbox = document.getElementById("upside-down-check");
const fillCheckbox = document.getElementById("fill-check");

let selectedPort,
  selectedEffect = "vis1";

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
      dropdownSpanPorts.textContent = selectedPort;
    });
  }
}

const connectToPort = () => {
  if (selectedPort !== null) ipcRenderer.send("START-SERIAL", selectedPort);
  else alert("No port selected");
};

for (const dropdown of dropdowns) {
  dropdown.addEventListener("click", function (event) {
    event.stopPropagation();
    dropdown.classList.toggle("is-active");
  });
}

connectButton.addEventListener("click", function (event) {
  connectToPort();
});

window.onclick = function (event) {
  if (!event.target.matches(".dropdown"))
    for (const dropdown of dropdowns) dropdown.classList.remove("is-active");
};

// EFFECTS DROPDOWN
const effectsList = require("./effects/effects-list.js");

// default description for default selected effect vis1
const effectDescText = document.getElementById("effect-description-text");
effectDescText.textContent = Object.values(effectsList)[0].description;

for (i = 0; i < Object.keys(effectsList).length; i++) {
  let el = document.createElement("div");
  let elText = document.createElement("div");
  elText.textContent = Object.values(effectsList)[i].title;
  el.value = Object.keys(effectsList)[i];
  el.className = "dropdown-item";

  dropdownContentEffects.appendChild(el);
  el.appendChild(elText);

  el.addEventListener("click", function (event) {
    selectedEffect = el.value;
    dropdownSpanEffects.textContent = selectedEffect;

    // find the selected effect in the effects list object and get its description
    for (const [key, value] of Object.entries(effectsList)) {
      if (key == selectedEffect) effectDescText.textContent = value.description;
    }
  });
}

applyButton.addEventListener("click", () => applyEffects());

function applyEffects() {
  analyser.setCurrentEffect(
    selectedEffect,
    controlGlowCheckbox.checked,
    upsideDownCheckbox.checked,
    fillCheckbox.checked
  );

  ipcRenderer.send(
    "SET-VISUALIZER-SETTINGS",
    controlGlowCheckbox.checked,
    upsideDownCheckbox.checked,
    fillCheckbox.checked
  );

  ipcRenderer.send("VISUALIZER-HAS-PLAY-PRIORITY", true);
}

// EFFECT BUILDER

const effectBuilder = require("./UI/effect-builder.js");

const fxBuilderApply = document.getElementById("fxBuilder-apply-button");
const fxBuilderApplyAnim = document.getElementById(
  "fxBuilder-applyAnim-button"
);
const fxBuilderClear = document.getElementById("fxBuilder-clear-button");

fxBuilderApply.addEventListener("click", () =>
  effectBuilder.applyEffect(false)
);
fxBuilderApplyAnim.addEventListener("click", () =>
  effectBuilder.applyEffect(true)
);
fxBuilderClear.addEventListener("click", () => effectBuilder.clearAllPixels());

// frames

const nextFrameBtn = document.getElementById("fxBuilder-frameNextBtn");
const previousFrameBtn = document.getElementById("fxBuilder-framePreviousBtn");

nextFrameBtn.addEventListener("click", () => effectBuilder.nextFrame());
previousFrameBtn.addEventListener("click", () => effectBuilder.previousFrame());
