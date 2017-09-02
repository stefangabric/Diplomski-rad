var express = require('express');
var dada = require('../model/user');
var mongoose = require('mongoose');

var myModel = mongoose.model("User");
// ruter za user
var userRouter = express.Router();

// definisanje ruta za korisnike
userRouter.get('/professors', function (req, res, next) {
    var filter = req.query.text;
    var pageNumber = req.query.pageNumber;
    var pageSize = 5;
    if (req.query.text == undefined) {
        filter = "";
    }
    if (req.query.pageNumber == undefined) {
        pageNumber=1;
    }
    var data = {};
    myModel.paginate({$and: [{role: 'professor'}, {$or: [{lastname: {$regex: filter}}, {name: {$regex: filter}}]}]}, {
        page: pageNumber,
        limit: pageSize
    }, function (err, result) {
        if (err){console.log(err)}
        console.log(result);
        data.content = result.docs;
        data.pageNumber = pageNumber;
        data.totalPages = Math.ceil(result.total / result.limit);
        res.send(data);
    });
}).get('/students', function (req, res, next) {


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
        if (err){console.log(err)}
        console.log(result);
        data.content = result.docs;
        data.pageNumber = pageNumber;
        data.totalPages = Math.ceil(result.total / result.limit);
        res.send(data);
    });
}).get('/:id',function(req, res, next) {
    myModel.findOne({ "_id": req.params.id}
        ,function (err, document) {
            if (err) return console.error(err);
            console.log(document);
            res.send(document);
        });

}).post('/students', function (req, res, next) {
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
}).post('/professors', function (req, res, next) {
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
}).put('/students/:id', function (req, res, next) {
    myModel.findOne({"_id": req.params.id, 'role': 'student'}
        , function (err, user) {
            if (err) next(err);
            var newUser = req.body;
            user.name = newUser.name;
            user.lastname = newUser.lastname;
            user.username = newUser.username;
            user.password = newUser.password;
            user.role = newUser.role;
            user.save(function (err, user1) {
                if (err) next(err);
                res.json(user1);
            });

        });
}).put('professors/:id', function (req, res, next) {
    myModel.findOne({"_id": req.params.id, 'role': 'professor'}
        , function (err, user) {
            if (err) next(err);
            var newUser = req.body;
            user.name = newUser.name;
            user.lastname = newUser.lastname;
            user.username = newUser.username;
            user.password = newUser.password;
            user.role = newUser.role;
            user.save(function (err, user1) {
                if (err) next(err);
                res.json(user1);
            });

        });
}).delete('/students/:id', function (req, res, next) {
    myModel.remove({
        "_id": req.params.id
    }, function (err, successIndicator) {
        if (err) next(err);
        res.json(successIndicator);
    });
}).delete('/professors/:id', function (req, res, next) {
    myModel.remove({
        "_id": req.params.id
    }, function (err, successIndicator) {
        if (err) next(err);
        res.json(successIndicator);
    });
});
module.exports = userRouter;