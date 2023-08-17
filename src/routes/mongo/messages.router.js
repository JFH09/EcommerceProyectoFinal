import { Router } from "express";
import { messageModel } from "../../dao/models/message.model.js";
import messagesController from "../../controllers/messages.controller.js";
import politicaAutorizacion from "../../middleware/authAccess.middleware.js";
import CustomErrors from "../../utils/utils.errors/Custom.errors.js";
import InfoErrors from "../../utils/utils.errors/Info.errors.js";
import EnumErrors from "../../utils/utils.errors/Enum.errors.js";

const router = Router();

router.get(
  "/",
  politicaAutorizacion(["PUBLIC"]),
  messagesController.getViewMessages
);

router.post(
  "/",
  politicaAutorizacion(["USUARIO", "PREMIUM"]),
  messagesController.addNewChat
);

router.get(
  "/messages",
  politicaAutorizacion(["USUARIO", "PREMIUM"]),
  messagesController.getMessages
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
