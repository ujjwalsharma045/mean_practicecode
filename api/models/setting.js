module.exports = function(mongoose){
    var Schema = mongoose.Schema;
	
	
	var settingSchema = new Schema({
	  title: String,
	  content: String,	  
	  //created_at: Date,
	  //updated_at: Date
	});
	
	
	var Setting = mongoose.model('Setting', settingSchema);
	return Setting;
}

