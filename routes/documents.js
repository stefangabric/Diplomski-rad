var express = require('express');
var dada=require('./model/document');
var mongoose=require('mongoose');

var myModel=mongoose.model("Document");
// ruter za document
var documentRouter = express.Router();
// definisanje ruta za dokumente
documentRouter.get('/',function(req, res, next) {
    myModel.
    myModel.find(function (err, documents) {
        if (err) return console.error(err);
        console.log(documents);
        res.send(documents);
    });

}).get('/:id',function(req, res, next) {
    myModel.findOne({ "_id": req.params.id}
        ,function (err, document) {
        if (err) return console.error(err);
        console.log(document);
        res.send(document);
    });

}).get('/getFor/:student',function(req, res, next) {
    //nemam pojma jel radi

    myModel.find({ "student": req.params.student}
        ,function (err, document) {
        if (err) return console.error(err);
        console.log(document);
        res.send(document);
    });

}).post('/',function(req, res, next) {
    document1= new myModel(req.body);
    document1.save(
        function (err, document) {
            if (err) return console.error(err);
            console.log(document);
        }
    )
    res.send(document1);
}).put('/:id',function(req, res, next) {
    myModel.findOne({ "_id": req.params.id}
        , function(err, document) {
            if (err) next(err);
            var newDocument = req.body;
            document.name = newDocument.name;
            document.path = newDocument.path;
            document.student = newDocument.student;
            document.save(function(err, document1) {
                if (err) next(err);
                res.json(document1);
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

module.exports = documentRouter;