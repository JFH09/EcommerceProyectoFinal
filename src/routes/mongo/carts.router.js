import { Router } from "express";
import cartsController from "../../controllers/carts.controller.js";
import politicaAutorizacion from "../../middleware/authAccess.middleware.js";
const router = Router();

router.get(
  "/",
  politicaAutorizacion(["USUARIO", "PREMIUM"]),
  cartsController.getRootCart
);

router.get("/:id", cartsController.getViewCartById);

router.get("/:id/carrito", cartsController.getCartById);

//AGREGANDO N PRODUCTOS A CARRITO - solo el usuario puede agregar products
router.put(
  "/:idCarrito/:product/:idProduct/2",
  politicaAutorizacion(["USUARIO", "PREMIUM"]),
  cartsController.addNProductsToCart
);

router.put(
  "/:idCarrito",
  //politicaAutorizacion(["USER_PREMIUM"]),
  politicaAutorizacion(["PUBLIC"]),
  cartsController.editCartByIdandArrayProducts
);

router.delete(
  "/:id",
  politicaAutorizacion(["USUARIO", "PREMIUM"]),
  cartsController.deleteCartById
);

router.post("/", politicaAutorizacion(["PUBLIC"]), cartsController.addNewCart);

//Agregando id del producto al carrito...
router.put(
  "/:idCart/:product/:idProduct",
  politicaAutorizacion(["USUARIO", "PREMIUM"]),
  cartsController.addIdProductToCart
);

//Disminuir cantidad de producto en carrito por id
router.delete(
  "/:idCart/product/:idProduct",
  politicaAutorizacion(["USUARIO", "PREMIUM"]),
  cartsController.restCantProductoById
);
//Eliminando todo el producto del carrito
router.delete(
  "/:idCart/:product/:idProduct",
  politicaAutorizacion(["USUARIO", "PREMIUM"]),
  cartsController.deleteAllProductCart
);

router.get("/:idCart/purchase", cartsController.getViewPurchase);
router.get("/:idCart/purchase/:ticketId", cartsController.getInfoPurchase);
router.get("/ticket/:idTicket", cartsController.getInfoTicket);
router.post("/:idCart/purchase", cartsController.addTicketToPurchase);
router.delete("/:idCart/purchase", cartsController.deleteTicketToPurchase);
// router.put(
//   "/:idCart/purchase",
//   cartsController.uptdatePurchaseAndCartAndProducts
// );

router.use("*", (req, res) => {
  console.log("entron a una url que no existe..");
  CustomErrors.createError({
    name: "***** Router link error ",
    cause: InfoErrors.generateUserErrorUrl(),
    message: "**** Error trying get link(url)",
    code: EnumErrors.ERROR_ROUTING,
  });
});
export default router;
