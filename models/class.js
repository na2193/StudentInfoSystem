var mongoose = require('mongoose');

var ClassSchema = mongoose.Schema({
	className: {
        type: String,
        required: true
    },
	instructorName: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	phoneNumber: {
		type: String,
		required: true
	},
	startDate: {
		type: Date,
		required: true
	}, 
	endDate: {
		type: Date,
		required: true
	}, 
	maxStudents: {
		type: Number,
		required: true
	},
	startTime: {
		type: String,
		required: true
	},
	endTime: {
		type: String,
		required: true
	},
	meetingDays1: {
		type: String,
		required: true
	},
	meetingDays2: {
		type: String,
		required: true
	}, 
	classLocation: {
		type: String,
		required: true
	}
});

var Class = module.exports = mongoose.model('Class', ClassSchema);