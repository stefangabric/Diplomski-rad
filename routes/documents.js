var express = require('express');
var dada=require('./model/document');
var mongoose=require('mongoose');

//connection to mongo
mongoose.connect('mongodb://localhost:27017/Diplomski');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("supeeer");
});

var myModel=mongoose.model("Document");
// ruter za document
var documentRouter = express.Router();
// definisanje ruta za dokumente
documentRouter.get('/', function(req, res, next) {
    myModel.find(function (err, documents) {
        if (err) return console.error(err);
        console.log(documents);
        res.send(documents);
    });

});
documentRouter.get('/add', function(req, res, next) {
    document1= new myModel({
        name:'index',
        path:'aa',
        student:'admin'

    });
    document1.save(
        function (err, document) {
            if (err) return console.error(err);
            console.log(document);
        }
    )
});

module.exports = documentRouter;