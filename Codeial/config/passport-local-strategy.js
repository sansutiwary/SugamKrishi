const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/user');


passport.use(new localStrategy({
        usernameField: 'username',
        // below command is allowing us to access request
        passReqToCallback: true
    },
    function (req ,userN, password, done) {
        User.findOne({ username: userN }, function (err, user) {
            if (err) {
                req.flash('error',err);

                
                console.log("Error finding the user -->passport");
                return done(err);
            }
            if (!user || user.password != password) {
                req.flash('error',"Invalid Username/Password");


                console.log("Invalid Username/Password");
                return done(null, false);
            }
            return done(null, user);
        });
    }
));

// serialize User from the cookies
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

// deserialize User to give access to data from DataBase
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        if (err) {
            console.log("Error finding the user -->passport");
            done(err);
        }
        done(null, user);
    });
});

passport.checkAuthentication = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error','SignedIn Failed!')
    return res.redirect('/user/signin');
}

passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        // 
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;