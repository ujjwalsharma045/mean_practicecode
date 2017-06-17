module.exports = function(mongoose){
    var Schema = mongoose.Schema;
	
	var userprofileSchema = new Schema({
	   description:String,	  
	   created_at:Date,
	   updated_at:Date,
	   user_id:{type:Schema.Types.ObjectId, ref:'User'}
	});
	
	
	var UserProfile = mongoose.model('UserProfile', userprofileSchema);
	return UserProfile;
}

