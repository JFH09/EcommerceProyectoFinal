import { Router } from "express";
import ProductManager from "../../dao/clases/ProductManager.js";

const router = Router();
const rutaDatos = "./files/products.json";
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
    resp.send(respuesta);
  } else {
    const productos = await productManager.getProducts();
    resp.send(productos);
  }
});

router.get("/:idProduto", async (req, resp) => {
  let idProduto = req.params.idProduto;

  let producto = await productManager.getProductById(idProduto);

  resp.send(producto);
});

router.post("/", async (req, resp) => {
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

router.put("/:id", async (req, resp) => {
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

router.delete("/:id", (req, resp) => {
  const { id } = req.params;

  const product = productManager.deleteProductById(id);

  resp.status(200).json(product);
});

export default router;
