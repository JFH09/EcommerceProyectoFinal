import nodemailer from "nodemailer";
import config from "../config/config.js";
const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: config.gmailEmail, //correo desde donde se envia...(?) desde el config se pasan las credenciales
    pass: config.gmailApplicationPassword,
  },
});

export default transport;
