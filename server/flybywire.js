var ws = require('nodejs-websocket');
var port = 8000;
var eventLibrary = require('./events.js');
var chalk = require('chalk');

var connection = ws.connect('ws://10.7.18.230:' + port, function(){
  connection.sendText('They paved paradise, to put up a parking lot.');
  console.log('sent!');
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
    console.log(chalk.bold.red("Warning: Unknown module: " + transmission.module + "."));
  }else{
    if(!eventLibrary[transmission.module].hasOwnProperty(transmission.e)){
      console.log(chalk.bold.red("Warning: Unknown event: " + transmission.e + "."));
    }else{
      console.log(chalk.yellow("recieved " + transmission.e + " event from " + transmission.module + " module."));
    }
  }

  console.log('Recieved: ' + transmission.data);
  console.log('Latency: ' + latency);
});

