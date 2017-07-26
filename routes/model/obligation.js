
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// kreiramo novu shemu

var obligationSchema = new Schema({

    obligationType: {
        type: String,
        required: true
    },
    dateOfObligation: {
        type: Date
    },
    points: {
        type: int,
        required: true
    },
    subject: {
        type: String,
        required: true
    }
   
},{collection:'Obligation'});

// od sheme kreiramo model koji cemo koristiti
var Obligation = mongoose.model('obligation', obligationSchema);


module.exports = Obligation;
