var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('login.ejs');
});

router.post('/', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    console.log('Email: ' + email);
    console.log('Password: ' + password);
});

router.get('/login', function(req, res) {

});

router.post('/login', function(req, res) {

});


router.get('/register', function(req, res) {
	res.send('Register Page');
});

module.exports = router;