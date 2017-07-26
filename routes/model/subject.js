
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// kreiramo novu shemu

var subjectSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    semester: {
        type: String,
        required: true
    },
    professorRole: {
        type: String,
        required: true
    }
},{collection:'Subject'});

// od sheme kreiramo model koji cemo koristiti
var Subject = mongoose.model('Subject', subjectSchema);


module.exports = Subject;
