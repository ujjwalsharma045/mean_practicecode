module.exports = function(mongoose){
    var Schema = mongoose.Schema;
	
	
	var pageSchema = new Schema({
	  title: String,
	  content: String,	  
	  created_at: Date,
	  updated_at: Date
	});
	
	
	var Page = mongoose.model('Page', pageSchema);
	return Page;
}

