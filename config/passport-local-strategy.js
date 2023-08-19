var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Employee = require('../models/employee');
var Admin = require('../models/admin');


let passportCallback = async function (req, email, password, done) {
    //find user and establish identity..
    try {
        if (req.body.role === "employee") {
            let loginEmployee = await Employee.findOne({ email: email });
            if (!loginEmployee || loginEmployee.password != password) {
                req.flash('error' , 'Invalid username & password !!');
                return done(null, false);
            }
            return done(null, loginEmployee);
        }else{
            let loginAdmin = await Admin.findOne({email : email});
            if(!loginAdmin || loginAdmin.password != password){
                req.flash('error' , 'Invalid username & password !!');
                return done(null , false);
            }
            
            return done(null , loginAdmin);
        }
    }

    catch (err) {
        return done(err);
    }
}
passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, passportCallback));
passport.serializeUser(function ( loginUser, done) {
    done(null, loginUser);
});

let deserializeCallback = async function ( loginUser, done) {
    try {
        if(loginUser.role =="employee"){
            let employee = await Employee.find({loginUser});
            return done(null, employee[0]);
        }else{
            let admin = await Admin.find({loginUser});
            return done(null, admin[0]);
        }
    }
    catch (err) {
        return done(err);
    }
}

passport.deserializeUser(deserializeCallback);
passport.checkAuthentication = function (req, res, next){
    if(req.isAuthenticated()){
        // req.user contains user details
        return next();
    }
    return res.redirect('/');
}

module.exports = passport;
