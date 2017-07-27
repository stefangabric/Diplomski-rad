var express = require('express');
var dada=require('./model/exam');
var mongoose=require('mongoose');



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
examRouter.post('/add', function(req, res, next) {
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
    res.send(exam1);
});


module.exports = examRouter;