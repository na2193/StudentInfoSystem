var express = require('express');
var router = express.Router();
var Student = require('../models/student');


router.get('/dashboard', function(req, res) {
    res.render('dashboard.ejs');
});

router.get('/newStudents', function(req, res) {
	res.send('Add New Students Page');
});

// add verifications
router.post('/newStudents', function(req, res) {
	// student information
	var firstName = req.params.firstName;
	var lastName = req.params.lastName;
	var studentEmail = req.params.studentEmail;
	var studentPhoneNum = req.params.studentPhoneNum;
	var dateOfBirth = req.params.dateOfBirth;
	var address = req.params.address;
	var address2 = req.params.address2;
	var city = req.params.city;
	var state = req.params.state;
	var zip = req.params.zip;
	
	// parent information
	var parentFirstName = req.params.parentFirstName;
	var parentLastName = req.params.parentLastName;
	var parentEmail = req.params.parentEmail;
	var parentPhoneNum = req.params.parentPhoneNum;
	var parentRelationship = req.params.parentRelationship;
	
	// emergency contact information
	var emergFirstName = req.params.emergFirstName;
	var emergLastName = req.params.emergLastName;
	var emergEmail = req.params.emergEmail;
	var emergPhoneNum = req.params.emergPhoneNum;
	var emergRelationship = req.params.emergRelationship;
	
});

router.get('/newClass', function(req, res) {
	res.send('Add New Class Page');
});

router.post('/newClass', function(req, res) {
	var className = req.params.className;
	var instructorName = req.params.instructorName;
	var email = req.params.email;
	var phoneNume = req.params.phoneNum;
	var startDate = req.params.startDate;
	var endDate = req.params.endDate;
	var maxStudents = req.params.maxStudents;
	var startTime = req.params.startTime;
	var endTime = req.params.endTime;
	var meetingDays1 = req.params.meetingDays1;
	var meetingDays2 = req.params.meetingDays2;
	var classLocation = req.params.classLocation;
});	

router.get('/studentRecords', function(req, res) {
	res.send('View Student Records Page');
});

router.post('/searchStudentRecords', function(req, res) {
	// search for student on mongodb based on user input
	// pre-fill the form with those information
	var dropDownOption = req.params.searchBySelectPicker;
	console.log('The Selected Option is: ' + dropDownOption);
	
});

router.put('/studentRecords', function(req, res) {
	
});

	
module.exports = router;