
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// kreiramo novu shemu

var documentSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    student: {
        type: String,
        required: true
    }
   
},{collection:'Document'});

// od sheme kreiramo model koji cemo koristiti
var Document = mongoose.model('Document', documentSchema);


module.exports = Document;
