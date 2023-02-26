const grid = document.getElementById("fxBuilder-grid");

// size for 4 in 1 MAX7219 Dot Matrix
const columns = 32,
  rows = 8;

let holdLeftMouseButton,
  holdRightMouseButton = false;

for (i = 0; i < columns * rows; i++) {
  let btn = document.createElement("button");
  btn.className = "fxBuilder-btn";
  btn.dataset.coordinate = i;
  grid.appendChild(btn);

  btn.onmousedown = function (event) {
    if (event.button == 0) {
      placePixels(btn);
      holdLeftMouseButton = true;
    }

    if (event.button == 2) {
      deletePixels(btn);
      holdRightMouseButton = true;
    }
  };

  btn.onmouseup = function (event) {
    if (event.button == 0) holdLeftMouseButton = false;

    if (event.button == 2) holdRightMouseButton = false;
  };

  btn.onmouseenter = function (event) {
    if (holdLeftMouseButton) {
      placePixels(btn);
    }

    if (holdRightMouseButton) {
      deletePixels(btn);
    }
  };
}

function placePixels(btn) {
  btn.style.backgroundColor = "red";
}

function deletePixels(btn) {
  btn.style.backgroundColor = "white";
}
