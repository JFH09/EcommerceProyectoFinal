let currentUrl = window.location.href;

async function atras() {
  window.location.replace(`/api/products`);
}

async function enviarFormulario(id, nombreCarpeta) {
  const form = document.getElementById(`${nombreCarpeta}Form`);
  const formData = new FormData(form);

  let respuesta = "";
  await fetch(`/api/users/uploadFile/${nombreCarpeta}/${id}`, {
    method: "PUT",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      respuesta = data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  if (respuesta.status == "success") {
    let documento = respuesta.destination;
    console.log(documento);
    // await actualizarInfoUsu(documento, id);
    await Swal.fire("Se subio el archivo correctamente!!!", "", "success");
  } else {
    Swal.fire(`${respuesta.payload}`, "", "info");
  }
}

async function actualizarInfoUsu(documento, idUsuario) {
  let rutaDocCargado = documento.split("/");
  let documentoCargado = rutaDocCargado.pop();
  console.log(documentoCargado);
  let data;
  await fetch(
    urlAux[0] + `/api/users/update/${idUsuario}/${documentoCargado}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(rolChange),
    }
  )
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      data = result;
    });

  console.log(data);
}
