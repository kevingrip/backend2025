import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'

mongoose.pluralize(null);

const collection = 'variant'; 

const productSchema = new mongoose.Schema({

    id: {type: Number, required: true},

    title: { type: String, required: true },

    description: { type: String, required: false },

    code: {type: String, required: true},

    price: { type: Number, required: true },

    status: {type: Boolean, required: true},

    stock: {type: Number, required: true},

    category: {type: String, required: true},

    thumbnails: { type: [String], required: false },


},{ versionKey: false });

productSchema.plugin(mongoosePaginate)

const productModel = mongoose.model(collection, productSchema); 

export default productModel;