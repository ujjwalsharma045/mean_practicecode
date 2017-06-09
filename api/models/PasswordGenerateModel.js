module.exports = function(mongoose){
    var Schema = mongoose.Schema;
		
	var passwordgenerateSchema = new Schema({
	  user_id: String,
	  token: String,	  
	  expiration_date:Date,
	  created_at: Date,
	  updated_at: Date
	});
		
	var PasswordGenerate = mongoose.model('PasswordGenerate', passwordgenerateSchema);
	return PasswordGenerate;
}

