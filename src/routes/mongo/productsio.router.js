import express from "express";
import ProductManager from "../../dao/clases/ProductManager.js";

const router = express.Router();
const rutaDatos = "./src/clases/files/products.json";
const productManager = new ProductManager(rutaDatos);

router.get("/", async (req, resp) => {
  const limite = req.query.limit;
  if (limite != null) {
    const productos = await productManager.getProducts();
    let respuesta;
    if (limite > productos.length || limite < 0) {
      respuesta = "Ingrese un limite de productos valido";
    } else {
      productos.length = limite;
      respuesta = productos;
    }
    resp.render("home", { productos });
  } else {
    const productos = await productManager.getProducts();
    console.log(productos);
    resp.render("home", { productos });
  }
});

router.get("/products/:idProducto", async (req, resp) => {
  let idProducto = req.params.idProducto;
  console.log("entro..", req.params);
  let productos = await productManager.getProductById(idProducto);
  console.log(productos);
  resp.render("home", { productos });
});

router.post("/products/post", async (req, resp) => {
  const { title, description, price, thumbnail, code, stock } = req.body;
  console.log(req.body);
  let product = await productManager.addProduct(
    title,
    description,
    price,
    thumbnail,
    code,
    stock
  );

  //resp(product);
  resp.status(201).json(product);
});
router.put("/products/:id", async (req, resp) => {
  const { id } = req.params;
  const productId = id;
  console.log(productId);
  const { title, description, price, thumbnail, code, stock } = req.body;
  const productEdit = { title, description, price, thumbnail, code, stock };
  const product = await productManager.updateProductByIdAndObject(
    productId,
    productEdit
  );
  resp.status(201).json(product);
});

router.delete("/products/:id", (req, resp) => {
  const { id } = req.params;

  const product = productManager.deleteProductById(id);

  resp.status(200).json(product);
});
router.get("/realtimeproducts", async (req, resp) => {
  //const productos = await productManager.getProducts();
  //console.log(productos);
  //resp.render("realTimeProducts", { productos });
  resp.render("realTimeProducts", {});
});

export default router;
