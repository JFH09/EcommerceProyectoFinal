import passport from "passport";
import LocalStrategy from "passport-local";
import GitHubStrategy from "passport-github2";
import userModel from "../dao/models/user.js";
import { createHash, isValidPassword } from "../utils.js";
//import Swal from "sweetalert2/dist/sweetalert2.js";
import Swal from "sweetalert2";
import { cartModel } from "../dao/models/cart.model.js";
import config from "./config.js";
//const LocalStrategy = local.localStrategy;
import UserDTO from "../dao/dto/user.dto.js";
import { logger } from "../utils/logger.js";
const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age, rol, carts } = req.body;
        try {
          let user = await userModel.findOne({ email: username });
          if (user) {
            console.log("El usuario ya existe");
            logger.warning("El usuario ya existe");
            return done(null, false, "invalid");
          }
          let cart = await cartModel.create({});
          console.log(cart);
          let cartsAux = [cart];
          let userToCreate = new UserDTO({
            first_name,
            last_name,
            email,
            password: createHash(password),
            age,
            rol,
            carts: cartsAux,
          });
          // console.log("USERDTO = ", userToCreate);
          let result = await userModel.create(userToCreate);
          return done(null, result, "valid");
        } catch (err) {
          return done("Error al obtener el usuario " + err);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });
          if (!user) {
            console.log("El ususario no existe");
            logger.warning("El usuario no existe!");
            return done(
              null,
              user,
              "No se pudo iniciar sesion, El usuario no existe!!"
            );
          }

          if (!isValidPassword(user, password)) {
            console.log("cONTRASEÑA INVALIDA!!!");
            return done(null, user, "CONTRASEÑA INVALIDA!!");
          } else {
            return done(null, user, "valid");
          }
        } catch (err) {
          console.log("error", err);
          done(err);
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: config.gitHubClientId,
        clientSecret: config.gitHubClientSecret,
        callbackURL: config.gitHubCallbackURL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);
          let user = await userModel.findOne({ email: profile._json.email });
          if (!user) {
            let newUser = {
              first_name: profile._json.name,
              last_name: "",
              age: 18,
              email: profile._json.email,
              password: "",
              rol: "",
            };

            let result = await userModel.create(newUser);
            done(null, result);
          } else {
            console.log("el ususario ya existe");
            done(null, user);
          }
        } catch (err) {
          console.log("entron al catch....103");
          return done(err);
        }
      }
    )
  );

  passport.use(
    "resetPassword",
    new LocalStrategy(async (email, code, password, done) => {
      try {
        console.log("entro aqui.... a resetPassword en passport");
        console.log(email, " - ", code, " - ", " - ", password);
        const user = await userModel.findOne({ email: email });
        console.log(user);
        if (!user) {
          console.log("El ususario no existe");
          done("ususerio no existe", false);
        }
        if (!isValidPassword(user, password)) {
          console.log("cONTRASEÑA INVALIDA!!!");
          done(null, false);
        }
        console.log("entro bien?  ");

        done(null, user);
      } catch (err) {
        console.log("error", err);
        done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = userModel.findById(id);
    done(null, user);
  });
};

export default initializePassport;
