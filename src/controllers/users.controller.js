import userModel from "../dao/models/user.js";
import User from "../dao/models/user.dao.js";

const userServiceDAO = new User();

const getViewDocuments = async (req, res) => {
  let id = req.params;
  let user = req.session.user;
  try {
    res.render("documents", user);
  } catch (err) {
    console.log("No se pudo cargar la vista");
  }
};

const uploadFile = async (req, res, next) => {
  let { id } = req.params;
  let { nombreCarpeta } = req.params;
  console.log(nombreCarpeta);
  let rutaDocCargado = nombreCarpeta.split("/");
  let documentoCargado = rutaDocCargado.pop();
  console.log(documentoCargado);
  console.log("entra a post uploadFile 21");
  const file = req.file;
  if (!file) {
    const error = new Error("Please upload a file - userController");
    error.httpStatusCode = 400;
    return next(error);
  }

  let userInfo = await userServiceDAO.getInfoUserById(id);
  console.log(userInfo);

  if (userInfo.documents.length != 0) {
    let exiteDocumentoCargado = userInfo.documents.find(
      (doc) => doc.name == documentoCargado
    );
    console.log(exiteDocumentoCargado);
    if (!exiteDocumentoCargado) {
      userInfo.documents.push({
        name: documentoCargado,
        status: "cargado",
        fileName: file.filename,
      });
      console.log(userInfo);
      let usuarioActualizado = await userServiceDAO.updateStatusFiles(
        id,
        userInfo
      );
      console.log(usuarioActualizado);
      // req.session.user = {
      //   first_name: userInfo.first_name,
      //   last_name: userInfo.last_name,
      //   email: userInfo.email,
      //   id: userInfo.id,
      //   age: userInfo.age,
      //   rol: userInfo.rol,
      //   idCart: userInfo.idCart,
      //   documents: userInfo.documents,
      // };
      req.session.user.documents = userInfo.documents;
      let contadorObligatorios = 0;
      for (const documento of userInfo.documents) {
        console.log(documento.name);
        if (
          documento.name == "documentscomprobanteDomicilio" ||
          documento.name == "documentsidentificacion" ||
          documento.name == "documentscomprobanteEstadoCuenta"
        ) {
          contadorObligatorios++;
          console.log(contadorObligatorios);
        }
      }
      req.session.user.contadorDocs = contadorObligatorios;
      console.log("usuario en updateFiles 60", req.session.user);
      res.send({ status: "success", payload: file });
    } else {
      let positionDoc = userInfo.documents.indexOf(exiteDocumentoCargado);
      console.log(positionDoc);
      userInfo.documents[positionDoc] = {
        name: documentoCargado,
        status: "cargado",
        fileName: file.filename,
      };
      let usuarioActualizado = await userServiceDAO.updateStatusFiles(
        id,
        userInfo
      );
      // req.session.user = {
      //   first_name: userInfo.first_name,
      //   last_name: userInfo.last_name,
      //   email: userInfo.email,
      //   id: userInfo.id,
      //   age: userInfo.age,
      //   rol: userInfo.rol,
      //   idCart: userInfo.idCart,
      //   documents: userInfo.documents,
      // };
      req.session.user.documents = userInfo.documents;
      console.log("usuario en updateFiles 84", req.session.user);
      res.send({
        status: "error",
        payload:
          "El documento ya existia, no era  necesario volverlo a cargarlo, se Actualizo el dato en la base de ",
        fileName: file,
      });
    }
  } else {
    console.log("esta vacio");
    userInfo.documents.push({
      name: documentoCargado,
      status: "cargado",
      fileName: file.filename,
    });
    console.log(userInfo);
    let usuarioActualizado = await userServiceDAO.updateStatusFiles(
      id,
      userInfo
    );
    console.log(usuarioActualizado);
    // req.session.user = {
    //   first_name: userInfo.first_name,
    //   last_name: userInfo.last_name,
    //   email: userInfo.email,
    //   id: userInfo.id,
    //   age: userInfo.age,
    //   rol: userInfo.rol,
    //   idCart: userInfo.idCart,
    //   documents: userInfo.documents,
    // };
    req.session.user.documents = userInfo.documents;
    console.log("usuario en updateFiles 94 USERcONTROLLER", req.session.user);
    res.send({ status: "success", payload: file });
  }
};

const getInfoUsersById = async (req, res) => {
  let { id } = req.params;
  try {
    let infoUsuario = userModel.findOne({ _id: id });

    res.send({ status: "success", payload: infoUsuario });
  } catch (err) {
    console.log("No se pudo obtener la información");
  }
};

const getInfoAllUsers = async (req, res) => {
  try {
    let infoUsuarios = await userModel.find({}, "fullName email rol");
    console.log(infoUsuarios);

    res.send({ status: "success", payload: infoUsuarios });
  } catch (err) {
    console.log("No se pudo obtener la información");
  }
};

const deleteUsersLastConnect2days = async (req, res) => {
  try {
    let usersDeleted = await userServiceDAO.deleteUsersLastConnectBy2days();
    console.log(usersDeleted);

    res.send({ status: "success", payload: usersDeleted });
  } catch (err) {
    console.log("No se pudo obtener la información 1");
  }
};

const getViewPanelAdminUsers = async (req, res) => {
  let user = req.session.user;
  console.log("user: ", user);
  try {
    res.render("panelAdminUsers", { user });
  } catch (err) {
    console.log("No se pudo cargar la vista");
  }
};

const changeRolAdmin = async (req, res) => {
  req.logger.info("buscando info usuario...!!!!!!");
  let { id } = req.params;
  console.log("body ", req.body);
  let { rol } = req.body;
  console.log("87 newRol", rol);
  let user = await userServiceDAO.changeRolAdmin(req);
  // if (result.status != "error") {
  if (user) {
    console.log(user);
    user.rol = rol;
    console.log("usuario actualizado rol quedo => ", user);

    let result = await userModel.updateOne({ _id: id }, user);
    console.log(result);
    res.json({
      status: "success",
      payload: "se Actializo el rol satisfactoriamente",
    });
  } else {
    // res.send(401).json({
    //   status: "error",
    //   error: "no se pudo obtener la informacion del usuario",
    // });
    console.log("error al actualizar rol");
  }
};

const deleteUserById = async (req, res) => {
  let { id } = req.params;
  try {
    let infoUsuario = await userModel.deleteOne({ _id: id });
    res.send({ status: "success", payload: infoUsuario });
  } catch (err) {
    console.log("No se pudo obtener la información");
    res.send({
      status: "error",
      payload: "No se pudo obtener la información, pruebe mas tarde",
    });
  }
};

export default {
  getViewDocuments,
  uploadFile,
  getInfoUsersById,
  getInfoAllUsers,
  deleteUsersLastConnect2days,
  getViewPanelAdminUsers,
  changeRolAdmin,
  deleteUserById,
};
