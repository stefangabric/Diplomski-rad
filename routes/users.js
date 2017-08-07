var express = require('express');
var dada=require('./model/user');
var mongoose=require('mongoose');

var myModel=mongoose.model("User");
// ruter za user
var userRouter = express.Router();
// definisanje ruta za korisnike
userRouter.get('/professors', function(req, res, next) {
    var filter=req.params.text;
    var pageNumber=req.params.pageNumber;
    var pageSize=1;
    if(req.params.text==undefined){
        filter="";
    }
    var data={};
    myModel.paginate({ $or:[ {lastname:{$regex : filter }},{name:{$regex : filter }}]}, { page: pageNumber, limit: pageSize }, function(err, result) {
        data.content=result.docs;
        data.number=result.page;
        data.totalPages=Math.ceil(result.total/result.limit);
        res.send(data);
    });
 }).get('/students', function(req, res, next) {
    var filter=req.params.text;
    var pageNumber=req.params.pageNumber;
    var pageSize=1;
    if(req.params.text==undefined){
        filter="";
    }
    var data={};
    myModel.paginate({ $or:[ {lastname:{$regex : filter }},{name:{$regex : filter }}]}, { page: pageNumber, limit: pageSize }, function(err, result) {
        data.content=result.docs;
        data.number=result.page;
        data.totalPages=Math.ceil(result.total/result.limit);
        res.send(data);
    });
}).post('/students',function(req, res, next) {
    user1= new myModel(req.body);
    user1.password="dad";
    console.log(user1);
    user1.role="student";
    user1.save(
        function (err, user) {
            if (err) return console.error(err);
            console.log(user);
        }
    )
    res.send(user1);
}).post('/professors',function(req, res, next) {
    user1.role="admin";
    user1= new myModel(req.body);
    user1.save(
        function (err, user) {
            if (err) return console.error(err);
            console.log(user);
        }
    )
    res.send(user1);
}).put('/students/:id',function(req, res, next) {
    myModel.findOne({ "_id": req.params.id,'role':'student'}
        , function(err, user) {
            if (err) next(err);
            var newUser = req.body;
            user.name = newUser.name;
            user.lastname = newUser.lastname;
            user.username = newUser.username;
            user.password = newUser.password;
            user.role = newUser.role;
            user.save(function(err, user1) {
                if (err) next(err);
                res.json(user1);
            });

        });
}).put('professors/:id',function(req, res, next) {
    myModel.findOne({ "_id": req.params.id,'role':'professor'}
        , function(err, user) {
            if (err) next(err);
            var newUser = req.body;
            user.name = newUser.name;
            user.lastname = newUser.lastname;
            user.username = newUser.username;
            user.password = newUser.password;
            user.role = newUser.role;
            user.save(function(err, user1) {
                if (err) next(err);
                res.json(user1);
            });

        });
}).delete('/students/:id', function(req, res, next) {
    myModel.remove({
        "_id": req.params.id
    }, function(err, successIndicator) {
        if (err) next(err);
        res.json(successIndicator);
    });
}).delete('/professors/:id', function(req, res, next) {
    myModel.remove({
        "_id": req.params.id
    }, function(err, successIndicator) {
        if (err) next(err);
        res.json(successIndicator);
    });
});
module.exports = userRouter;