var express = require('express');
var dada=require('./model/transaction');
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

});
transactionRouter.get('/add', function(req, res, next) {
    transaction1= new myModel({
        purpose:'ispit',
        bankAccount:'223332232323',
        price:2000,
        recipient:'ftn',
        student:'admin'
    });
    transaction1.save(
        function (err, transaction) {
            if (err) return console.error(err);
            console.log(transaction);
        }
    )
    res.send(tranaction1);
});

module.exports = transactionRouter;