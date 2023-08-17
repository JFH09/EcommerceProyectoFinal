import { Router } from "express";
import sessionsController from "../../controllers/sessions.controller.js";
import politicaAutorizacion from "../../middleware/authAccess.middleware.js";
import usersController from "../../controllers/users.controller.js";
import { upload } from "../../utils.js";
import userModel from "../../dao/models/user.js";
const router = Router();

router.put(
  "/premium/:id",
  politicaAutorizacion(["USUARIO", "PREMIUM"]),
  sessionsController.changeRol
);

router.get(
  "/:id/documents",
  politicaAutorizacion(["USUARIO", "PREMIUM"]),
  usersController.getViewDocuments
);

router.put(
  "/uploadFile/:nombreCarpeta/:id",
  upload.single("documento"),
  usersController.uploadFile

  // router.put("/update/${idUsuario}/${documentoCargado}")
);

router.get(
  "/",
  politicaAutorizacion(["ADMINISTRADOR"]),
  usersController.getInfoAllUsers
);
router.delete(
  "/",
  politicaAutorizacion(["ADMINISTRADOR"]),
  usersController.deleteUsersLastConnect2days
);
router.get(
  "/panelAdminUsers",
  politicaAutorizacion(["ADMINISTRADOR"]),
  usersController.getViewPanelAdminUsers
);

router.put(
  "/rol/:id",
  politicaAutorizacion(["ADMINISTRADOR"]),
  usersController.changeRolAdmin
);

router.delete(
  "/:id",
  politicaAutorizacion(["ADMINISTRADOR"]),
  usersController.deleteUserById
);

// router.get(
//   "/infoUser/:id",
//   politicaAutorizacion(["USUARIO", "PREMIUM"]),
//   usersController.getInfoUsersById
// );

export default router;
