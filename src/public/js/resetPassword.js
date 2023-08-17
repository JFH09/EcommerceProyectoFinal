console.log("entro a vista resetPassword");

let currentURL = window.location.href;
let separador = currentURL.split("/");
console.log(separador);
let email = separador[separador.length - 2];
let codeLink = separador[separador.length - 1];

console.log(email, " - ", codeLink);

window.addEventListener("load", async () => {
  console.log("validando si expiro link");
  let data = "";
  let auxUrl = currentURL.split("/api");

  await fetch(auxUrl[0] + "/api/mail/resetPassword/" + codeLink, {
    method: "GET",
    //body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      data = result;

      // Manejar la respuesta del servidor
    })
    .catch((err) => {
      console.log("ERROR: ", err);
    });

  console.log("resultado cerrar sesion-> ", data);
  let fechaActualNow = new Date();
  let fechaActualStr = fechaActualNow.toLocaleString("es-CO");
  let fechaExpiraLinkStr = data.payload.expireAt;
  console.log("fecha actual", fechaActualStr);
  console.log("fecha expira Link", fechaExpiraLinkStr);

  let fechaActualSeparador = fechaActualStr.split(",");
  let fechaActualFecha = fechaActualSeparador[0];
  let fechaAct = fechaActualFecha.split("/");
  let fechaActDia = fechaAct[0];
  let fechaActMes = fechaAct[1];
  let fechaActAno = fechaAct[2];
  let fechaHora = fechaActualSeparador[1];
  let HoraAct = fechaHora.split(":");
  let horaActHora = HoraAct[0];
  let horaActMin = HoraAct[1];

  let fechaExpiraSeparador = fechaExpiraLinkStr.split(",");
  let fechaExpiraFecha = fechaExpiraSeparador[0];
  let fechaExpira = fechaExpiraFecha.split("/");
  let fechaExpiraDia = fechaExpira[0];
  let fechaExpiraMes = fechaExpira[1];
  let fechaExpiraAno = fechaExpira[2];
  let fechaExpiraHora = fechaExpiraSeparador[1];
  let HoraExpira = fechaExpiraHora.split(":");
  let horaExpiraHora = HoraExpira[0];
  let horaExpiraMin = HoraExpira[1];

  console.log(
    "Fecha Now Separadad => ",
    fechaActDia,
    " - ",
    fechaActMes,
    " - ",
    fechaActAno
  );

  console.log("Hora Separadad => ", horaActHora, " - ", horaActMin);

  console.log(
    "Fecha Separadad => ",
    fechaExpiraDia,
    " - ",
    fechaExpiraMes,
    " - ",
    fechaExpiraAno
  );

  console.log("Hora Separadad => ", horaExpiraHora, " - ", horaExpiraMin);
  //AJUSTAR EL FORMATO DE FECHA PARA COMPARAR SI YA SE VENCIO EL LINK
  // const fechaActual = new Date(formatDate(fechaActualStr));
  // const fechaExpiraLink = new Date(formatDate(fechaExpiraLinkStr));
  // console.log(fechaActual);

  // if (parseInt(fechaExpiraAno) > parseInt(fechaActAno)) {
  //   await eliminarLinkReserPassword(codeLink);
  //   await Swal.fire("El link expiro por año(s)! ", "", "warning");

  //   window.location.replace("/login");
  //   console.log("expiro año", fechaExpiraAno, " - ", fechaActAno);
  // } else {
  //   if (parseInt(fechaExpiraMes) > parseInt(fechaActMes)) {
  //     await eliminarLinkReserPassword(codeLink);
  //     await Swal.fire("El link expiro por mes(es)! ", "", "warning");

  //     window.location.replace("/login");
  //     console.log("expiro mes");
  //   } else {
  //     if (parseInt(fechaExpiraDia) > parseInt(fechaActDia)) {
  //       console.log("expiro dia");
  //       await eliminarLinkReserPassword(codeLink);
  //       await Swal.fire("El link expiro por dia(s)! ", "", "warning");

  //       window.location.replace("/login");
  //     } else {
  //       if (parseInt(horaExpiraHora) < parseInt(horaActHora)) {
  //         console.log("expiro hora", horaExpiraHora, " - ", horaActHora);
  //         await eliminarLinkReserPassword(codeLink);
  //         await Swal.fire("El link expiro por hora(s)! ", "", "warning");

  //         window.location.replace("/login");
  //       } else {
  //         console.log("vigente");
  //         await Swal.fire(
  //           "El link sigue vigente, puedes continuar! ",
  //           "",
  //           "success"
  //         );
  //         // if (parseInt(horaActMin) < parseInt(horaExpiraMin)) {
  //         //   console.log("vigente");
  //         //   await Swal.fire(
  //         //     "El link sigue vigente, puedes continuar! ",
  //         //     "",
  //         //     "success"
  //         //   );
  //         // } else {
  //         //   console.log(
  //         //     "expiro min horaminExpira:",
  //         //     horaExpiraMin,
  //         //     " - horaActual:",
  //         //     horaActMin
  //         //   );
  //         //   await eliminarLinkReserPassword(codeLink);
  //         //   await Swal.fire("El link expiro por minutos! ", "", "warning");
  //         //   window.location.replace("/login");
  //         // }
  //       }
  //     }
  //   }
  // }
  console.log("fecha actual", fechaActualStr);
  console.log("fecha expira Link", fechaExpiraLinkStr);
  // Definir las fechas con indicadores AM/PM

  var fechaActual = moment(fechaActualStr, "D/M/YYYY, h:mm:ss a");
  var fechaExpiraLink = moment(fechaExpiraLinkStr, "D/M/YYYY, h:mm:ss a");

  // Comparar las fechas
  if (fechaActual.isAfter(fechaExpiraLink)) {
    console.log("La fecha actual es mayor a la fecha de expiracion (expiro).");
    await eliminarLinkReserPassword(codeLink);
    await Swal.fire("El link expiro ! ", "", "warning");
  } else if (fechaActual.isBefore(fechaExpiraLink)) {
    console.log("La fecha de expiración es mayor a la fecha actual. (vigente)");
    await Swal.fire("El link sigue vigente, puedes continuar! ", "", "success");
  } else {
    console.log("Las fechas son iguales.");
    await Swal.fire("El link sigue vigente, puedes continuar! ", "", "success");
  }
});

