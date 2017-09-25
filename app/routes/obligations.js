var express = require('express');
var obligation = require('../model/obligation');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database'); // get db config file
var jwt = require('jwt-simple');
var myModel = mongoose.model("Obligation");
// ruter za obligation
var obligationRouter = express.Router();
// definisanje ruta za obligacije
obligationRouter.get('/', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if (!decoded.role || decoded.role != 'admin') {
        return res.status(403).send({success: false, msg: 'Not allowed.'});
    }
    var pageNumber = req.params.pageNumber;
    var pageSize = 1;
    myModel.paginate({}, {page: pageNumber, limit: pageSize}, function (err, result) {
        data.content = result.docs;
        data.number = result.page;
        data.totalPages = Math.ceil(result.total / result.limit);
        res.send(data);
    }).populate('subject');

}).get('/all', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if (!(decoded.role == 'admin' || decoded.role == 'professor')) {
        return res.status(403).send({success: false, msg: 'Not allowed.'});
    }
    myModel.find(function (err, obligations) {
        if (err) return console.error(err);
        console.log(obligations);
        res.send(obligations);
    }).populate('subject');

}).get('/getFor/:id', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if (!(decoded.role == 'admin' || decoded.role == 'professor')) {
        return res.status(403).send({success: false, msg: 'Not allowed.'});
    }
    myModel.find({subject: req.params.id}, function (err, obligations) {
        if (err) return console.error(err);
        console.log(obligations);
        res.send(obligations);
    }).populate('subject');

}).post('/', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if (!(decoded.role == 'admin' || decoded.role == 'professor')) {
        return res.status(403).send({success: false, msg: 'Not allowed.'});
    }
    obligation1 = new myModel(req.body);
    obligation1.save(
        function (err, obligation) {
            if (err) return console.error(err);
            console.log(obligation);
        }
    );
    res.send(obligation1);
}).put('/:id', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if (!(decoded.role == 'admin' || decoded.role == 'professor')) {
        return res.status(403).send({success: false, msg: 'Not allowed.'});
    }
    myModel.findOne({"_id": req.params.id}
        , function (err, obligation) {
            if (err) next(err);
            var newObligation = req.body;
            obligation.obligationType = newObligation.obligationType;
            obligation.dateOfObligation = newObligation.dateOfObligation;
            obligation.points = newObligation.points;
            obligation.subject = newObligation.subject;
            obligation.save(function (err, obligation1) {
                if (err) next(err);
                res.json(obligation1);
            });

        });
}).delete('/:id', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if (!(decoded.role == 'admin' || decoded.role == 'professor')) {
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
module.exports = obligationRouter;