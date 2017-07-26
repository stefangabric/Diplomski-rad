var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// kreiramo novu shemu

var transactionSchema = new Schema({
    purpose: {
        type: String,
        required: true
    },
    bankAccount: {
        type: String,
        required: true
    },
    price: {
        type: Double,
        required: true
    },
    recipient: {
        type: String,
        required: true,
        unique: true
    },
    student: {
        type: String,
        required: true,
            }
},{collection:'Transaction'});

// od sheme kreiramo model koji cemo koristiti
var Transaction = mongoose.model('Transaction', transactionSchema);


module.exports = Transaction;
