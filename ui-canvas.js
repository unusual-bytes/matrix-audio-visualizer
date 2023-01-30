const canvas = document.getElementById("visualizer-canvas");
var ctx = canvas.getContext("2d");

let dotsMargin = 15;
let newRowSpacing = 0;

for (x = 0; x < 32 * dotsMargin; x += dotsMargin) {
  if (x % 8 == 0) newRowSpacing += 4;

  for (y = 0; y < 8 * dotsMargin; y += dotsMargin) {
    ctx.fillRect(x + newRowSpacing, y, 2, 2);
  }
}
