const grid = document.getElementById("fxBuilder-grid");

// size for 4 in 1 MAX7219 Dot Matrix
const columns = 32,
  rows = 8;

let holdLeftMouseButton,
  holdRightMouseButton,
  toggleColorThroughMatrices = false;

addButtonsToGrid();

function addButtonsToGrid() {
  for (i = 0; i < columns * rows; i++) {
    let btn = document.createElement("button");
    btn.className = "fxBuilder-btn";
    btn.dataset.coordinate = i;
    btn.dataset.isUsed = 0;

    if (i % 8 == 0) toggleColorThroughMatrices = !toggleColorThroughMatrices;

    if (toggleColorThroughMatrices) btn.dataset.defaultColor = "white";
    else btn.dataset.defaultColor = "rgb(220,220,230)";

    btn.style.backgroundColor = btn.dataset.defaultColor;

    grid.appendChild(btn);

    window.onmousedown = function (event) {
      if (event.button == 0) holdLeftMouseButton = true;
      if (event.button == 2) holdRightMouseButton = true;
    };

    window.onmouseup = function (event) {
      if (event.button == 0) holdLeftMouseButton = false;
      if (event.button == 2) holdRightMouseButton = false;
    };

    btn.onmousedown = function (event) {
      if (event.button == 0) placePixels(btn);
      if (event.button == 2) deletePixels(btn);
    };

    btn.onmouseenter = function (event) {
      if (holdLeftMouseButton) placePixels(btn);

      if (holdRightMouseButton) deletePixels(btn);
    };
  }
}

let placePixels = (btn) => {
  btn.style.backgroundColor = "red";
  btn.dataset.isUsed = 1;
  console.log(btn.dataset.coordinate);
};

let deletePixels = (btn) => {
  btn.style.backgroundColor = btn.dataset.defaultColor;
  btn.dataset.isUsed = 0;
};

module.exports = {
  clearAllPixels: function clearAllPixels() {
    let btnArray = document.getElementsByClassName("fxBuilder-btn");

    for (i = 0; i < btnArray.length; i++) {
      btnArray[i].style.backgroundColor = btnArray[i].dataset.defaultColor;
      btnArray[i].dataset.isUsed = 0;
    }
  },

  applyEffect: function applyEffect() {
    let btnArray = document.getElementsByClassName("fxBuilder-btn");
    let dataArr = [];
    Array.from(btnArray).forEach((e) => dataArr.push(e.dataset.isUsed));

    let data = dataArr.join("");

    ipcRenderer.send("SEND-SERIAL", dataArr, true);
  },
};
