import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const productCollection = "products";

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: String,
  thumbnail: String,
  code: String,
  stock: String,
  owner: String,
});
productSchema.plugin(mongoosePaginate);
const productModel = mongoose.model(productCollection, productSchema);

export default productModel;
