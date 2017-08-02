var express = require('express');
var dada=require('./model/user');
var mongoose=require('mongoose');

var myModel=mongoose.model("User");
// ruter za user
var userRouter = express.Router();
// definisanje ruta za korisnike
userRouter.get('/', function(req, res, next) {
    myModel.find(function (err, users) {
        if (err) return console.error(err);
        console.log(users);
        res.send(users);
    });
 }).post('/',function(req, res, next) {
    user1= new myModel(req.body);
    user1.save(
        function (err, user) {
            if (err) return console.error(err);
            console.log(user);
        }
    )
    res.send(user1);
}).put('/:id',function(req, res, next) {
    myModel.findOne({ "_id": req.params.id}
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
}).delete('/:id', function(req, res, next) {
    myModel.remove({
        "_id": req.params.id
    }, function(err, successIndicator) {
        if (err) next(err);
        res.json(successIndicator);
    });
});
module.exports = userRouter;