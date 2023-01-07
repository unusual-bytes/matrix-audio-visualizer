const { SerialPort, ReadlineParser } = require('serialport')

var parser = null;
let handledSerial = false;

module.exports = {

  startSerial: function startSerial(portPath){
    const port = new SerialPort({ path: portPath, baudRate: 115200, lock: false })
    global.port = port;
    parser = new ReadlineParser()
    port.pipe(parser)

    checkForDataReceive();
    handledSerial = true;
  },

  sendDataOverSerial: function sendDataOverSerial(dataArr){
    if(handledSerial) {
      if(global.port != null) {
        global.port.write(`9,0,0\n`) // 9 as address means CLEAR
        global.port.write(`1,${scale(dataArr[2], 0, 255, 0, 8)},0\n`) // test values

        //console.log("should write")
      } else{
        console.log("waiting for global.port")
      }
    }
  }
}

function checkForDataReceive(){
  if(parser != null) parser.on('data', console.log)
}

// `${scale(dataArr[2], 0, 255, 0, 8)}\n`

function scale (number, inMin, inMax, outMin, outMax) {
  return parseInt((number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin);
}