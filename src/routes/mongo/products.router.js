import { Router } from "express";
import productsController from "../../controllers/products.controller.js";
import politicaAutorizacion from "../../middleware/authAccess.middleware.js";
import CustomErrors from "../../utils/utils.errors/Custom.errors.js";
import InfoErrors from "../../utils/utils.errors/Info.errors.js";
import EnumErrors from "../../utils/utils.errors/Enum.errors.js";

const router = Router();

router.get(
  "/productsList",
  politicaAutorizacion(["PUBLIC"]),
  productsController.getProducts
);

router.get(
  "/:id",
  politicaAutorizacion(["PUBLIC"]),
  productsController.getProductById
);

router.get(
  "/product/:product",
  politicaAutorizacion(["PUBLIC"]),
  productsController.getProductByName
);

router.post(
  "/",
  politicaAutorizacion(["ADMINISTRADOR", "PREMIUM"]),
  productsController.addNewProduct
);

router.put(
  "/:id",
  politicaAutorizacion(["ADMINISTRADOR", "PREMIUM"]),
  productsController.updateProductById
);

router.put(
  "/user/:id",
  politicaAutorizacion(["PUBLIC"]),
  productsController.updateProductByIdUser
);
//solo puede eliminar un administrador...
router.delete(
  "/:id",
  politicaAutorizacion(["ADMINISTRADOR", "PREMIUM"]),
  productsController.deleteProductById
);

router.get(
  "/",
  politicaAutorizacion(["PUBLIC"]),
  productsController.getViewProducts
);
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
