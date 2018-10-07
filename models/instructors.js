var mongoose = require('mongoose');

var InstructorSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    officeNumber: {
        type: String,
        required: true
    },
    cellNumber: {
        type: String,
        required: true
    },
    address: {
        address1: {
            type: String,
            required: true
        },
        address2: String,
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        zipCode: {
            type: Number,
            required: true
        }
    },
    subjects: [{
        type: String,
        required: true
    }],
    officeLocation: {
        type: String,
        required: true
    }
});

var Instructor = module.exports = mongoose.model('Instructor', InstructorSchema);