var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var StudentSchema = mongoose.Schema({
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
    phoneNumber: {
        type: String,
        required: true
    },
    dateOfBirth: {
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
    parentInfo: {
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
        phoneNumber: {
            type: String,
            required: true
        },
        relationship: {
            type: String,
            required: true
        }
    },
    emergencyContactInfo: {
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
        phoneNumber: {
            type: String,
            required: true
        },
        relationship: {
            type: String,
            required: true
        }
    }
});

var Student = module.exports = mongoose.model('Student', StudentSchema);

module.exports.getStudentById = function(id, callback) {
    Student.findById(id, callback);
}