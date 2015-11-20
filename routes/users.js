var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Makes connection to user.js which comes back as an object
var User = require('../models/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', {
  	'title': 'Register'
  });
});

router.get('/login', function(req, res, next) {
  res.render('login', {
  	'title': 'Login'
  });
});


router.post('/register', function(req, res, next){
	// Get the form values
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;


// Check for Image Field
if(req.body.profileimage){
	console.log('Uploading File...');

	var profileImageOriginalName = req.files.profileimage.originalname;
	var profileImageName = req.files.profileimage.name;
	var profileImageMime = req.files.profileimage.mimeType;
	var profileImagePath = req.files.profileimage.path;
	var profileImageExt = req.files.profileimage.extensions;
	var profileImageSize = req.files.profileimage.size;
}else{
	// Set default Image
	var profileImageName = 'noimage.png';

}

// Form Validation
	req.checkBody('name', 'Name field is required').notEmpty();
	req.checkBody('email', 'Email field is required').notEmpty();
	req.checkBody('email', 'Email not valid').isEmail();
	req.checkBody('username', 'Username field is required').notEmpty();
	req.checkBody('password', 'Password field is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	// Check for errors
	var errors = req.validationErrors();

	if(errors){
		res.render('register', {
			errors:errors,
			name: name,
			email: email,
			username: username,
			password: password,
			password2: password2
		});
	}else{
		var newUser = new User({
			name: name,
			email: email,
			username: username,
			password: password,
			profileImage: profileImageName
		});

		// Create User
		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
			req.flash('success', 'You are now registered and may log in');

		});
			res.location('/');
			res.redirect('/');
	}
});

passport.use(new LocalStrategy(
	function(username, password, done){
		User.getUserByUsername(username, function(err, user){
			if(err) throw err ;
			if(!user){
				console.log('Unkown User');
				return done(null, false, {message:'Unknown user'});
			}
		});
	}
));

router.post('/login', passport.authenticate('local', {failureRedirect:'/users/login', failureFlash:'Invalid username or password'}), function(req, res){
	console.log('Authetication Succesful');
	req.flash('success', 'You are logged in');
	res.redirect('/');

});

module.exports = router;
