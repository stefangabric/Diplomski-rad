var express = require('express');
var dada=require('./model/subject');
var mongoose=require('mongoose');


var myModel=mongoose.model("Subject");
// ruter za subject
var subjectRouter = express.Router();
// definisanje ruta za predmete
subjectRouter.get('/', function(req, res, next) {
    myModel.find(function (err, subjects) {
        if (err) return console.error(err);
        console.log(subjects);
        res.send(subjects);
    });

});
subjectRouter.post('/add', function(req, res, next) {
    subject1= new myModel({
        name:'admin',
        semester:'2',
        professorRole:'profesor'
    });
    subject1.save(
        function (err, subject) {
            if (err) return console.error(err);
            console.log(subject);
        }
    )
    res.send(subject1);
});

subjectRouter.post('/token', function(req, res, next) {
    console.log("ovde");


});
module.exports = subjectRouter;