var express = require('express');
var dada=require('./model/user');
var mongoose=require('mongoose');

//connection to mongo
mongoose.connect('mongodb://localhost:27017/Diplomski');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("supeeer");
});

var myModel=mongoose.model("User");
// ruter za user
var userRouter = express.Router();
// definisanje ruta za korisnike
userRouter.get('/', function(req, res, next) {
    myModel.find(function (err, users) {
        if (err) return console.error(err);
        console.log(users);
    });

});
userRouter.get('/add', function(req, res, next) {
    user1= new myModel({
        username:'admin',
        password:'admin'
    })
    user1.save(
        function (err, user) {
            if (err) return console.error(err);
            console.log(user);
        }
    )
});
module.exports = userRouter;