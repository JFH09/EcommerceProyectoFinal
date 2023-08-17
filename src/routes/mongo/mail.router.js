import { Router } from "express";
import politicaAutorizacion from "../../middleware/authAccess.middleware.js";
import mailController from "../../controllers/mail.controller.js";
import passport from "passport";

const router = Router();

router.get(
  "/passRecovery/:email",
  politicaAutorizacion(["PUBLIC"]),
  mailController.getEmailRecover
);

router.get(
  "/resetPassword/:email/:code",
  politicaAutorizacion(["PUBLIC"]),
  mailController.getResetPassword
);
router.get(
  "/resetPassword/:code",
  politicaAutorizacion(["PUBLIC"]),
  mailController.getResetPasswordCodeExpiration
);

router.delete(
  "/resetPassword/:code",
  politicaAutorizacion(["PUBLIC"]),
  mailController.deleteResetPasswordCodeExpiration
);

router.post("/sendEmail/:userDestination", mailController.sendMail);

// router.post(
//   "/resetPassword/:email/:code",
//   politicaAutorizacion(["PUBLIC"]),
//   mailController.updateResetPasswordCodeExpiration
// );

router.put(
  "/resetPassword/newPass",
  politicaAutorizacion(["PUBLIC"]),
  mailController.resetPassword
);
export default router;
