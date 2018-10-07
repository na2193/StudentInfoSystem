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
var Class = require('../models/class');
var Instructor = require('../models/instructors');
var Grades = require('../models/grades');

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
// NEED TO WORK ON THIS
router.get('/dashboard', isLoggedIn, function(req, res) {
	Student.find({}, function(err, students) {
		if(err)
			throw err;

			Instructor.find({}, function(err, instructors) {
				if(err)
					throw err;

					res.render('dashboard.ejs', {students: students, 
												 instructors: instructors});
			});
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
		dateOfBirth: req.body.dateOfBirth,
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
	
	console.log('POST METHOD /newStudent - New Student -> ' + newStudent);
	
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

router.get('/newClass', isLoggedIn, function(req, res) {
	res.render('newClass.ejs');
});

router.post('/newClass', isLoggedIn, function(req, res) {
	var newClass = new Class ({
		className: req.body.className,
		instructorName: req.body.instructorName,
		email: req.body.email,
		phoneNumber: req.body.phoneNum,
		startDate: req.body.startDate,
		endDate: req.body.endDate,
		maxStudents: req.body.maxStudents,
		startTime: req.body.startTime,
		endTime: req.body.endTime,
		meetingDays1: req.body.meetingDays1,
		meetingDays2: req.body.meetingDays2,
		classLocation: req.body.classLocation
    	});		
	var errorMessage;
	// saving the new student
	newClass.save(function(err) {
		if(err) {
			errorMessage = 'ERROR';
			throw err;
		}
		console.log('New Class Successfully Saved: ' + newClass);
	});
	
	var successMessage = 'New Class Successfully Saved';
	
	 res.redirect('/dashboard');
    /*
	res.render('/newClass', {
			successMessage: successMessage,
			errorMessage: errorMessage
		}); */
});

router.get('/searchStudentRecords', isLoggedIn, function(req, res) {
	res.render('searchStudentRecords.ejs');
});

router.post('/searchStudentRecord', isLoggedIn, function(req, res) {
	var dropDownValue = req.body.searchBySelectPicker;
	var searchItem = req.body.inputSearch;
	
	if(dropDownValue == 'studentID') {
		Student.findById(searchItem, function(err, student) {
			if(err)
				throw err;

			if(!student) {
				console.log('Unknown Student');
				return done(null, false, {message: 'Unknown Student.... Please try again or contact Admin'}); 
			}

			req.session.student = student;
			res.redirect('/studentRecords');
		});
	}
	else if(dropDownValue == 'email') {
		Student.getStudentByEmail(searchItem, function(err, student) {
			if(err)
				throw err;

			if(!student) {
				console.log('Unknown Student');
				return done(null, false, {message: 'Unknown Student.... Please try again or contact Admin'}); 
			}

			req.session.student = student;
			res.redirect('/studentRecords');
		});
	}
	else if(dropDownValue == 'phoneNum') {
		Student.getStudentByPhone(searchItem, function(err, student) {
			if(err)
				throw err;

			if(!student) {
				console.log('Unknown Student');
				req.session.reset(); // reset the session info
				return done(null, false, {message: 'Unknown Student.... Please try again or contact Admin'}); 
			}

			req.session.student = student;
			res.redirect('/studentRecords');
		});
	}
});

router.get('/studentRecords', isLoggedIn, function(req, res) {
	var student = req.session.student;
	res.render('studentRecords.ejs', {
		firstName: student.firstName,
		lastName: student.lastName,
		email: student.email,
		phoneNum: student.phoneNumber,
		dateOfBirth: student.dateOfBirth,
		address: student.address.address1,
		address2: student.address.address2,
		city: student.address.city,
		state: student.address.state,
		zip: student.address.zipCode,
		parentFirstName: student.parentInfo.firstName,
		parentLastName: student.parentInfo.lastName,
		parentEmail: student.parentInfo.email,
		parentPhoneNum: student.parentInfo.phoneNumber,
		parentRelationship: student.parentInfo.relationship,
		emergFirstName: student.emergencyContactInfo.firstName,
		emergLastName: student.emergencyContactInfo.lastName,
		emergEmail: student.emergencyContactInfo.email,
		emergPhoneNum: student.emergencyContactInfo.phoneNumber,
		emergRelationship: student.emergencyContactInfo.relationship
	});
});

// NEED TO FIX THIS DOES NOT WORK, SHOULD BE PUT METHOD 
router.post('/studentRecords', isLoggedIn, function(req, res) {
	// checking if exists
	if(req.session && req.session.student) { 
		console.log("Exists");
		req.locals.student = req.session.student;
		console.log('Local Student: ' + student);
	}
	else {
		console.log("Does not Exists");
	}
	var student = req.session.student;
	console.log('Current Student ID -> ' + student.id);
	console.log("Current Student " + student);
	var updateStudent = ({
		// student information
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.studentEmail,
		phoneNumber: req.body.studentPhoneNum,
		dateOfBirth: req.body.dateOfBirth,
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

	console.log();
	console.log('ID' + req.session.student.id);
	console.log('Student Updating ' + updateStudent);

	Student.findByIdAndUpdate(req.session.student.id, updateStudent, {new: true}, function(err, student) {
		if(err)
			throw err;
	
		console.log('Updated Successfully: ' + student);
		res.render('/studentRecords');
	});
});

router.get('/studentGrades', isLoggedIn, function(req, res) {
	var student = req.session.student;
	res.render('studentGrades.ejs', {
		firstName: student.firstName,
		lastName: student.lastName,
	});
});

router.get('/addGrades', isLoggedIn, function(req, res) {
	var student = req.session.student;
	console.log(student);
	res.render('addGrades.ejs');
});

// NEED TO FIX THIS
router.post('/addGrades', isLoggedIn, function(req, res) {
	//var student = req.session.student;
	var newGrade = new Grades ({
		//studentID: student.id,
		courseNumber: req.body.courseNumber,
		courseName: req.body.courseName,
		semesterTerm: req.body.semesterTerm,
		teacher: req.body.teacher,
		midtermGrade: req.body.midtermGrade,
		finalGrade: req.body.finalGrade,
		creditHours: req.body.creditHours,
		creditScore: req.body.creditScore,
		score: req.body.score,
		totalCreditHours: req.body.totalCreditHours,
		totalScore: req.body.totalScore,
		GPA: req.body.GPA
	});		
	console.log(newGrade);

	newGrade.save(function(err) {
		if(err) 
			throw err;
		console.log('New Grade Successfully Saved: ' + newGrade);
	});

	res.redirect('/dashboard');
});

router.get('/newInstructor', isLoggedIn, function(req, res) {
	res.render('newInstructor.ejs');
});

router.post('/newInstructor', isLoggedIn, function(req, res) {
	var newInstructor = new Instructor ({
        firstName: req.body.firstName,
		lastName: req.body.lastName,
        email: req.body.email,
		officeNumber: req.body.officeNum,
		cellNumber: req.body.cellNum,
		address: {
			address1: req.body.address,
			address2: req.body.address2,
			city: req.body.city,
			state: req.body.state,
			zipCode: req.body.zip
		},
		subjects: req.body.subject,
		officeLocation: req.body.officeLocation
	});
	console.log(newInstructor);

	newInstructor.save(function(err) {
		if(err) 
			throw err;
		console.log('New Instructor Successfully Saved: ' + newInstructor);
	});

	res.redirect('/dashboard');
});


module.exports = router;
