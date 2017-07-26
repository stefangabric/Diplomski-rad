var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// kreiramo novu shemu

var userSchema = new Schema({
    role: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
            }
},{collection:'User'});

// od sheme kreiramo model koji cemo koristiti
var User = mongoose.model('User', userSchema);


module.exports = User;
