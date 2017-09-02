var express = require('express');
var dada=require('../model/professorRole');
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

}).post('/',function(req, res, next) {
    professorRole1= new myModel(req.body);
    professorRole1.save(
        function (err, professorRole) {
            if (err) return console.error(err);
            console.log(professorRole);
        }
    );
    res.send(professorRole1);
}).put('/:id',function(req, res, next) {
    myModel.findOne({ "_id": req.params.id}
        , function(err, professorRole) {
            if (err) next(err);
            var newProfessorRole = req.body;
            professorRole.professor = newProfessorRole.professor;
            professorRole.role = newProfessorRole.role;
            professorRole.subject = newProfessorRole.subject;
            professorRole.save(function(err, professorRole1) {
                if (err) next(err);
                res.json(professorRole1);
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
module.exports = professorRoleRouter;