const { SerialPort, ReadlineParser, ipcRenderer } = require("serialport");

var parser = null;
let isAudioQuiet = false;
let handledSerial = false;

module.exports = {
  startSerial: function startSerial(portPath) {
    if (!handledSerial) {
      const port = new SerialPort({
        path: portPath,
        baudRate: 230400,
        lock: false,
      });
      global.port = port;
      parser = new ReadlineParser();
      port.pipe(parser);

      handledSerial = true;
      port.on("error", function (err) {
        handledSerial = false;
        console.log("Error: ", err.message);
      });
      checkForDataReceive();
    }
    console.log(handledSerial);
    module.exports.hasConnected = handledSerial.toString();
  },

  sendDataOverSerial: function sendDataOverSerial(dataArr, upsideDown) {
    if (handledSerial) {
      if (global.port != null) {
        if (dataArr.every((v) => v === 0)) {
          if (!isAudioQuiet) global.port.write(`0`);
          isAudioQuiet = true;
        } else {
          let msg = [];

          // if using LEDMatrixDriver

          if (upsideDown) {
            dataArr
              .slice()
              .reverse()
              .forEach((e) => msg.push(scale(e, 0, 255, 7, 0)));
          } else {
            dataArr
              .slice()
              .reverse()
              .forEach((e) => msg.push(scale(e, 0, 255, 0, 7)));
          }

          // Low Frequencies spectrum, with fftSize to 512
          // for(i = 4; i < 36; i++){
          //   msg.push(scale(dataArr[i], 0, 255, 0, 7));
          // }
          //msg.split("").reverse().join("")

          // if using MD_MAX72xx
          // dataArr.forEach(e => msg.push(scale(e, 0, 255, 0, 7)))

          msg = msg.toString().replaceAll(",", "");
          global.port.write(`${msg}\n`); // TODO: send data in bytes instead
          isAudioQuiet = false;
        }
      } else {
        console.log("waiting for global.port");
      }
    }
  },

  getAvailablePorts: (getAvailablePorts = () => {
    return SerialPort.list();
  }),
};

function checkForDataReceive() {
  if (parser != null) parser.on("data", console.log);
}

function scale(number, inMin, inMax, outMin, outMax) {
  return parseInt(
    ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
  );
}
