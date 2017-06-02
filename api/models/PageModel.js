module.exports = function(mongoose){
    var Schema = mongoose.Schema;
	
	
	var pageSchema = new Schema({
	  title: String,
	  content: String,	 
      slug:String,	  
	  created_at: Date,
	  modified_at: Date,
	  status:String
	});
	
	
	var Page = mongoose.model('Page', pageSchema);
	
	return Page;
}

