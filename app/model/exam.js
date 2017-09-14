
var autoref = require('mongoose-autorefs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// kreiramo novu shemu

var examSchema = new Schema({

    points: {
        type: Number,
        required: true
    },
    pass: {
        type: Boolean,
        required: true
    },

    student: {
        type: Schema.ObjectId,
        ref:'User'
    },
    subject: {
        type: Schema.ObjectId,
        ref:'Subject'
    },
   
},{collection:'Exam'});

// od sheme kreiramo model koji cemo koristiti
examSchema.plugin(autoref, [
    'student.exams',
    'subject.nista'
]);
var Exam = mongoose.model('Exam', examSchema);


module.exports = Exam;
