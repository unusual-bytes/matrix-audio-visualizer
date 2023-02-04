const canvas = document.getElementById("visualizer-canvas");
var ctx = canvas.getContext("2d");

// size for 4 in 1 MAX7219 Dot Matrix
let matrixWidth = 32;
let matrixHeight = 8;

const dotsMargin = 15;

const drawMatrixBase = (width, height) => {
  let newRowSpacing = 0;
  ctx.fillStyle = "#000000";

  for (x = 0; x < width * dotsMargin; x += dotsMargin) {
    if (x % (8 * dotsMargin) == 0) newRowSpacing += 4;

    for (y = 0; y < height * dotsMargin; y += dotsMargin) {
      ctx.fillRect(x + newRowSpacing, y, 2, 2);
    }
  }
};

const writePixel = (writeX, writeY, width, height) => {
  let newRowSpacing = 0;
  for (countRow = 0; countRow <= writeX; countRow++) {
    if (countRow % 8 == 0) newRowSpacing += 4;
  }

  ctx.fillStyle = "#ff4938";
  ctx.fillRect(writeX * dotsMargin + newRowSpacing, writeY * dotsMargin, 6, 6);
};

module.exports = visualizeAudio = (msgArr) => {
  console.log("hi");
};

drawMatrixBase(matrixWidth, matrixHeight);
//for (i = 0; i < 32; i++) writePixel(i, 7, matrixWidth, matrixHeight);

let setMatrix = true;

ipcRenderer.on("IS_FOCUS", (event, isFocused) => {
  setMatrix = isFocused;
}),
  ipcRenderer.on("SET_MATRIX", (event, data, upsideDown) => {
    if (setMatrix) {
      let msg = [];

      if (upsideDown) data.forEach((e) => msg.push(scale(e, 0, 255, 7, 0)));
      else data.forEach((e) => msg.push(scale(e, 0, 255, 0, 7)));

      msg = msg.toString().replaceAll(",", "");

      //console.log(msg);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawMatrixBase(matrixWidth, matrixHeight);
      for (x = 0; x < msg.length; x++) {
        writePixel(x, 7 - msg[x], matrixWidth, matrixHeight);
      }
    }
  });

function scale(number, inMin, inMax, outMin, outMax) {
  return parseInt(
    ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
  );
}
