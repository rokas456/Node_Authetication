var mongoose = require('mongoose');
//var bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost/nodeauth');

// Db connection
var db = mongoose.connection;

// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index: true
	},

	password:{
		type: String, required: true, bcrypt:true
	},

	email:{
		type: String
	},

	name:{
		type: String
	},

	profileImage:{
		type: String
	}

});


var User = module.exports = mongoose.model('User', UserSchema);
// Is not working for some reason ^^
module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}
//Needs Bcrypt still
module.exports.createUser = function(newUser, callback){
	// bcrypt.has(newUser.password, 10, function(err, hash){
	// 	if(err) throw err;
	// 	//Set hashesd pw
	// 	newUser.password = hash;
	// 	//Create User
	// 	newUser.save(callback);
	// });

	newUser.save(callback);

}
