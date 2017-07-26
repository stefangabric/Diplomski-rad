var express = require('express');
var dada=require('./model/obligation');
var mongoose=require('mongoose');

//connection to mongo
mongoose.connect('mongodb://localhost:27017/Diplomski');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("supeeer");
});

var myModel=mongoose.model("Obligation");
// ruter za obligation
var obligationRouter = express.Router();
// definisanje ruta za obligacije
obligationRouter.get('/', function(req, res, next) {
    myModel.find(function (err, obligations) {
        if (err) return console.error(err);
        console.log(obligations);
        res.send(obligations);
    });

});
obligationRouter.get('/add', function(req, res, next) {
    obligation1= new myModel({
        obligationType:'kolokvijum',
        dateOfObligation:null,
        points:'50',
        subject:'engleski'
    });
    obligation1.save(
        function (err, obligation) {
            if (err) return console.error(err);
            console.log(obligation);
        }
    )
});

module.exports = obligationRouter;