var express = require('express');
var dada=require('./model/exam');
var mongoose=require('mongoose');

//connection to mongo
mongoose.connect('mongodb://localhost:27017/Diplomski');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("supeeer");
});

var myModel=mongoose.model("Exam");
// ruter za exam
var examRouter = express.Router();
// definisanje ruta za ispite
examRouter.get('/', function(req, res, next) {
    myModel.find(function (err, exams) {
        if (err) return console.error(err);
        console.log(exams);
        res.send(exams);
    });

});
examRouter.get('/add', function(req, res, next) {
    exam1= new myModel({
        points:80,
        pass:true,
        student:'admin',
        subject:'engleski'
    });
    exam1.save(
        function (err, exam) {
            if (err) return console.error(err);
            console.log(exam);
        }
    )
});


module.exports = examRouter;