var ws = require('nodejs-websocket');
var port = 8000;
var eventLibrary = require('./eventsLibrary.js');
var chalk = require('chalk');

var eventEmitter = require('events').EventEmitter;

var connection = ws.connect('ws://10.7.18.230:' + port, function(){
  connection.sendText('They paved paradise, to put up a parking lot.');
  console.log('sent!');
});

var availableModules = ['ble', 'accel', 'ambient', 'audio', 'camera', 'climate', 'gprs', 'gps', 'infrared', 'sdcard', 'nrf', 'relay', 'rfid', 'servo'];
var modules = {};

for(var i=0; i<availableModules.length; i++){
  modules[availableModules[i]] = new eventEmitter();
}

//just for testing
modules.accel.on('data', function(xyz){
  console.log(xyz);
});

connection.on('text', function(data){
  /*data = {
    module: the module sending the event
    e: string value representing event type
    data: data sent by event
    time: time event was sent
  }*/
  var transmission = JSON.parse(data);
  var latency = new Date() - Date.parse(transmission.time);

  var evnt = transmission.e;

  if(!eventLibrary.hasOwnProperty(transmission.module)){
    //log an error if the module is not registered
    console.log(chalk.bold.red("Warning: Unknown module: " + transmission.module + "."));
  }else{
    if(!eventLibrary[transmission.module].hasOwnProperty(transmission.e)){
      //log an error if the event is not registered
      console.log(chalk.bold.red("Warning: Unknown event: " + transmission.e + "."));
    }else{
      //log an informative message describing the event
      console.log(chalk.yellow("recieved " + transmission.e + " event from " + transmission.module + " module."));

      //emit an event for the user to listen to
      modules[transmission.module].emit(transmission.e, transmission.data);

    }
  }


});

