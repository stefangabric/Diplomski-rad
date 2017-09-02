var express = require('express');
var dada=require('../model/transaction');
var mongoose=require('mongoose');


var myModel=mongoose.model("Transaction");

// ruter za transaction
var transactionRouter = express.Router();
// definisanje ruta za transakcije
transactionRouter.get('/', function(req, res, next) {
    myModel.find(function (err, transactions) {
        if (err) return console.error(err);
        console.log(transactions);
        res.send(transactions);
    });

}).get('/getFor/:student', function(req, res, next) {


    myModel.find({ student:req.params.student},function (err, subjects) {
         if (err) return console.error(err);
         console.log(subjects);
         res.send(subjects);
     });

}).post('/',function(req, res, next) {
    transaction1= new myModel(req.body);
    transaction1.save(
        function (err, transaction) {
            if (err) return console.error(err);
            console.log(transaction);
        }
    );
    res.send(transaction1);
}).put('/:id',function(req, res, next) {
    myModel.findOne({ "_id": req.params.id}
        , function(err, transaction) {
            if (err) next(err);
            var newTransaction = req.body;
            transaction.purpose= newTransaction.purpose;
            transaction.bankAccount = newTransaction.bankAccount;
            transaction.price = newTransaction.price;
            transaction.recipient = newTransaction.recipient;
            transaction.student = newTransaction.student;
            transaction.save(function(err, transaction1) {
                if (err) next(err);
                res.json(transaction1);
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

module.exports = transactionRouter;