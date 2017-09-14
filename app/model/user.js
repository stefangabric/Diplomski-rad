var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;
var autoref = require('mongoose-autorefs');


// kreiramo novu shemu

var userSchema = new Schema({
    role: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    jMBG: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String
    },
    dateOfBirth: {
        type: String
    },
    address: {
        type: String
    },
    title: {
        type: String
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
            },
    picturePath: {
        type: String
    },
    subjects : [{ type: Schema.Types.ObjectId, ref: 'Subject' }],
    transactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }],
    documents : [{ type: Schema.Types.ObjectId, ref: 'Document' }],
    professorRoles : [{ type: Schema.Types.ObjectId, ref: 'ProfessorRole' }],
    exams : [{ type: Schema.Types.ObjectId, ref: 'Exam' }]

},{collection:'User'});

userSchema.plugin(autoref, [
    'subjects.students',
    'transactions.students',
    'documents.student',
    'professorRoles.professor',
    'exams.student'
]);

// od sheme kreiramo model koji cemo koristiti
userSchema.plugin(mongoosePaginate);

var User = mongoose.model('User', userSchema);


module.exports = User;
