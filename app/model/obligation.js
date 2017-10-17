var autoref = require('mongoose-autorefs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var obligationSchema = new Schema({

    obligationType: {
        type: String,
        required: true
    },
    dateOfObligation: {
        type: Date
    },
    points: {
        type: Number,
        required: true
    },
    subject: {
        type: Schema.ObjectId,
        ref:'Subject'
    }
   
},{collection:'Obligation'});
obligationSchema.plugin(autoref, [
    'subject.obligations'
]);
var Obligation = mongoose.model('Obligation', obligationSchema);
module.exports = Obligation;
