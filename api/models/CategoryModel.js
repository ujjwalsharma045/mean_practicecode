module.exports = function(mongoose){
    var Schema = mongoose.Schema;
	
	var categorySchema = new Schema({
	  title: String,
	  value: String,
	  type: String,
	  created_at: Date,
	  updated_at: Date
	});
		
	var Category = mongoose.model('Category', categorySchema);
	
	return Category;	
}

