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
        type: Number,
        required: true
    },
    recipient: {
        type: String,
        required: true
    },
    student: {
        type: Schema.ObjectId,
        ref:'User'
            }
},{collection:'Transaction'});

// od sheme kreiramo model koji cemo koristiti
var Transaction = mongoose.model('Transaction', transactionSchema);


module.exports = Transaction;
