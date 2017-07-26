var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// kreiramo novu shemu
var userSchema = new Schema({
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
