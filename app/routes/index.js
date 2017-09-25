var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('jwt-simple');
require('../config/passport')(passport);
var mongoose = require('mongoose');
var user1 = require('../model/user');
var myModel = mongoose.model("User");
var config = require("../config/database");


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
}).post('/authenticate', function (req, res) {
    myModel.findOne({username: req.body.name, password: req.body.password}
        , function (err, user) {
            if (err) throw err;
            if (user) {
                // ako je pronadjen user i poklapa se password kreira token
                // da li ceo user treba da bude u tokenu?
                console.log(user);
                var token = jwt.encode(user, config.secret);

                // vraca informaciju kao JWT token
                var resObject = {success: true, token: 'JWT ' + token};
                res.json(resObject);
                console.log(resObject.token);
            } else {
                res.send({success: false, msg: 'Authentication failed. Wrong password.'});
            }

        });
});


module.exports = router;
