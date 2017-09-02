var express = require('express');
var dada=require('../model/obligation');
var mongoose=require('mongoose');

var myModel=mongoose.model("Obligation");
// ruter za obligation
var obligationRouter = express.Router();
// definisanje ruta za obligacije
obligationRouter.get('/', function(req, res, next) {
    var pageNumber=req.params.pageNumber;
    var pageSize=1;
    myModel.paginate({}, { page: pageNumber, limit: pageSize }, function(err, result) {
        data.content=result.docs;
        data.number=result.page;
        data.totalPages=Math.ceil(result.total/result.limit);
        res.send(data);
    });

}).get('/all', function(req, res, next) {
    myModel.find(function (err, obligations) {
        if (err) return console.error(err);
        console.log(obligations);
        res.send(obligations);
    });

}).get('/getFor/:id', function(req, res, next) {

    myModel.find({ student:req.params.id},function (err, obligations) {
        if (err) return console.error(err);
        console.log(obligations);
        res.send(obligations);
    });

}).post('/',function(req, res, next) {
    obligation1= new myModel(req.body);
    obligation1.save(
        function (err, obligation) {
            if (err) return console.error(err);
            console.log(obligation);
        }
    );
    res.send(obligation1);
}).put('/:id',function(req, res, next) {
    myModel.findOne({ "_id": req.params.id}
        , function(err, obligation) {
            if (err) next(err);
            var newObligation = req.body;
            obligation.obligationType = newObligation.obligationType;
            obligation.dateOfObligation = newObligation.dateOfObligation;
            obligation.points = newObligation.points;
            obligation.subject = newObligation.subject;
            obligation.save(function(err, obligation1) {
                if (err) next(err);
                res.json(obligation1);
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

module.exports = obligationRouter;