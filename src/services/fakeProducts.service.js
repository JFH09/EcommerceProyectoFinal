import productModel from "../dao/models/product.model.js";
import { generateProduct } from "../utils.js";
export default class FakeProduct {
  getFakeProducts = async (ownerInfo) => {
    try {
      const products = [];
      console.log("entro a generateProducts 2");
      for (let i = 0; i <= 100; i++) {
        //console.log("CREANDO PRODUCT FAKEPRODUCT9", generateProduct());
        let newProduct = await productModel.create(generateProduct(ownerInfo));
        //let newProduct = await generateProduct();
        //console.log(newProduct);
        products.push(newProduct);
      }
      console.log(products);
      return products;
    } catch (error) {
      return error;
    }
  };
}
