var express = require('express');
var dada=require('./model/professorRole');
var mongoose=require('mongoose');

//connection to mongo
mongoose.connect('mongodb://localhost:27017/Diplomski');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("supeeer");
});

var myModel=mongoose.model("ProfessorRole");
// ruter za professorRole
var professorRoleRouter = express.Router();
// definisanje ruta za korisnike
professorRoleRouter.get('/', function(req, res, next) {
    myModel.find(function (err, professorRoles) {
        if (err) return console.error(err);
        console.log(professorRoles);
        res.send(professorRoles);
    });

});
professorRoleRouter.get('/add', function(req, res, next) {
    professorRole1= new myModel({
        professor:'admin',
        role:'profesor',
        subject:'engleski'
    });
    professorRole1.save(
        function (err, professorRole) {
            if (err) return console.error(err);
            console.log(professorRole);
        }
    )
});
module.exports = professorRoleRouter;