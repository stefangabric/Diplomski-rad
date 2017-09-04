var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt; 

// load up the user model
var User = require('../model/user');
var config = require(__dirname+'/database'); // get db config file
 
module.exports = function(passport) {
  var opts = {};
  opts.secretOrKey = 'XWSMeanDevelopment';
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        console.log("ovde");
      console.log(jwt_payload.userId);
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