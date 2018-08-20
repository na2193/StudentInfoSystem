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
var Student = require('../models/student');

// fix this later
router.get('/', function(req, res) {
    res.redirect('/login');
});

router.get('/login', function(req, res) {
    res.render('login.ejs');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true }),
    function(req, res) {
        console.log('Auth successful');
        res.redirect('/dashboard');
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        Admin.getAdminByUsername(username, function(err, admin) {
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
					return done(null, admin);
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
        username: req.body.username,
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

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) 
		return next();

	console.log('You are not logged in');
	res.redirect('/login');
	
}

router.get('/dashboard', isLoggedIn, function(req, res) {
    res.render('dashboard.ejs', {
        admin: req.admin // get the admin info out of session and pass to template
    });
});

router.get('/newStudent', isLoggedIn, function(req, res) {
    res.render('newStudent.ejs');
});

router.post('/newStudent', isLoggedIn, function(req, res) {
    var newStudent = Student({
		// student information
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.studentEmail,
		phoneNumber: req.body.studentPhoneNum,
		address: {
			address1: req.body.address,
			address2: req.body.address2,
			city: req.body.city,
			state: req.body.state,
			zipCode: req.body.zip
		},
		// parent information
		parentInfo: {
			firstName: req.body.parentFirstName,
			lastName: req.body.parentLastName,
			email: req.body.parentEmail,
			phoneNumber: req.body.parentPhoneNum,
			relationship: req.body.parentRelationship
		},
		// emergency contact information
		emergencyContactInfo: {
			firstName: req.body.emergFirstName,
			lastName: req.body.emergLastName,
			email: req.body.emergEmail,
			phoneNumber: req.body.emergPhoneNum,
			relationship: req.body.emergRelationship
		}
	});
	
	console.log(newStudent);
	
	var errorMessage;
	// saving the new student
	newStudent.save(function(err) {
		if(err) {
			errorMessage = 'ERROR';
			throw err;
		}
		console.log('New Student Successfully Saved');
	});
	
	var successMessage = 'New Student Successfully Saved';
    
    res.redirect('/dashboard');
    /*
	res.render('/newStudents', {
			successMessage: successMessage,
			errorMessage: errorMessage
		}); */
});


module.exports = router;
