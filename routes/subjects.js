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

}).post('/',function(req, res, next) {
    subject1= new myModel(req.body);
    subject1.save(
        function (err, subject) {
            if (err) return console.error(err);
            console.log(subject);
        }
    )
    res.send(subject1);
}).put('/:id',function(req, res, next) {
    myModel.findOne({ "_id": req.params.id}
        , function(err, subject) {
            if (err) next(err);
            var newSubject = req.body;
            subject.name = newSubject.name;
            subject.semester = newSubject.semester;
            subject.professorRole = newSubject.professorRole;

            subject.save(function(err, subject1) {
                if (err) next(err);
                res.json(subject1);
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
module.exports = subjectRouter;