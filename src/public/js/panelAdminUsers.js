const socket = io();
console.log("entro a panel adminUsers");

window.addEventListener("load", async (e) => {
  e.preventDefault();

  await getInfoUserBasic();
});

socket.on("getInfoUsers", async () => {
  await getInfoUserBasic();
});
async function getInfoUserBasic() {
  let data = "";
  await fetch("/api/users", {
    method: "GET",
    //body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      data = result;
    })
    .catch((err) => {
      console.log("ERROR: ", err);
    });

  //   console.log("resultado getInfoUsers-> ", data);

  let listaUsuarios = document.getElementById("listaUsuarios");
  let infoUsuarios = data.payload;
  let usuarios = "";
  infoUsuarios.forEach((user) => {
    usuarios =
      usuarios +
      `
    <div class="card col-3 mb-2" style="margin:3px; width:49%; " id="${user._id}">
        <div class="row ">
            <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title" > Nombre:  ${user.fullName}</h5>
                    <p class="card-text"> <b> Id: ${user._id} </b></p>
                    <p class="card-text"><b>Email:</b> ${user.email}</p>
                    <p class="card-text"><b>Rol:</b> ${user.rol}  </p>
                    <button class="btn btn-primary m-1"  onclick="editarRolUsuario('${user._id}', '${user.rol}')">Editar Rol</button>
                    <button class="btn btn-danger m-1" onclick="eliminarUsuario('${user._id}')">Eliminar Usuario</button>
                </div>
            </div>
        </div>

    </div>
    `;
  });
  listaUsuarios.innerHTML = usuarios;
}

async function deleteUsersLastConnect() {
  let emails = "";
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: "Esta seguro?",
      text: "Va a eliminar a todos los usuarios que no se han conectado en mas de 2 dias",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, eliminar los usuarios!",
      cancelButtonText: "No, cancelar!",
      reverseButtons: true,
    })
    .then(async (result) => {
      if (result.isConfirmed) {
        let data = "";
        await fetch(`/api/users/`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          //body: JSON.stringify(producto),
        })
          .then((response) => response.json())
          .then((result) => {
            data = result;
          });
        //   console.log("RESULTADO ADD AUT", data);

        if (data.status === "success") {
          for (const usuario of data.payload) {
            // emails.push(usuario.email);
            emails = emails + usuario.email + " | ";
          }
          if (!emails) {
            await Swal.fire(
              "No se pudo realizar la accion!!!",
              `No hay usuarios por eliminar`,
              "info"
            );
          } else {
            await notificarPorEmail(emails);
            await Swal.fire(
              "Se eliminaron correctamente los ususairos !!!",
              `${emails}`,
              "success"
            );
            socket.emit("rolActualizadoAdmin");
          }
        } else {
          await Swal.fire(
            "No se pudo realizar la accion!!!",
            `${data.payload}`,
            "info"
          );
        }
        // swalWithBootstrapButtons.fire(
        //   "Deleted!",
        //   "Your file has been deleted.",
        //   "success"
        // );
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire("Cancelado", "", "error");
      }
    });

  //   console.log(
  //     "Va a eliminar a los usuarios que no se han conectado en mas de 2 dias, esta seguro?"
  //   );
}

async function notificarPorEmail(emails) {
  let arrayEmails = emails.split("|");
  console.log(arrayEmails);
  arrayEmails.pop();
  let obj = {
    message:
      "Te informamos que tu usuario fue ELIMINADO de la aplicación ECOMMERCE por una inactividad mayor o igual a dos dias, te invitamos a registrarte nuevamente.",
    subject: "Eliminacion cuenta Ecommerce por inactividad",
  };
  for (const email of arrayEmails) {
    console.log("enviando email a ", email.trim());
    let userDestination = email.trim();
    let data = "";
    await fetch(`/api/mail/sendEmail/${userDestination}`, {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        data = result;
      })
      .catch((err) => {
        console.log("ERROR: ", err);
      });

    // console.log("resultado notificacion por email a usuarios-> ", data);
  }
}

async function editarRolUsuario(id, rol) {
  const { value: newRol } = await Swal.fire({
    title: "Selecciona el nuevo rol del ususario",
    input: "select",
    inputOptions: {
      Roles: {
        Administrador: "Administrador",
        Usuario: "Usuario",
        Premium: "Premium",
      },
    },
    inputPlaceholder: "Selecciona un Rol",
    showCancelButton: true,
    inputValidator: (value) => {
      return new Promise(async (resolve) => {
        if (value != rol) {
          resolve();
        } else {
          resolve(
            `Debes seleccionar un rol valido (El ususario ya tiene rol de ${rol} )`
          );
        }
      });
    },
  });

  if (newRol) {
    let rolChange = {
      rol: newRol,
    };
    let data;
    await fetch(`/api/users/rol/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rolChange),
    })
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);
        data = result;
      });

    // console.log(data);
    if (data.status === "success") {
      await Swal.fire(
        "Se cambio el rol correctamente!!!",
        `Nuevo rol del ususario es: ${newRol}`,
        "success"
      );
      socket.emit("rolActualizadoAdmin");
    } else {
      await Swal.fire(
        "No se pudo realizar la accion!!!",
        `${data.payload}`,
        "info"
      );
    }
  }
}

async function eliminarUsuario(id) {
  let data = "";
  await fetch(`/api/users/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    //body: JSON.stringify(producto),
  })
    .then((response) => response.json())
    .then((result) => {
      data = result;
    });
  //   console.log("RESULTADO ADD AUT", data);

  if (data.status === "success") {
    await Swal.fire("Se elimino el usuario correctamente!!!", "", "success");
    socket.emit("rolActualizadoAdmin");
  } else {
    await Swal.fire(
      "No se pudo realizar la accion!!!",
      `${data.payload}`,
      "info"
    );
  }
}

function goToViewProducts() {
  window.location.replace("/api/products");
}
