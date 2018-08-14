var router = express.Router();

router.get('/', function(req, res) {
    res.send('Login Page');
});

router.get('/register', function(req, res) {
	res.send('Register Page');
});

module.exports = router;