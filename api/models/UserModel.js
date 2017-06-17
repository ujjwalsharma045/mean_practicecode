module.exports = function(mongoose){
    var Schema = mongoose.Schema;
	
	var passportLocalMongoose = require('passport-local-mongoose');
	
	var userSchema = new Schema({
	  first_name: String,
	  last_name: String,
	  email: String,
	  username: { type: String, required: true, unique: true },
	  password: { type: String, required: true },
	  address: String,
	  city: String,
	  state: String,
	  zipcode: String,
	  dateofbirth: String,
	  profile_pic: String,
	  created_at: Date,
	  updated_at: Date,
	  is_admin:String,
	  userprofiles:[{type:Schema.Types.ObjectId, ref:'UserProfile'}]
	});		
	
	userSchema.plugin(passportLocalMongoose);
	
	var User = mongoose.model('User', userSchema);
	
	return User;
}

