var express = require('express');
var examm = require('../model/exam');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database'); // get db config file
var jwt = require('jwt-simple');

var myModel = mongoose.model("Exam");
// ruter za exam
var examRouter = express.Router();
// definisanje ruta za ispite
examRouter.get('/', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if (!decoded.role || decoded.role != 'admin') {
        return res.status(403).send({success: false, msg: 'Not allowed.'});
    }
    myModel.find(function (err, exam) {
        if (err) return console.error(err);
        console.log(exam);
        res.send(exam);
    }).populate('student').populate('subject');

}).get('/getFor/:student', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    console.log(decoded.role);
    if (!(decoded.role == 'admin' || decoded.role == 'student')) {
        return res.status(403).send({success: false, msg: 'Not allowed.'});
    }
    myModel.find({student: req.params.student}, function (err, subjects) {
        if (err) return console.error(err);
        console.log(subjects);
        res.send(subjects);
    }).populate('student').populate('subject');

}).post('/', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if (!(decoded.role == 'admin' || decoded.role == 'professor')) {
        return res.status(403).send({success: false, msg: 'Not allowed.'});
    }
    exam1 = new myModel(req.body);
    exam1.save(
        function (err, exam) {
            if (err) return console.error(err);
            console.log(exam);
        }
    );
    res.send(exam1);
}).put('/:id', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    myModel.findOne({"_id": req.params.id}
        , function (err, exam) {
            if (err) next(err);
            var newExam = req.body;
            exam.points = newExam.points;
            exam.pass = newExam.pass;
            exam.student = newExam.student;
            exam.subject = newExam.subject;
            exam.save(function (err, exam1) {
                if (err) next(err);
                res.json(exam1);
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

module.exports = examRouter;