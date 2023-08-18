let currentURL = window.location.href;
let btnIniciarSesion = document.getElementById("iniciarSesionbtn");
let btnRegistrarme = document.getElementById("Registrarme");
let btnGithub = document.getElementById("btnGithub");

window.addEventListener("load", async (e) => {
  e.preventDefault();
  // await usuariosEliminadosDesconexion();
});

btnGithub.addEventListener("click", (e) => {
  e.preventDefault();
  // console.log("clicj en btn github");
  //href="/api/sessions/github"
  window.location.replace("/api/sessions/github");
});

btnIniciarSesion.addEventListener("click", async (event) => {
  event.preventDefault();

  let email = document.getElementById("inputEmail").value;
  let password = document.getElementById("inputPassword").value;
  // console.log(currentURL);
  if (!email || !password) {
    await Swal.fire(`Ingrese valores validos!`, "", "info");
  } else {
    let obj = {
      email: email,
      password: password,
    };
    // console.log("usuario que intenta iniciar sesion : ", obj);
    if (currentURL[1] != "") {
      currentURL = currentURL.split("/login");
    }
    let respuesta = "";

    await fetch("/api/sessions/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    })
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);
        respuesta = result;
      });
    // console.log(respuesta);
    if (respuesta.status != "success") {
      // console.log("error al iniciar sesion bad credentials");

      await Swal.fire(
        `Error: ${respuesta.payload}`,
        "Ocurrio un problema al inciar sesion!!!",
        "info"
      );
    } else {
      await Swal.fire("Inicio Sesion con exito!!!", "", "success");
      window.location.replace("/api/products");
    }
  }
});

btnRegistrarme.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.replace("/register");
});

async function goToChangePass() {
  let email = document.getElementById("inputEmail").value;
  let enviarEmailLink = false;
  // console.log(email);
  if (email) {
    let data = "";
    // let urlAux = currentURL.split("/login");
    // console.log(urlAux[0] + "/api/mail/passRecovery");
    const respuesta = await fetch("/api/mail/passRecovery/" + email, {
      method: "GET",
      //body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(async (result) => {
        emailVerificado = result;
        // console.log(emailVerificado);
        // Manejar la respuesta del servidor

        // console.log(
        //   "resultado existe email para recuperar?-> ",
        //   emailVerificado
        // );
        // console.log("respuesta", emailVerificado);

        if (emailVerificado.status != "error") {
          enviarEmailLink = true;
          // console.log(
          //   "Se acaba de enviar un correo a tu email para reestablecer tu contraseña"
          // );
          await fetch("/api/mail/passRecovery/" + email, {
            method: "GET",
            //body: JSON.stringify(obj),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => response.json())
            .then((result) => {
              emailVerificado = result;
              // console.log(emailVerificado);
            })
            .catch((err) => {
              console.log("ERROR: ", err);
            });
        } else {
          enviarEmailLink = false;
        }
        if (!enviarEmailLink) {
          await Swal.fire(
            `Debes escribir un email valido!!!`,
            "Escribe tu email para poder reestrablecer tu contraseña",
            "info"
          );
        } else {
          await Swal.fire(
            `Se envio el link a tu correo!!!`,
            "Se envio un link a tu correo para que ingreses y cambies tu contraseña",
            "success"
          );
        }
      })
      .catch((err) => {
        console.log("ERROR: ", err);
      });
  } else {
    await Swal.fire(
      `Debes escribir un email en el campo de email!!!`,
      "Escribe tu email para poder reestrablecer tu contraseña",
      "info"
    );
  }
}

async function usuariosEliminadosDesconexion() {
  // console.log(
  //   "entro a realizar la eliminación de los usuarios con desconexion mayor a dos dias"
  // );
  await fetch(`/api/users/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      // console.log(result);
      data = result;
    });
  console.log(
    "RESULTADO USUARIOS ELIMINADOS POR DESCONEXION MAYOR A 2 DIAS  ",
    data
  );
}
