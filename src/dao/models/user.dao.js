import moment from "moment/moment.js";
import userModel from "./user.js";

export default class User {
  login = async (req) => {
    console.log(req);

    try {
      let idUser = JSON.stringify(req.user._id);
      // console.log(idUser);
      let id = "";
      id = idUser.split('"');
      // console.log(id[1]);
      let infoUsuario = await userModel.findById(id[1]);
      let idCart = JSON.stringify(infoUsuario.carts[0]._id);
      // console.log("id cart ------", typeof idCart);
      idCart = idCart.split('"');
      console.log(idCart[1]);
      console.log(
        "55 sessionRouter - Informacion usuario logueado ->",
        infoUsuario
      );
      let contadorObligatorios = 0;
      for (const documento of infoUsuario.documents) {
        // console.log(documento.name);
        if (
          documento.name == "documentscomprobanteDomicilio" ||
          documento.name == "documentsidentificacion" ||
          documento.name == "documentscomprobanteEstadoCuenta"
        ) {
          contadorObligatorios++;
          // console.log(contadorObligatorios);
        }
      }
      req.session.user = {
        first_name: infoUsuario.first_name,
        last_name: infoUsuario.last_name,
        email: infoUsuario.email,
        id: id[1],
        age: infoUsuario.age,
        rol: infoUsuario.rol,
        idCart: idCart[1],
        documents: infoUsuario.documents,
        contadorDocs: contadorObligatorios,
      };
      // console.log("User Session en login -> 32 ", req.session.user);
      let date = new Date(Date.now());
      // console.log("usuario antes de iniciar sesion => ", infoUsuario);
      //date = date.toLocaleString("es-CO");
      infoUsuario.last_connection = date;
      infoUsuario.contadorDocs = contadorObligatorios;
      // console.log("usuario despues de iniciar sesion => ", infoUsuario);
      let userUpdated = await userModel.updateOne(
        { _id: infoUsuario._id },
        infoUsuario
      );
      console.log(
        "usuario actualizado en user dao fecha login 38",
        userUpdated
      );

      return { status: "success", payload: req.user };
    } catch (error) {
      console.log(
        "no se pudo realizar la operacion - entro al catch en user.dao - 42"
      );
      return "no se pudo realizar la accion";
    }
  };

  getInfoUserById = async (id) => {
    try {
      let user = await userModel.findById(id);
      console.log(user);
      return user;
    } catch (error) {
      console.log("no se pudo obtener la información ");
      return "no se pudo obtener la información ";
    }
  };

  getInfoUserByEmail = async (email) => {
    try {
      console.log(email);
      let user = await userModel.findOne({ email: email });
      console.log(user);
      return user;
    } catch (error) {
      console.log("no se pudo obtener la información ");
      return "no se pudo obtener la información ";
    }
  };
  updatePassByUserEmail = async (user) => {
    try {
      console.log("actualizando pass...");
      let userUpdated = await userModel.updateOne({ email: user.email }, user);
      console.log("actualizando pass -> result -> ", userUpdated);

      return userUpdated;
    } catch (error) {
      console.log("no se pudo obtener la información ");
      return "no se pudo obtener la información ";
    }
  };

  changeRol = async (req) => {
    let { id } = req.params;
    let { newRol } = req.body;
    console.log(req.body);
    console.log(req.params);
    console.log("id usuario = ", id);
    let idUsuario = id.split(" ");
    // console.log("ROL ACTUAL DE USER -> ", req.session.user.rol);
    try {
      //let idUser = JSON.stringify(req.user._id);
      //console.log(idUser);
      //let id = "";
      //id = idUser.split('"');
      console.log(idUsuario);
      let user = await userModel.findById(idUsuario[1]);
      console.log("informacion usuario a actualizar ", user);
      return user;
    } catch (error) {
      console.log("no se pudo realizar la operacion ");
      return "no se pudo realizar la accion";
    }
  };

  changeRolAdmin = async (req) => {
    let { id } = req.params;
    let { newRol } = req.body;
    console.log(req.body);
    console.log(req.params);

    // console.log("ROL ACTUAL DE USER -> ", req.session.user.rol);
    try {
      //let idUser = JSON.stringify(req.user._id);
      //console.log(idUser);
      //let id = "";
      //id = idUser.split('"');
      // console.log(idUsuario);
      let user = await userModel.findById(id);
      console.log("informacion usuario a actualizar ", user);
      return user;
    } catch (error) {
      console.log("no se pudo realizar la operacion ");
      return "no se pudo realizar la accion";
    }
  };

  updateStatusFiles = async (id, userInfo) => {
    try {
      let user = await userModel.updateOne({ _id: id }, userInfo);
      console.log(user);
      return user;
    } catch (error) {
      console.log("no se pudo obtener la información ");
      return "no se pudo obtener la información ";
    }
  };

  deleteUsersLastConnectBy2days = async () => {
    try {
      let infoUsuarios = await userModel.find(
        {},
        "fullName email rol last_connection"
      );
      console.log(infoUsuarios);

      let dateNow = new Date(Date.now());
      let usersDeleted = [];
      for (const usuario of infoUsuarios) {
        let dateUserLastConnection = moment(usuario.last_connection);
        let now = moment(dateNow);
        let horasDiferencia = now.diff(dateUserLastConnection, "hours");
        if (horasDiferencia >= 48) {
          let usuarioEliminado = await userModel.deleteOne({
            _id: usuario._id,
          });
          usersDeleted.push(usuario);
          console.log(
            "se elimino el usuario ",
            // usuario._id,
            " - ",
            usuarioEliminado
          );
        }
      }
      console.log(
        "Por desconexion mayor a 2 dias se eliminaron los siguientes ususarios -> ",
        usersDeleted
      );

      return usersDeleted;
    } catch (error) {
      return "No se pudo obtener la información";
    }
  };
}
