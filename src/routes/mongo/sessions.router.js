import { Router } from "express";
import userModel from "../../dao/models/user.js";
import passport from "passport";
import sessionsController from "../../controllers/sessions.controller.js";
import politicaAutorizacion from "../../middleware/authAccess.middleware.js";
import CustomErrors from "../../utils/utils.errors/Custom.errors.js";
import InfoErrors from "../../utils/utils.errors/Info.errors.js";
import EnumErrors from "../../utils/utils.errors/Enum.errors.js";
const router = Router();

router.get(
  "/github",
  politicaAutorizacion(["PUBLIC"]),
  passport.authenticate("github", { scope: ["user:email"] }),
  sessionsController.gitHub
);

router.get(
  "/githubcallback",
  politicaAutorizacion(["PUBLIC"]),
  passport.authenticate("github", { failureRedirect: "/login" }),
  sessionsController.githubcallback
);

router.post(
  "/register",
  politicaAutorizacion(["PUBLIC"]),
  passport.authenticate("register", { failureRedirect: "/login" }),
  sessionsController.register
);

// router.post(
//   "/resetPassword/newPass",
//   politicaAutorizacion(["PUBLIC"]),
//   passport.authenticate("resetPassword"),
//   sessionsController.resetPassword
// );

router.post("/login", passport.authenticate("login"), sessionsController.login);

// router.get(
//   "/user/:id",
//   politicaAutorizacion(["PUBLIC"]),
//   sessionsController.getInfoUserById
// );

router.get(
  "/logoutSession",
  politicaAutorizacion(["PUBLIC"]),
  sessionsController.logoutSession
);

// // Middleware para manejar rutas no encontradas
// router.use("*", (req, res) => {
//   console.log("entron a una url que no existe..");
//   CustomErrors.createError({
//     name: "***** Router link error ",
//     cause: InfoErrors.generateUserErrorUrl(),
//     message: "**** Error trying get link(url)",
//     code: EnumErrors.ERROR_ROUTING,
//   });
// });

export default router;