async function eliminarLinkReserPassword(codeLink) {
  console.log("entro a realizar la eliminacion del link");
  let data = "";
  let urlAux = currentURL.split("/api");
  let url = urlAux[0];
  console.log(url + `/api/mail/resetPassword/${codeLink}`);
  await fetch(url + `/api/mail/resetPassword/${codeLink}`, {
    method: "DELETE",
    // headers: {
    //   "Content-Type": "application/json",
    // },
    //body: JSON.stringify(producto),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      // Manejar la respuesta del servidor
      data = result;
    });
  console.log("RESULTADO ADD AUT", data);
}

async function resetPassword(email) {
  console.log(email);
  let newPass = document.getElementById("inputPassword").value;
  console.log(newPass, " - codeLink- ", codeLink);
  let data = "";
  let urlAux = currentURL.split("/api");
  let url = urlAux[0];

  let usuario = {
    email: email,
    code: codeLink,
    password: newPass,
  };
  console.log(url + `/api/sessions/resetPassword/newPass`);
  await fetch(url + `/api/mail/resetPassword/newPass`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(usuario),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      // Manejar la respuesta del servidor
      data = result;
    });
  console.log(data);

  if (data.status == "error") {
    await Swal.fire(
      "No se pudo realizar la solicitud!!!",
      `${data.payload}`,
      "info"
    );
  } else {
    await Swal.fire("Contraseña Actualizada con exito!!!", "", "success");
    window.location.replace("/login");
  }
}
