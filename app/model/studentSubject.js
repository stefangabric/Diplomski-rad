
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// kreiramo novu shemu

var studentSubjectSchema = new Schema({

    subject: {
        type: Schema.ObjectId,
        ref:'Subject'
    },
    student: {
        type: Schema.ObjectId,
        ref:'User'
    }

},{collection:'StudentSubject'});

// od sheme kreiramo model koji cemo koristiti
var StudentSubject = mongoose.model('StudentSubject', studentSubjectSchema);


module.exports = StudentSubject;
