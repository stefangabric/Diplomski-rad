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
// definisanje ruta za predmete
userRouter.get('/', function(req, res, next) {
    myModel.find(function (err, users) {
        if (err) return console.error(err);
        console.log(users);
        res.send(users);
    });

});
userRouter.get('/add', function(req, res, next) {
    user1= new myModel({
        name:'admin',
        semester:'2',
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
});

userRouter.post('/token', function(req, res, next) {
    console.log("ovde");


});
module.exports = userRouter;