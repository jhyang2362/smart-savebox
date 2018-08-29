var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var SerialPort = require('serialport');
var Readline = SerialPort.parsers.Readline;
var parsers = SerialPort.parsers;
var parser = new parsers.Readline({
  delimiter: '\n'
});

var sp = new SerialPort('/dev/ttyUSB0',{

  baudRate : 9600,
  encoding : 'utf8'

});

//DB setting
mongoose.connect('mongodb://localhost:27017/savebox');
var db = mongoose.connection;
db.once("open",function(){
  console.log("DB connected");
});
db.on("error", function(err){
  console.log("DB ERROR : ",err);
});
var Schema = mongoose.Schema;

var goalSchema = new Schema({
  name : String,
  money : Number
});
var saveSchema = new Schema({
  money : Number,
  date : {type : Date, default : Date.now}
});

var goals = mongoose.model('goals', goalSchema);
var saves = mongoose.model('saves', saveSchema);

goals.findOne({name:"Goal"},function(err,data){
  if(err) return console.log("Data ERROR:", err);
  if(!data){
    goals.create({name:"Goal",money:0},function(err,data){
      if(err) return console.log("Data ERROR: ", err);
    });
  }
});

sp.pipe(parser);

router.get('/',function(req, res, next){
  goals.findOne({name:"Goal"}, function(err,data){
    if(err) return console.log("Data ERROR: ",err);
    saves.aggregate(
      [{$group:
      {_id:'null', total: {$sum: "$money"}}
    }]).exec(function(err,result){
      if(err) return console.log("Data ERROR: ",err);
      res.render('loadcell',{ sum: result[0]['total'], title: 'SaveBox', goal: data.money });
    });
  });
});
router.post('/', function(req,res, next){
  goals.findOne({name:"Goal"}, function(err,data){
    if(err) return console.log("Data ERROR: ",err);
    data.money = req.body.goal_money;
    data.save(function(err){
      if(err) return console.log("Data ERROR: ",err);
      saves.aggregate(
        [{$group:
        {_id: null, total: {$sum: "$money"}}
      }]).exec(function(err,result){
        if(err) return handleError(err);
        res.render('loadcell',{ sum: result[0]['total'], title: 'SaveBox', goal: data.money });

      });
    });
  });
});
router.get('/goalmoney',function(req,res, next){
  res.render('goal_money',{title: 'SaveBox', goal: goals});
});

sp.on('open',function(){

  console.log('Serial Port OPEN');
});

sp.on('data',function(data){

  var temp = parseInt(data);
  if(temp>=5&&temp<=500){
    saves.create({money:temp},function(err,data){
      if(err) return console.log("Data ERROR: ", err);
    });

   }
});

module.exports = router;
