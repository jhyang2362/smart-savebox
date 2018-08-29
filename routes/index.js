var express = require('express');
var router = express.Router();

 //GET home page.
router.get('/', function(req, res, next) {
  res.render('index', { title: 'savebox' });
});

module.exports = router;

/*
var express = require('express');
var router = express.Router();
var SerialPort = require('serialport');
var Readline = SerialPort.parsers.Readline;
var parsers = SerialPort.parsers;
var parser = new parsers.Readline({
  delimiter: '\r\n'
});
var sp = new SerialPort('/dev/ttyUSB0',{

  baudRate : 9600,
  encoding : 'utf8'

});
var money = 0;
var goal = 0;
sp.pipe(parser);
//router.get('/loadcell',function(req,res){

 // res.sendfile('loadcell.ejs',{root:__dirname});

//});
router.get('/',function(req, res, next){
  res.render('loadcell',{ sum: money, title: 'SaveBox', goal: goal });
});


sp.on('open',function(){

  console.log('Serial Port OPEN');

});

sp.on('data',function(data){
  console.log('data: ',data.toString());
  money += parseInt(data);
});




module.exports = router;
*/
