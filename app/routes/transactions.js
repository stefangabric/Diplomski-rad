var express = require('express');
var dada = require('../model/transaction');
var mongoose = require('mongoose');

var passport = require('passport');
var config = require('../config/database'); // get db config file
var jwt = require('jwt-simple');

var myModel = mongoose.model("Transaction");


var passport = require("passport");
var passportJWT = require("passport-jwt");

// ruter za transaction
var transactionRouter = express.Router();
// definisanje ruta za transakcije
transactionRouter.get('/', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if (!decoded.role || decoded.role != 'admin') {
        return res.status(403).send({success: false, msg: 'Not allowed.'});
    }
    myModel.find(function (err, transactions) {
        if (err) return console.error(err);
        console.log(transactions);
        res.send(transactions);
    }).populate('student');

}).get('/getFor/:student', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if (!(decoded.role == 'admin' || decoded.role == 'student')) {
        return res.status(403).send({success: false, msg: 'Not allowed.'});
    }

    myModel.find({student: req.params.student}, function (err, subjects) {
        if (err) return console.error(err);
        console.log(subjects);
        res.send(subjects);
    }).populate('student');

}).post('/', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if (!(decoded.role == 'admin' || decoded.role == 'student')) {
        return res.status(403).send({success: false, msg: 'Not allowed.'});
    }
    transaction1 = new myModel(req.body);

    transaction1.save(
        function (err, transaction) {
            if (err) return console.error(err);
            console.log(transaction);
        }
    );
    res.send(transaction1);
}).put('/:id', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if (!decoded.role || decoded.role != 'admin') {
        return res.status(403).send({success: false, msg: 'Not allowed.'});
    }
    myModel.findOne({"_id": req.params.id}
        , function (err, transaction) {
            if (err) next(err);
            console.log(req.body);
            var newTransaction = req.body;
            transaction.purpose = newTransaction.purpose;
            transaction.bankAccount = newTransaction.bankAccount;
            transaction.price = newTransaction.price;
            transaction.recipient = newTransaction.recipient;
            transaction.student = newTransaction.student;
            transaction.save(function (err, transaction1) {
                if (err) next(err);
                res.json(transaction1);
            });

        });
}).delete('/:id', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if (!decoded.role || decoded.role != 'admin') {
        return res.status(403).send({success: false, msg: 'Not allowed.'});
    }
    myModel.remove({
        "_id": req.params.id
    }, function (err, successIndicator) {
        if (err) next(err);
        res.json(successIndicator);
    });
});

var getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1].replace(/['"]+/g, '');
        } else {
            return null;
        }
    } else {
        return null;
    }
};
module.exports = transactionRouter;