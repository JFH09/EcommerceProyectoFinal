import Router from "express";
import CartManager from "../../dao/clases/CartManager.js";

const router = Router();
const rutaDatos = "./files/carts.json";
const cartManager = new CartManager(rutaDatos);

router.get("/", (req, resp) => {
  const productos = cartManager.getCarts();
  resp.status(201).json(productos);
});

router.get("/:idCarrito", async (req, resp) => {
  let idCarrito = req.params.idCarrito;

  let carrito = await cartManager.getCartById(idCarrito);

  resp.status(201).json(carrito);
});
router.post("/:id/:product/:idProduct", async (req, resp) => {
  const { id, product, idProduct } = req.params;
  console.log(req.body);
  //const product = cartManager.addProduct(id, productCart, idProduct);
  const carts = await cartManager.addProductToCart(id, product, idProduct);
  console.log(carts);
  resp.status(201).json(carts);
});

router.post("/", async (req, resp) => {
  const carts = await cartManager.addCart();

  resp.status(201).json(carts);
});

export default router;
