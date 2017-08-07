
var mongoose = require('mongoose');
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
var Document = mongoose.model('Document', documentSchema);

module.exports = Document;
