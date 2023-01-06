const { SerialPort, ReadlineParser } = require('serialport')

var parser = null;

module.exports = function startSerial(portPath){
  const port = new SerialPort({ path: portPath, baudRate: 9600 })
  parser = new ReadlineParser()
  port.pipe(parser)
}

if(parser != null) parser.on('data', console.log)

