import userModel from "../dao/models/user.js";
import transport from "../utils/email.js";
import config from "../config/config.js";
import linkModel from "../dao/models/link.model.js";
import { v4 as uuidv4 } from "uuid";
import { createHash, isValidPassword } from "../utils.js";
import User from "../dao/models/user.dao.js";

const userServiceDAO = new User();

const getEmailRecover = async (req, res) => {
  let { email } = req.params;

  try {
    req.logger.info("validando el email ingresado...");
    let emailVerificado = await userModel.findOne({ email: email });
    if (!emailVerificado.payload) {
      const randomToLink = uuidv4();
      //   const expirationTime = new Date(Date.now() + 10 * 60 * 1000); 10min
      let expirationTime = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hora en milisegundos
      //let expirationTime = new Date();
      console.log(expirationTime);
      expirationTime = expirationTime.toLocaleString("es-CO");
      console.log(expirationTime);
      const linkInfo = await linkModel.create({
        code: randomToLink,
        expireAt: expirationTime,
      });
      console.log(linkInfo);
      let link = `http://localhost:${config.port}/api/mail/resetPassword/${email}/${linkInfo.code}`;
      console.log(link);
      let result = await transport.sendMail({
        from: `ECOMMERCE <${config.gmailEmail}>`,
        to: email,
        subject: "Reestablece tu contraseña",
        html: `
              <div>
              <p>Ingresa al siguiente link para reestablecer tu contraseña: </p>
              <a href="${link}">Recuperar Mi Contraseña</a>
              </div>
              `,
        attachments: [],
      });
      //console.log(result);
      if (result) {
        res.json({ status: "success", payload: "El email esta registrado" });
      } else {
        res.json({ status: "error", payload: "error" });
      }
    } else {
      res.json({ status: "error", payload: "error" });
    }
  } catch (err) {
    res.json({ status: "error", payload: "error" });
  }
};

const getResetPassword = async (req, res) => {
  let email = req.params.email;
  let codeLink = req.params.code;

  res.render("resetPassword", { email, codeLink });
};

const getResetPasswordCodeExpiration = async (req, res) => {
  let codeLink = req.params.code;

  try {
    let code = await linkModel.findOne({ code: codeLink });
    console.log(code);
    res.json({ status: "success", payload: code });
  } catch (err) {
    console.log(err);
    res.json({ status: "error", payload: err });
  }
};

const deleteResetPasswordCodeExpiration = async (req, res) => {
  let codeLink = req.params.code;

  try {
    let code = await linkModel.deleteOne({ code: codeLink });
    console.log(code);
    res.json({ status: "success", payload: code });
  } catch (err) {
    console.log(err);
    res.json({ status: "error", payload: err });
  }
};

const updateResetPasswordCodeExpiration = async (req, res) => {
  let email = req.params.email;
  let codeLink = req.params.code;
  try {
    let user = await userModel.findOne({ email: email });
    console.log(user);
    let code = await linkModel.findOne({ code: codeLink });
    console.log(code);

    res.json({ status: "success", payload: code });
  } catch (err) {
    console.log(err);
    res.json({ status: "error", payload: err });
  }
};

const resetPassword = async (req, res) => {
  let { email, code, password } = req.body;
  console.log("Entro a resetPassword ...", email, " * ", code, " * ", password);
  try {
    //let user = userModel.findOne({ email: email });
    let user = await userServiceDAO.getInfoUserByEmail(email);
    console.log(user);
    if (user) {
      if (isValidPassword(user, password)) {
        console.log("contraseña es igual a la actual!!!");
        res.json({ status: "error", payload: "Contraseña Igual a la actual" });
      } else {
        console.log("No es igual...");

        //console.log(respuesta);
        console.log("USER PASS ANTES EN OBJ: ", user.password);
        user.password = createHash(password);
        console.log("USER PASS AHORA EN OBJ: ? ", user.password);

        console.log(user);
        let respuestaUpdate = await userServiceDAO.updatePassByUserEmail(user);
        console.log(respuestaUpdate);
        //eliminar codeLink
        let codeRes = await linkModel.deleteOne({ code: code });
        console.log(codeRes);
      }
    } else {
      console.log("no se encontro el usuario");
    }

    res.status(201).json({
      status: "success",
      message: "se Actializo la contraseña satisfactoriamente",
    });
  } catch (err) {
    console.log("error", err);
  }
};

const sendMail = async (req, res) => {
  let { userDestination } = req.params;
  let { message, subject } = req.body;
  console.log(
    "A SENDMAIL ENTRAN = ",
    userDestination,
    "- ",
    message,
    " - ",
    subject
  );
  try {
    req.logger.info("validando el email ingresado...");
    let emailVerificado = await userModel.findOne({ email: userDestination });
    if (!emailVerificado.payload) {
      let result = await transport.sendMail({
        from: `ECOMMERCE <${config.gmailEmail}>`,
        to: userDestination,
        subject: subject,
        html: `
              <div>
              <p> ${message} </p>
              </div>
              `,
        attachments: [],
      });
      //console.log(result);
      if (result) {
        res.json({ status: "success", payload: "El email esta registrado" });
      } else {
        res.json({ status: "error", payload: "error" });
      }
    } else {
      res.json({ status: "error", payload: "error" });
    }
  } catch (err) {
    res.json({ status: "error", payload: "error" });
  }
};

export default {
  getEmailRecover,
  getResetPassword,
  getResetPasswordCodeExpiration,
  deleteResetPasswordCodeExpiration,
  updateResetPasswordCodeExpiration,
  resetPassword,
  sendMail,
};
