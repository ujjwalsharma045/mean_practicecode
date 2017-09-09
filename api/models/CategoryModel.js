module.exports = function(mongoose){
    var Schema = mongoose.Schema;
	
	var categorySchema = new Schema({
	  title: String,
	  description:String,
	  meta_tag:String,
	  meta_description:String,
	  status:String,
	  order:String,
	  parent_id:String,
	  value: String,
	  type: String,
	  created_at: Date,
	  updated_at: Date
	});
		
	var Category = mongoose.model('Category', categorySchema);
	
	return Category;	
}

