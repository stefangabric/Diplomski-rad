var express = require('express');
var dada=require('./model/professorRole');
var mongoose=require('mongoose');

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
professorRoleRouter.post('/add', function(req, res, next) {
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
    res.send(professorRole1);
});
module.exports = professorRoleRouter;