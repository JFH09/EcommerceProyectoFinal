import { Router } from "express";
import loginRegisterController from "../../controllers/loginRegister.controller.js";
import politicaAutorizacion from "../../middleware/authAccess.middleware.js";
import CustomErrors from "../../utils/utils.errors/Custom.errors.js";
import InfoErrors from "../../utils/utils.errors/Info.errors.js";
import EnumErrors from "../../utils/utils.errors/Enum.errors.js";

const router = Router();

router.get(
  "/register",
  politicaAutorizacion(["PUBLIC"]),
  loginRegisterController.getViewRegister
);

router.get(
  "/",
  politicaAutorizacion(["PUBLIC"]),
  loginRegisterController.getViewRoot
);

router.get(
  "/login",
  politicaAutorizacion(["PUBLIC"]),
  loginRegisterController.getViewLogin
);

// router.use((req, res) => {
//   console.log("entron a una url que no existe..");
//   CustomErrors.createError({
//     name: "***** Router link error ",
//     cause: InfoErrors.generateUserErrorUrl(),
//     message: "**** Error trying get link(url)",
//     code: EnumErrors.ERROR_ROUTING,
//   });
// });

export default router;
