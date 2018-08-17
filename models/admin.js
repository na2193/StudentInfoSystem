var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var AdminSchema = mongoose.Schema({
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
    password: {
        type: String,
        required: true
    }
});

var Admin = module.exports = mongoose.model('Admin', AdminSchema);

// function to crete a new admin
module.exports.createAdmin = function(newAdmin, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newAdmin.password, salt, function(err, hash) {
	        newAdmin.password = hash;
	        newAdmin.save(callback);
	    });
	});
}

// function to check duplication in db
AdminSchema.pre('save', function(next) {
    var self = this;
    Admin.find({email: self.email}, function(err, docs) {
        if(!docs.length) {
            next();
        }
        else {
            console.log('Email already exists: ', self.email);
            next(new Error('Email Exists'));
        }
    });
});

// function to get admin by email and exporting it
module.exports.getAdminByEmail = function(email, callback) {
    var query = {email: email};
    Admin.findOne(query, callback);
}

// function get get a admin object by id
module.exports.getAdminById = function(id, callback){
	Admin.findById(id, callback);
}

// function to compare password
module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err)
            throw err;

        callback(null, isMatch);
    });
}
