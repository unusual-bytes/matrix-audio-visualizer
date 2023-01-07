const { SerialPort, ReadlineParser } = require('serialport')

var parser = null;
let handledSerial = false;

module.exports = {

  startSerial: function startSerial(portPath){
    const port = new SerialPort({ path: 'COM6', baudRate: 115200, lock: false })
    global.port = port;
    parser = new ReadlineParser()
    port.pipe(parser)

    checkForDataReceive();
    handledSerial = true;
  },

  sendDataOverSerial: function sendDataOverSerial(dataArr){
    if(handledSerial) {
      if(global.port != null) {
        global.port.write('test\n', function(err) {
          if (err) {
            return console.log('Error on write: ', err.message)
          }
        })
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
