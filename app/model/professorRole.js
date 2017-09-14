var autoref = require('mongoose-autorefs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// kreiramo novu shemu

var professorRoleSchema = new Schema({

    professor: {
        type: Schema.ObjectId,
        ref:'User'
    },
    role: {
        type: String,
        required: true
    },
    subject: {
        type: Schema.ObjectId,
        ref:'Subject'
    }
   
},{collection:'ProfessorRole'});

professorRoleSchema.plugin(autoref, [
    'subject.professorRoles',
    'professor.professorRoles'
]);
// od sheme kreiramo model koji cemo koristiti
var ProfessorRole = mongoose.model('ProfessorRole', professorRoleSchema);


module.exports = ProfessorRole;
