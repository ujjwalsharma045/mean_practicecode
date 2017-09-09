module.exports = function(mongoose){
    var Schema = mongoose.Schema;
	
	var passportLocalMongoose = require('passport-local-mongoose');
	
	var productSchema = new Schema({
	   title: { type: String, required: true, unique: true },
	   description: String,
	   meta_tag: String,
	   meta_description: String,
	   price: { type: String, required: true },
	   cost_price: String,
	   discount_type: String,
	   is_featured:String,
	   discount: String,
	   created_at: Date,
	   status: String,		
	   updated_at: Date,	  
	});		
	
	productSchema.plugin(passportLocalMongoose);
	
	var Product = mongoose.model('Product', productSchema);
	
	return Product;
}

