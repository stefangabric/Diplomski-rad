/*
var passport = require("passport");
var passportJWT = require("passport-jwt");
var Strategy = passportJWT.Strategy;
var User = require('../model/user');
var ExtractJwt = passportJWT.ExtractJwt;
var config = require(__dirname+'/database'); // get db config file
var params = {
    secretOrKey: config.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeader()
};
module.exports = function() {
    console.log("13");
    var strategy = new Strategy(params, function(payload, done) {
        console.log("14");
        console.log(payload);
        User.findOne({ "_id": req.params.id}
            ,function (err, user) {
                if (err) return console.error(err);
                if (user) {
                    return done(null, {
                        id: user.id
                    });
                } else {
                    return done(new Error("User not found"), null);
                }}
                );

    });
    console.log("16");
    passport.use(strategy);

};*/
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

// load up the user model
var User = require('../model/user');
var config = require(__dirname+'/database'); // get db config file

module.exports = function(passport) {
    var opts = {};
    opts.secretOrKey = config.secret;
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        console.log("ovde");
        User.findOne({id: jwt_payload.id}, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    }));
};
