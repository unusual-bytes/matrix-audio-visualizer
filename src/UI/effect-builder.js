const grid = document.getElementById("fxBuilder-grid");

// size for 4 in 1 MAX7219 Dot Matrix
const columns = 32,
  rows = 8;

let holdLeftMouseButton,
  holdRightMouseButton,
  toggleColorThroughMatrices = false;

let currentFrame = 0,
  playAnimFrame = 0;
let frames = [];
var playAnimationIntervalId;

addButtonsToGrid();

function addButtonsToGrid() {
  for (i = 0; i < columns * rows; i++) {
    let btn = document.createElement("button");
    btn.className = "fxBuilder-btn";
    btn.dataset.coordinate = i;
    btn.dataset.isUsed = 0;

    if (i % 8 == 0) toggleColorThroughMatrices = !toggleColorThroughMatrices;

    if (toggleColorThroughMatrices) btn.dataset.defaultColor = "rgb(122,67,98)";
    else btn.dataset.defaultColor = "rgb(133,75,108)";

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
  btn.style.transition = 'all 0s ease'; // instantly place pixels (no visual animation)
  btn.style.backgroundColor = "red";
  btn.dataset.isUsed = 1;
};

let deletePixels = (btn) => {
  btn.style.transition = 'all 0s ease'; // instantly delete pixels (no visual animation)
  btn.style.backgroundColor = btn.dataset.defaultColor;
  btn.dataset.isUsed = 0;
};

module.exports = {
  clearAllPixels: function clearAllPixels() {
    let btnArray = document.getElementsByClassName("fxBuilder-btn");

    for (i = 0; i < btnArray.length; i++) {
      btnArray[i].style.transition = 'all .5s ease';
      btnArray[i].style.backgroundColor = btnArray[i].dataset.defaultColor;
      btnArray[i].dataset.isUsed = 0;
    }
  },

  applyEffect: function applyEffect(isAnimation) {
    let btnArray = document.getElementsByClassName("fxBuilder-btn");
    let dataArr = [];
    clearInterval(playAnimationIntervalId);

    Array.from(btnArray).forEach((e) => dataArr.push(e.dataset.isUsed));

    ipcRenderer.send("VISUALIZER-HAS-PLAY-PRIORITY", false);

    if (!isAnimation) ipcRenderer.send("SEND-SERIAL", dataArr, true);
    else {
      const delay = parseInt(
        document.getElementById("fxBuilder-delay-input").value
      );
      // TODO: better frontend
      /* TODO: overwrite animation (on visualizer tab) or overwrite visualizer (on effects builder tab) checkbox -
          display the animation/frame set by the user only when analyser detects no audio playing. if audio plays it would overwrite any animation/frame */
      playAnimationIntervalId = setInterval(this.playAnimation, delay);
    }
  },

  playAnimation: function playAnimation() {
    // TODO: this doesnt reach last frame
    if (playAnimFrame == frames.length) playAnimFrame = 0;
    ipcRenderer.send("SEND-SERIAL", frames[playAnimFrame], true);
    playAnimFrame++;
  },

  drawFromArray: function drawFromArray(dataArr) {
    if (dataArr != undefined) {
      let btnArray = document.getElementsByClassName("fxBuilder-btn");

      for (i = 0; i < dataArr.length; i++) {
        if (dataArr[i] == 1) placePixels(btnArray[i]);
      }
    }
  },

  nextFrame: function nextFrame() {
    // get current frame
    let currentBtnArray = document.getElementsByClassName("fxBuilder-btn");
    let dataArr = [];
    Array.from(currentBtnArray).forEach((e) => dataArr.push(e.dataset.isUsed));
    // save current frame
    frames[currentFrame] = dataArr;
    // switch to next frame
    currentFrame++;
    // clear matrix and draw next frame
    this.clearAllPixels();
    this.drawFromArray(frames[currentFrame]);
    this.updateFrameText();
  },

  previousFrame: function previousFrame() {
    if (currentFrame > 0) {
      // get current frame
      let currentBtnArray = document.getElementsByClassName("fxBuilder-btn");
      let dataArr = [];
      Array.from(currentBtnArray).forEach((e) =>
        dataArr.push(e.dataset.isUsed)
      );
      // save current frame
      frames[currentFrame] = dataArr;
      // restore previous frame from array
      // display on matrix
      currentFrame--;
      this.clearAllPixels();
      this.drawFromArray(frames[currentFrame]);
      this.updateFrameText();
    }
  },

  updateFrameText: function updateFrameText() {
    document.getElementById("fxBuilder-currentFrameText").textContent =
      currentFrame;
  },
};
