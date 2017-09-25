var express = require('express');
var user = require('../model/user');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database'); // get db config file
var jwt = require('jwt-simple');
require('../config/passport')(passport);

var myModel = mongoose.model("User");
// ruter za user
var userRouter = express.Router();

// definisanje ruta za korisnike
userRouter.get('/professors', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if (!decoded.role || decoded.role != 'admin') {
        return res.status(403).send({success: false, msg: 'Not allowed.'});
    }
    var filter = req.query.text;
    var pageNumber = req.query.pageNumber;
    var pageSize = 5;
    if (req.query.text == undefined) {
        filter = "";
    }
    if (req.query.pageNumber == undefined) {
        pageNumber = 1;
    }
    var data = {};
    myModel.paginate({$and: [{role: 'professor'}, {$or: [{lastname: {$regex: filter}}, {name: {$regex: filter}}]}]}, {
        page: pageNumber,
        limit: pageSize
    }, function (err, result) {
        if (err) {
            console.log(err)
        }
        console.log(result);
        data.content = result.docs;
        data.pageNumber = pageNumber;
        data.totalPages = Math.ceil(result.total / result.limit);
        res.send(data);
    });
}).get('/professors/all', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if (!decoded.role || decoded.role != 'admin') {
        return res.status(403).send({success: false, msg: 'Not allowed.'});
    }
    myModel.find({role: 'professor'}
        , function (err, professors) {
            if (err) return console.error(err);
            console.log(professors);
            res.send(professors);
        }).populate('professorRoles');
}).get('/students/all', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if (!(decoded.role == 'admin' || decoded.role == 'professor')) {
        return res.status(403).send({success: false, msg: 'Not allowed.'});
    }
    myModel.find({role: 'student'}
        , function (err, students) {
            if (err) return console.error(err);
            console.log(students);
            res.send(students);
        }).populate('subjects').populate('transactions').populate('documents');
}).get('/students', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if (!decoded.role || decoded.role != 'admin') {
        return res.status(403).send({success: false, msg: 'Not allowed.'});
    }
    var filter = req.query.text;
    var pageNumber = req.query.pageNumber;
    var pageSize = 10;
    if (req.query.text == undefined) {
        filter = "";
    }
    var data = {};
    myModel.paginate({$and: [{role: 'student'}, {$or: [{lastname: {$regex: filter}}, {name: {$regex: filter}}]}]}, {
        page: pageNumber,
        limit: pageSize
    }, function (err, result) {
        if (err) {
            console.log(err)
        }
        console.log(result);
        data.content = result.docs;
        data.pageNumber = pageNumber;
        data.totalPages = Math.ceil(result.total / result.limit);
        res.send(data);
    });
}).get('/:id', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    myModel.findOne({"_id": req.params.id}
        , function (err, document) {
            if (err) return console.error(err);
            console.log(document);
            res.send(document);
        }).populate('subjects');

}).get('/students/getStudentsInSubject/:id', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if (!(decoded.role == 'admin' || decoded.role == 'professor')) {
        return res.status(403).send({success: false, msg: 'Not allowed.'});
    }
    var students1 = [];
    var studentsFilter = [];
    myModel.find({role: 'student'}
        , function (err, students) {
            if (err) return console.error(err);
            students1 = students;
        }).populate("subjects").exec(function () {
        for (var i in students1) {
            for (var b in students1[i].subjects) {
                if (students1[i].subjects[b]._id == req.params.id) {
                    studentsFilter.push(students1[i]);
                }
            }
        }
        res.send(studentsFilter);
    });
}).get('/students/getNotInSubject/:id', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if (!(decoded.role == 'admin' || decoded.role == 'professor')) {
        return res.status(403).send({success: false, msg: 'Not allowed.'});
    }
    var students1 = [];
    var studentsFilter = [];
    myModel.find({role: 'student'}
        , function (err, students) {
            if (err) return console.error(err);
            students1 = students;
        }).populate("subjects").exec(function () {
        studentsFilter = students1;
        for (var i in students1) {
            for (var b in students1[i].subjects) {
                if (students1[i].subjects[b]._id == req.params.id) {
                    studentsFilter.splice(students1[i], 1);
                }
            }
        }
        res.send(studentsFilter);
    });
}).post('/students', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if (!decoded.role || decoded.role != 'admin') {
        return res.status(403).send({success: false, msg: 'Not allowed.'});
    }
    user1 = new myModel(req.body);
    user1.password = "dad";

    user1.role = "student";
    console.log(user1);
    user1.save(
        function (err, user) {
            if (err) return console.error(err);
            console.log(user);
        }
    );
    res.send(user1);
}).post('/professors', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if (!decoded.role || decoded.role != 'admin') {
        return res.status(403).send({success: false, msg: 'Not allowed.'});
    }
    user1 = new myModel(req.body);
    user1.role = "professor";
    console.log(req.body);
    user1.save(
        function (err, user) {
            if (err) return console.error(err);
            console.log(user);
        }
    );
    res.send(user1);
}).put('/students/:id', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if (!decoded.role || decoded.role != 'admin') {
        return res.status(403).send({success: false, msg: 'Not allowed.'});
    }
    myModel.findOne({"_id": req.params.id, 'role': 'student'}
        , function (err, user) {
            if (err) next(err);
            console.log(req.body);
            var newUser = req.body;
            user.name = newUser.name;
            user.jMBG=newUser.jMBG;
            user.adress=newUser.adress;
            user.gender=newUser.gender;
            user.dateOfBirth=newUser.dateOfBirth;
            user.lastname = newUser.lastname;
            user.username = newUser.username;
            user.password = newUser.password;
            user.role = newUser.role;
            user.picturePath = newUser.picturePath;
            user.save(function (err, user1) {
                if (err) next(err);
                res.json(user1);
            });

        });
}).put('/professors/:id', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if (!decoded.role || decoded.role != 'admin') {
        return res.status(403).send({success: false, msg: 'Not allowed.'});
    }
    myModel.findOne({"_id": req.params.id, 'role': 'professor'}
        , function (err, user) {
            if (err) next(err);
            var newUser = req.body;
            user.name = newUser.name;
            user.lastname = newUser.lastname;
            user.username = newUser.username;
            user.password = newUser.password;
            user.jMBG=newUser.jMBG;
            user.adress=newUser.adress;
            user.gender=newUser.gender;
            user.dateOfBirth=newUser.dateOfBirth;
            user.role = newUser.role;
            user.picturePath = newUser.picturePath;
            user.save(function (err, user1) {
                if (err) next(err);
                res.json(user1);
            });

        });
}).put('/changePassword/:id', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    myModel.findOne({
        "_id": req.params.id
    }, function (err, user) {
        if (err) next(err);
        console.log(req.body);
        user.password=req.body.newPassword;
        user.save(function (err, user1) {
            if (err) next(err);
            res.json(user1);
        });
    });
}).delete('/students/:id', passport.authenticate('jwt', {session: false}), function (req, res, next) {
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
}).delete('/professors/:id', passport.authenticate('jwt', {session: false}), function (req, res, next) {
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
module.exports = userRouter;