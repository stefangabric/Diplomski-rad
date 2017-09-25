var express = require('express');
var professorRole = require('../model/professorRole');
var subject1 = require('../model/subject');
var user = require('../model/user');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database'); // get db config file
var jwt = require('jwt-simple');

var myModel = mongoose.model("ProfessorRole");
var professorModel = mongoose.model("User");
var subjectModel = mongoose.model("Subject");
// ruter za professorRole
var professorRoleRouter = express.Router();
// definisanje ruta za korisnike
professorRoleRouter.get('/', passport.authenticate('jwt', {session: false}), function (req, res, next) {

    myModel.find(function (err, professorRoles) {
        if (err) return console.error(err);
        res.send(professorRoles);
    }).populate('professor').populate('subject');

}).get('/:id', passport.authenticate('jwt', {session: false}), function (req, res, next) {

    myModel.findOne({"_id": req.params.id}
        , function (err, role) {
            if (err) return console.error(err);
            console.log(role);
            res.send(role);
        }).populate('professor').populate('subject');

}).post('/', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if (!decoded.role || decoded.role != 'admin') {
        return res.status(403).send({success: false, msg: 'Not allowed.'});
    }
    professorRole1 = new myModel(req.body);
    professorRole1.save(
        function (err, professorRole) {
            if (err) return console.error(err);

            console.log(professorRole);
        }
    );
    res.send(professorRole1);
}).put('/:id', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if (!decoded.role || decoded.role != 'admin') {
        return res.status(403).send({success: false, msg: 'Not allowed.'});
    }
    myModel.findOne({"_id": req.params.id}
        , function (err, professorRole) {
            if (err) next(err);
            var newProfessorRole = req.body;
            professorRole.professor = newProfessorRole.professor;
            professorRole.role = newProfessorRole.role;
            professorRole.subject = newProfessorRole.subject;
            professorRole.save(function (err, professorRole1) {
                if (err) next(err);
                res.json(professorRole1);
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
module.exports = professorRoleRouter;