var ws = require("nodejs-websocket");
var port = 8000;
var eventLibrary = require('./events.js');

require('tesselate')(['ambient-attx4'], function(tessel, m){

  var server = ws.createServer(function(connection){
    console.log("new connection!");

    connection.on('close', function(code, reason){
      console.log('connection closed :"(');
    });

    connection.on('text', function(str){
      console.log("Recieved: " + str);
    });


    var transmissionMaker = function(module, evnt){
      var transmission = {
        module: module,
        e: evnt
      };

      return function(data){
        transmission.time = new Date().toString();
        transmission.data = data;
        connection.sendText(JSON.stringify(transmission));
      };

    };

    for(var module in m){
      var events = eventLibrary[module];
      for(var e in events){
        var transmit = transmissionMaker(module, e);
        m[module].on(e, transmit);
      }
    }

  }).listen(port);
  console.log('listening on ' + port);
  console.log(require('os').networkInterfaces().en1[0].address);

});

/*
TESSEL API
var flyByWire = require('flyByWire')('tessel');
require('tesselate')(['accel-mma84'], flyByWire);

LAPTOP API
var Odyssey = require('flyByWire')('missionControl');

Odyssey.m -> points to modules on tessel
Odyssey.m.accel -> points to accel
Odyssey.tessel -> points to tessel itself

*/
