var express = require('express');
var router = express.Router();
var passport  = require('passport');
var jwt = require('jwt-simple');
require('../config/passport')(passport);
var mongoose = require('mongoose');
var dada1 = require('../model/user');
var myModel = mongoose.model("User");

/* GET home page. */
router.get('/', function(req, res, next) {
        res.render('index', { title: 'Express' });
}).post('/authenticate', function(req, res) {
    myModel.findOne({ name: req.body.name,password:req.body.password}
        , function(err, user) {
        if (err) throw err;
        if (user) {
            // ako je pronadjen user i poklapa se password kreira token
            // da li ceo user treba da bude u tokenu?
            var token = jwt.encode(user, 'XWSMeanDevelopment');
            // vraca informaciju kao JWT token
            var resObject = { success: true, token: 'JWT ' + token };
            res.json(resObject);
        } else {
            res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        }

    });
})
    .get('/memberinfo', passport.authenticate('jwt', { session: false}), function(req, res) {
        var token = getToken(req.headers);
        if (token) {
            var decoded = jwt.decode(token, config.secret);
            User.findOne({
                name: decoded.name
            }, function(err, user) {
                if (err) throw err;

                if (!user) {
                    return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
                } else {
                    res.json({success: true, msg: 'Welcome in the member area ' + user.name + '!'});
                }
            });
        } else {
            return res.status(403).send({success: false, msg: 'No token provided.'});
        }
    });

var getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

module.exports = router;
