var ws = require('nodejs-websocket');
var chalk = require('chalk');
var eventEmitter = require('events').EventEmitter;
var debugMode = true;

var logger = function(string, color){
  if(debugMode){
    console.log(chalk[color](string));
  }
};

module.exports = function(ip, port, options, cb){

  debugMode = options.debugMode === undefined ? true : options.debugMode;

  logger('Establishing connection...', 'yellow');

  var connection = ws.connect('ws://'+ ip +':' + port, function(){
    logger('Connection established', 'green');
  });

  var availableModules = ['ble', 'accel', 'ambient', 'audio', 'camera', 'climate', 'gprs', 'gps', 'infrared', 'sdcard', 'nrf', 'relay', 'rfid', 'servo'];
  var m = {};

  for(var i=0; i<availableModules.length; i++){
    m[availableModules[i]] = new eventEmitter();
  }

  connection.on('text', function(data){
    /*data = {
      module: the module sending the event
      e: string value representing event type
      data: data sent by event
      time: time event was sent
    }*/
    var transmission = JSON.parse(data);
    var latency = new Date() - Date.parse(transmission.time);
    m[transmission.module].emit(transmission.e, transmission.data); //emit an event for the user to listen to
  });

  cb(m);

};


