
var mongoose = require('mongoose');
var autoref = require('mongoose-autorefs');
var mongoosePaginate = require('mongoose-paginate');


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
        type: Schema.ObjectId,
        ref:'User'
    }
   
},{collection:'Document'});

// od sheme kreiramo model koji cemo koristiti
documentSchema.plugin(mongoosePaginate);
documentSchema.plugin(autoref, [
    'student.documents'
]);
var Document = mongoose.model('Document', documentSchema);

module.exports = Document;
