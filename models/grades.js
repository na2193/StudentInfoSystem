var mongoose = require('mongoose');

var GradesSchema = mongoose.Schema({
	studentID: {
		type: String, //maybe Object (mongodb objectId)
		required: true
	},
	courseNumber: {
		type: String,
		required: true
	},
	courseName: {
		type: String,
		required: true
	},
	semesterTerm: {
		type: String,
		required: true
	},
	teacher: {
		type: String,
		required: true
	},
	midtermGrade: {
		type: String,
		required: true
	},
	finalGrade: {
		type: String,
		required: true
	},
	creditHours: {
		type: Number,
		required: true
	},
	creditScore: {
		type: String,
		required: true
	},
	score: {
		type: Number,
		required: true
	},
	totalCreditHours: {
		type: Number,
		required: true
	},
	totalScore: {
		type: Number,
		required: true
	},
	GPA: {
		type: Number,
		required: true
	}
});

var Grade = mongoose.exports = mongoose.model('Grade', GradesSchema);
