
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// kreiramo novu shemu

var professorRoleSchema = new Schema({

    professor: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    }
   
},{collection:'ProfessorRole'});

// od sheme kreiramo model koji cemo koristiti
var ProfessorRole = mongoose.model('ProfessorRole', professorRoleSchema);


module.exports = ProfessorRole;
