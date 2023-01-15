const { SerialPort, ReadlineParser } = require('serialport')

var parser = null;
let handledSerial = false;
let isAudioQuiet = false;

module.exports = {

  startSerial: function startSerial(portPath){
    const port = new SerialPort({ path: portPath, baudRate: 230400, lock: false })
    global.port = port;
    parser = new ReadlineParser()
    port.pipe(parser)

    checkForDataReceive();
    handledSerial = true;
  },

  sendDataOverSerial: function sendDataOverSerial(dataArr){
    if(handledSerial) {
      if(global.port != null) {
        if(dataArr.every(v => v === 0)) {
          if(!isAudioQuiet) global.port.write(`0`);
          isAudioQuiet = true;
        } else {
          let msg = [];

          // if using LEDMatrixDriver
          dataArr.slice().reverse().forEach(e => msg.push(scale(e, 0, 255, 0, 7))) 

          // Low Frequencies spectrum, with fftSize to 512
          // for(i = 4; i < 36; i++){
          //   msg.push(scale(dataArr[i], 0, 255, 0, 7));
          // }
          //msg.split("").reverse().join("")

          // if using MD_MAX72xx
          // dataArr.forEach(e => msg.push(scale(e, 0, 255, 0, 7))) 
          
          msg = msg.toString().replaceAll(',', '')
          global.port.write(`${msg}\n`) // TODO: send data in bytes instead
          isAudioQuiet = false;
        }

      } else{
        console.log("waiting for global.port")
      }
    }
  },

  getAvailablePorts: getAvailablePorts = () => { return SerialPort.list() }
}

function checkForDataReceive(){
  if(parser != null) parser.on('data', console.log)
}

function scale (number, inMin, inMax, outMin, outMax) {
  return parseInt((number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin);
}