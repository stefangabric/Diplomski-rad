var express = require('express');
var dada=require('./model/subject');
var mongoose=require('mongoose');


var myModel=mongoose.model("Subject");
// ruter za subject
var subjectRouter = express.Router();
// definisanje ruta za predmete
subjectRouter.get('/', function(req, res, next) {
    var filter=req.query.text;
    var pageNumber=req.query.pageNumber;
    var pageSize=5;
    if(req.params.text==undefined){
        filter="";
    }
    var data={};
    myModel.paginate({name:{$regex : filter }}, { page: pageNumber, limit: pageSize }, function(err, result) {
        data.content=result.docs;
        data.number=result.page;
        data.totalPages=Math.ceil(result.total/result.limit);
        res.send(data);
    });

}).get('/all', function(req, res, next) {
    myModel.find(function (err, subjects) {
        if (err) return console.error(err);
        console.log(subjects);
        res.send(subjects);
    });

}).get('/getFor/:id', function(req, res, next) {


   /* myModel.find({ student:req.params.id},function (err, subjects) {
        if (err) return console.error(err);
        console.log(subjects);
        res.send(subjects);
    });*/

}).post('/',function(req, res, next) {
    subject1= new myModel(req.body);
    subject1.save(
        function (err, subject) {
            if (err) return console.error(err);
            console.log(subject);
        }
    );
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