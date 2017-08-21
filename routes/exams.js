var express = require('express');
var dada=require('./model/exam');
var mongoose=require('mongoose');



var myModel=mongoose.model("Exam");
// ruter za exam
var examRouter = express.Router();
// definisanje ruta za ispite
examRouter.get('/', function(req, res, next) {
    myModel.find(function (err, exam) {
        if (err) return console.error(err);
        console.log(exam);
        res.send(exam);
    });

}).get('/getFor/:id', function(req, res, next) {
    myModel.find({ student:req.params.id},function (err, exam) {
        if (err) return console.error(err);
        console.log(exam);
        res.send(exam);
    });

}).post('/',function(req, res, next) {
    exam1= new myModel(req.body);
    exam1.save(
        function (err, exam) {
            if (err) return console.error(err);
            console.log(exam);
        }
    );
    res.send(exam1);
}).put('/:id',function(req, res, next) {
    myModel.findOne({ "_id": req.params.id}
        , function(err, exam) {
            if (err) next(err);
            var newExam = req.body;
            exam.points = newExam.points;
            exam.pass = newExam.pass;
            exam.student = newExam.student;
            exam.subject = newExam.subject;
            exam.save(function(err, exam1) {
                if (err) next(err);
                res.json(exam1);
            });

        });
}).delete('/:id', function(req, res, next) {
    myModel.remove({
        "_id": req.params.id
    }, function(err, successIndicator) {
        if (err) next(err);
        res.json(successIndicator);
    });
});


module.exports = examRouter;