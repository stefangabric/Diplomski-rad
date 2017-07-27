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

});
userRouter.post('/add', function(req, res, next) {
    user1= new myModel({
        role:'admin',
        name:'admin',
        lastname:'admin',
        username:'admin',
        password:'admin'
    });
    user1.save(
        function (err, user) {
            if (err) return console.error(err);
            console.log(user);
        }
    )
    res.send(user1);
});

userRouter.post('/token', function(req, res, next) {
    console.log("ovde");


});
module.exports = userRouter;