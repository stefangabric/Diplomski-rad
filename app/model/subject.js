
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;

// kreiramo novu shemu

var subjectSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    semester: {
        type: Number,
        required: true
    },
    professorRole: {
        type: Schema.ObjectId,
        ref:'ProfessorRole',
        required: false
    },
    students : [{ type: Schema.Types.ObjectId, ref: 'Student',required: false }],
    obligations : [{ type: Schema.Types.ObjectId, ref: 'Obligation',required: false }]

},{collection:'Subject'});

// od sheme kreiramo model koji cemo koristiti

subjectSchema.plugin(mongoosePaginate);
var Subject = mongoose.model('Subject', subjectSchema);


module.exports = Subject;
