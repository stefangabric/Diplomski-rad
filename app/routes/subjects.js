var express = require('express');
var subject11 = require('../model/subject');
var user = require('../model/user');
var mongoose = require('mongoose');

var passport = require('passport');
var config = require('../config/database'); // get db config file
var jwt = require('jwt-simple');

var professorModel = mongoose.model("User");
var myModel = mongoose.model("Subject");
// ruter za subject
var subjectRouter = express.Router();
// definisanje ruta za predmete
subjectRouter.get('/', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if (!decoded.role || decoded.role != 'admin') {
        return res.status(403).send({success: false, msg: 'Not allowed.'});
    }
    var filter = req.query.text;
    var pageNumber = req.query.pageNumber;
    var pageSize = 5;
    if (req.params.text == undefined) {
        filter = "";
    }
    var data = {};
    myModel.paginate({name: {$regex: filter}}, {page: pageNumber, limit: pageSize}, function (err, result) {
        data.content = result.docs;
        data.number = result.page;
        data.totalPages = Math.ceil(result.total / result.limit);
        res.send(data);
    });

}).get('/all', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    myModel.find(function (err, subjects) {
        if (err) return console.error(err);
        res.send(subjects);
    }).populate('students').populate('professorRole');

}).get('/:id', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    myModel.findOne({"_id": req.params.id}
        , function (err, subject) {
            if (err) return console.error(err);
            res.send(subject);
        }).populate('subjects').populate('students').populate('professorRole');

}).get('/getForS/:student', passport.authenticate('jwt', {session: false}), function (req, res, next) {

    //ovo bi trebalo da radi ali ne radi
    /*myModel.find({students: req.params.student},function (err, nesto) {
         if (err) return console.error(err);
         console.log(nesto);
         res.send(nesto);
     }).populate("students").populate('professorRole');
*/
    var subjects1 = [];
    var subjectsFilter = [];
    myModel.find({}
        , function (err, subjects) {
            if (err) return console.error(err);
            subjects1 = subjects;
        }).exec(function () {
        console.log(req.params.student);
        console.log(subjects1[0]);
        for (var i in subjects1) {
            if (subjects1[i].students.indexOf(req.params.student) != -1) {
                subjectsFilter.push(subjects1[i]);
            }
        }
        res.send(subjectsFilter);
    });
}).get('/getForP/:professor', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    /*myModel.find({professors: req.params.professor},function (err, nesto) {
           if (err) return console.error(err);
           console.log(nesto);
           res.send(nesto);
       }).populate("professors").populate('professorRole');
  */
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if (!(decoded.role == 'admin' || decoded.role == 'professor')) {
        return res.status(403).send({success: false, msg: 'Not allowed.'});
    }
    professorModel.findOne({"_id": req.params.professor}, function (err, professor) {
        if (err) return console.error(err);
        var subjects1 = [];
        var subjectsFilter = [];
        myModel.find({}
            , function (err, subjects) {
                if (err) return console.error(err);
                subjects1 = subjects;
            }).exec(function () {
            for (role in professor.professorRoles) {
                for (subject in subjects1) {
                    if (subjects1[subject].professorRoles.indexOf(professor.professorRoles[role]) != -1) {
                        if (!subjectsFilter.includes(subjects1[subject])) {
                            subjectsFilter.push(subjects1[subject]);
                        }
                    }
                }
            }
            res.send(subjectsFilter)
        });
    });
}).post('/', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if (!decoded.role || decoded.role != 'admin') {
        return res.status(403).send({success: false, msg: 'Not allowed.'});
    }
    subject1 = new myModel(req.body);
    subject1.save(
        function (err, subject) {
            if (err) return console.error(err);
            console.log(subject);
        }
    );
    res.send(subject1);
}).put('/addStudentToSubject/:id', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if (!decoded.role || decoded.role != 'admin') {
        return res.status(403).send({success: false, msg: 'Not allowed.'});
    }
    var students = req.body.students;
    myModel.findOne({"_id": req.params.id}
        , function (err, subject) {
            if (err) next(err);
            subject.students = students;
            subject.save(function (err, subject1) {
                if (err) next(err);
                res.json(subject1);
            })
        });


}).put('/:id', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if (!decoded.role || decoded.role != 'admin') {
        return res.status(403).send({success: false, msg: 'Not allowed.'});
    }
    myModel.findOne({"_id": req.params.id}
        , function (err, subject) {
            if (err) next(err);
            var newSubject = req.body;
            subject.name = newSubject.name;
            subject.semester = newSubject.semester;
            subject.professorRole = newSubject.professorRole;

            subject.save(function (err, subject1) {
                if (err) next(err);
                res.json(subject1);
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
module.exports = subjectRouter;