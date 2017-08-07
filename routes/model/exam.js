
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// kreiramo novu shemu

var examSchema = new Schema({

    points: {
        type: int,
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
var Exam = mongoose.model('exam', examSchema);


module.exports = Exam;
