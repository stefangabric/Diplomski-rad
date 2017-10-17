var express = require('express');
var document = require('../model/document');
var mongoose = require('mongoose');
var multer = require('multer');
var passport = require('passport');
var config = require('../config/database'); // get db config file
var jwt = require('jwt-simple');
var storage1 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads');
    },
    filename: function (req, file, cb) {
        var ext = file.originalname.split(".")[1];
        cb(null, Date.now() + "." + ext);
    }
});
var storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads');
    },
    filename: function (req, file, cb) {
        var ext = file.originalname.split(".")[1];
        cb(null, Date.now() + "." + ext);
    }
});
var uploadPicture = multer({storage: storage1, limits: {fileSize: 1024 * 1024 * 50}});
var uploadDocument = multer({storage: storage2});

var myModel = mongoose.model("Document");
// ruter za document
var documentRouter = express.Router();
// definisanje ruta za dokumente
documentRouter.get('/', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if (!decoded.role || decoded.role != 'admin') {
        return res.status(403).send({success: false, msg: 'Not allowed.'});
    }
    myModel.find(function (err, documents) {
        if (err) return console.error(err);
        console.log(documents);
        res.send(documents);
    }).populate('student');

}).get('/:id', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if (!decoded.role || decoded.role != 'admin') {
        return res.status(403).send({success: false, msg: 'Not allowed.'});
    }
    myModel.findOne({"_id": req.params.id}
        , function (err, document) {
            if (err) return console.error(err);
            console.log(document);
            res.send(document);
        }).populate('student');

}).get('/getFor/:student', passport.authenticate('jwt', {session: false}), function (req, res, next) {

    myModel.find({student: req.params.student}, function (err, subjects) {
        if (err) return console.error(err);
        console.log(subjects);
        res.send(subjects);
    }).populate('student');

}).get('/InSubject/:subject', passport.authenticate('jwt', {session: false}), function (req, res, next) {

    myModel.find({subject: req.params.subject}, function (err, subjects) {
        if (err) return console.error(err);
        console.log(subjects);
        res.send(subjects);
    }).populate('subject');

}).post('/', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if (!decoded.role || decoded.role != 'student') {
        return res.status(403).send({success: false, msg: 'Not allowed.'});
    }
    document1 = new myModel(req.body);
    document1.save(
        function (err, document) {
            if (err) return console.error(err);
            console.log(document);
        }
    );
    res.send(document1);
}).post('/addToSubject/:id', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if (!decoded.role || decoded.role != 'professor') {
        return res.status(403).send({success: false, msg: 'Not allowed.'});
    }
    document1 = new myModel(req.body);
    document1.subject=req.params.id;
    document1.save(
        function (err, document) {
            if (err) return console.error(err);
            console.log(document);
        }
    );
    res.send(document1);
}).post('/profilePic/:id', passport.authenticate('jwt', {session: false}), uploadPicture.single("file"), function (req, res, next) {

    res.send(req.file);
}).post('/uploadAngular/:id', passport.authenticate('jwt', {session: false}), uploadDocument.single("file"), function (req, res, next) {
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if (!decoded.role || decoded.role == 'admin') {
        return res.status(403).send({success: false, msg: 'Not allowed.'});
    }
    res.send(req.file);
}).put('/:id', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if (!decoded.role || decoded.role != 'student') {
        return res.status(403).send({success: false, msg: 'Not allowed.'});
    }
    myModel.findOne({"_id": req.params.id}
        , function (err, document) {
            if (err) next(err);
            var newDocument = req.body;
            document.name = newDocument.name;
            document.path = newDocument.path;
            document.student = newDocument.student;
            document.save(function (err, document1) {
                if (err) next(err);
                res.json(document1);
            });

        });
}).delete('/:id', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    if (!decoded.role || decoded.role != 'student') {
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

module.exports = documentRouter;