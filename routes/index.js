var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var dbURI  = 'mongodb://localhost:27017/StudentInformationSystem';
mongoose.connect(dbURI , {useNewUrlParser: true});
var db = mongoose.connection;
var bcrypt = require('bcryptjs');
var Admin = require('../models/admin');


router.get('/login', function(req, res) {
    res.render('login.ejs');
});

// DOES NOT WORK
router.post('/login', passport.authenticate('local', {
    successRedirect: '/students/dashboard',
    failureRedirect: '/login',
    failureFlash: true }),
    function(req, res) {
        console.log('Auth successful');
        res.redirect('/dashboard');
});
// DOES NOT WORK -- NOW CHECK IF THIS WORKED
passport.use(new LocalStrategy( {
	 // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(email, password, done) {
        Admin.getAdminByEmail(email, function(err, admin) {
            if(err)
                throw err;
            if(!admin) {
                console.log('Unknown Admin');
                return done(null, false, {message: 'Unknown Admin.... Please try again or contact Admin'});
            }

            Admin.comparePassword(password, admin.password, function (err, isMatch) {
				if (err) 
					throw err;

				if (isMatch) {
					console.log('Match');
					return done(null, user);
				} 
				else {
					console.log('Incorrect password');
					return done(null, false, { message: 'Invalid password.... Please try again or Register' });
				}
		});
	});
}));

passport.serializeUser(function (admin, done) {
	done(null, admin.id);
});

passport.deserializeUser(function (id, done) {
	Admin.getAdminById(id, function (err, admin) {
		done(err, admin);
	});
});


router.get('/register', function(req, res) {
	res.render('register');
});

router.post('/register', function(req, res) {
    var newAdmin = new Admin ({
        firstName: req.body.firstName,
		lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    });
    console.log(newAdmin);
    req.checkBody('confirmPassword', 'Passwords Do Not Match').equals(req.body.password);
    var errors = req.validationErrors();
    if(errors) {
        console.log('Registration Form has errors...');
		res.render('register', {
			errors: errors,
			confirmPassword: confirmPassword,
		});
    }
    
    Admin.createAdmin(newAdmin, function(err, admin) {
        if(err)
            throw err;

        console.log('Successfully Added New Admin: ' + admin);
    })
    res.redirect('/login');
});

module.exports = router;
