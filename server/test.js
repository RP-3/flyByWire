var flyByWire = require('./flybywire.js');

flyByWire('10.7.18.230', 8000, {debugMode: true}, function(m){

  m.accel.on('data', function(xyz){
    console.log(xyz);
  });

});
