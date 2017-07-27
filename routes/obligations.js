var express = require('express');
var dada=require('./model/obligation');
var mongoose=require('mongoose');

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
obligationRouter.post('/add', function(req, res, next) {
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
    res.send(obligation1);
});

module.exports = obligationRouter;