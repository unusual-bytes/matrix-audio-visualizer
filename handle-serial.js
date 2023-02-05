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
      if (global.port != null || global.port != undefined) {
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
              .forEach((e) => msg.push(scale(e, 0, 1, 7, 0)));
          } else {
            dataArr
              .slice()
              .reverse()
              .forEach((e) => msg.push(scale(e, 0, 1, 0, 7)));
          }

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

  setVisualizerSettings: function setVisualizerSettings(
    setControlGlow,
    setUpsideDown,
    setFill
  ) {
    if (global.port != null || global.port != undefined) {
      if (setControlGlow) global.port.write(`c1\n`);
      else global.port.write(`c0\n`);

      if (setUpsideDown) global.port.write(`u1\n`);
      else global.port.write(`u0\n`);

      if (setFill) global.port.write(`f1\n`);
      else global.port.write(`f0\n`);
    } else {
      console.log("waiting for global.port");
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
