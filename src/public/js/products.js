console.log("Llamando a productos...");
const socket = io();
let currentUrl = window.location.href;
let totalDocs = "";
let limit = "";
let totalPages = "";
let page = "";
let pagingCounter = "";
let hasPrevPage = "";
let hasNextPage = "";
let prevPage = "";
let nextPage = "";
let btnCerrarSesion = document.getElementById("btnCerrarSesion");
// let btnA = document.getElementById("btnCerrarSesion");
let userNameLogeado = document.getElementById("userName").innerHTML;
let userEmailLogeado = document.getElementById("userEmail").innerHTML;
let userIdLogeado = document.getElementById("userId").innerHTML;
let cartIdLogeado = document.getElementById("cardId").innerHTML;
let contadorDocs = document.getElementById("contadorDocs").innerHTML;
let barra = document.getElementById("barra");
let btnPanelAdminUsers = document.getElementById("adminUsers");
let userRol = document.getElementById("rolToChange");
let infoUsuario = "";
window.addEventListener("load", async (event) => {
  let idLogeado = userIdLogeado.split(":");
  if (userIdLogeado || userNameLogeado) {
    console.log("usuario logueado...");
    // Swal.fire(
    //   "Bienvenido!!!",
    //   `Iniciaste sesión como: ${userNameLogeado}`,
    //   "success"
    // );
    console.log("Rol usuario; ", userRol.innerHTML);
    if (userRol.innerHTML == "Premium") {
      console.log("el usuario es Premium cambiando a ususario....");
      userRol.innerHTML = "Usuario";
    } else if (userRol.innerHTML == "Usuario") {
      console.log("el usuario es usuaeio cambiando a Premium...");
      userRol.innerHTML = "Premium";
    } else {
      btnPanelAdminUsers.classList.remove("disabled");
    }

    if (contadorDocs == 0) {
      barra.style.width = "25%";
    }
    if (contadorDocs == 1) {
      barra.style.width = "50%";
    }
    if (contadorDocs == 2) {
      barra.style.width = "75%";
    }
    if (contadorDocs == 3) {
      barra.style.width = "100%";
    }
  } else {
    console.log("no hay un usuario logeado");
    await Swal.fire("No hay usuario logeado!!!", "", "info");
    window.location.replace("/login");
  }
});

btnCerrarSesion.addEventListener("click", async (event) => {
  event.preventDefault();

  console.log("user Logged: ", userNameLogeado, userEmailLogeado);
  let urlAux = currentUrl.split("/api");
  console.log(urlAux[0]);

  let user = {
    email: userEmailLogeado,
  };

  let data = "";
  const response = await fetch(urlAux[0] + "/api/sessions/logoutSession", {
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
      console.log(data);
      // Manejar la respuesta del servidor
    })
    .catch((err) => {
      console.log("ERROR: ", err);
    });

  console.log("resultado cerrar sesion-> ", data);
  if (data.status === "success") {
    await Swal.fire("Se cerro sesion con exito!!!", "", "info");
    window.location.replace("/login");
  } else {
    await Swal.fire("No se pudo cerrar sesión !!!", "", "warning");
  }
});

socket.on("getListaProductos", async (data) => {
  console.log("se van a obtener la lista de productos....");
  getProducts();
  socket.emit("contraResp");
});

socket.on("fin", (data) => {
  console.log("entro a fin...");
});

socket.on("getInfoUser", () => {
  console.log("recargando info user...");
  window.location.reload();
});

async function getProducts() {
  console.log("ENTRO A GETPRODUCTS !!!!!");
  let arregloProductos = [];
  let productos = "";
  let listaProductos = document.getElementById("listaProductos");
  let buscarPorListaProductos = document.getElementById(
    "buscarPorListaProductos"
  );
  let listaProductosBuscar = "";
  console.log("url", currentUrl);
  let url = currentUrl;

  let vars = url.split("?");
  console.log(vars[0]);
  console.log(vars[1]);
  //let varsLimit = vars[1].split("&");
  // console.log(varsLimit);
  // let tamVars = vars.length;
  // console.log(tamVars);
  let newUrl = "";
  if (vars[1] == undefined) {
    newUrl = currentUrl + "/productsList";
    console.log(newUrl);
  } else {
    newUrl = vars[0] + "/productsList?";
    newUrl = newUrl + vars[1];
    console.log(newUrl);
  }

  await fetch(newUrl)
    .then((response) => response.json())
    .then((result) => {
      console.log(typeof result);
      console.log(result.docs);
      // Manejar la respuesta del servidor
      arregloProductos = result.docs;
      limit = result.limit;
      totalPages = result.totalPages;
      page = result.page;
      pagingCounter = result.pagingCounter;
      hasPrevPage = result.hasPrevPage;
      hasNextPage = result.hasNextPage;
      prevPage = result.prevPage;
      nextPage = result.nextPage;
    });
  console.log(arregloProductos);
  console.log(
    totalDocs,
    limit,
    totalPages,
    page,
    pagingCounter,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage
  );

  arregloProductos.forEach((producto) => {
    productos =
      productos +
      `
    <div class="card col-3 mb-2" style="margin:3px; width:49%; " id="${producto._id}">
        <div class="row ">
            <div class="col-md-4 ">
                <img src="https://cdn-icons-png.flaticon.com/512/2203/2203183.png"
                    class="img-fluid rounded-start" style="padding-top: 15px; width:93%" alt="imagen-producto">
                <div class="">
                    <p class="card-text">Thumbnail: ${producto.thumbnail} </p>   
                </div>
                <br>
                <small> <p>Creado por Usuario: <b>${producto.owner}</b></p></small>

            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title" > Title:  ${producto.title}</h5>
                    <h5 class="card-text"> Id: ${producto._id} </h5>
                    <p class="card-text">Price: ${producto.price}</p>
                    <p class="card-text">Code: ${producto.code}  </p>
                    <p class="card-text">Stock: <span id="stockProduct${producto._id}">${producto.stock}</span> </p>

                    <p class="card-text">Description: <br>  ${producto.description}</p>

                    <button class="btn btn-primary m-1"  onclick="editarProducto('${producto._id}')">Editar</button>
                    <button class="btn btn-danger m-1" onclick="eliminarProducto('${producto._id}')">Eliminar</button>

                </div>

            </div>
        </div>
        <div class="row">
                    
        <input type="number" class="form-control " id="inputCantProduct${producto._id}"  placeholder="Cantidad Productos Para añadir ">
        <button id="btnCrearCarritoUsu" class="btn btn-warning" onclick="addToCart('${producto._id}',' ${producto.title}')">Añadir Cantidad del producto al Carrito </button>
        </div>
    </div>
    `;
    listaProductosBuscar =
      listaProductosBuscar +
      `
        <option value="${producto.title}">${producto.title}</option>
    `;
  });
  listaProductosBuscar =
    listaProductosBuscar +
    `
    <option  value="ninguno">ninguno</option>
  <option selected>Buscar por Producto</option>
  `;
  listaProductos.innerHTML = productos;
  buscarPorListaProductos.innerHTML = listaProductosBuscar;

  //Para utlNexPage =
  let urlNextPage = "";
  urlNextPage = vars[0] + "?";
  console.log(vars);
  let variables = vars[1];
  let vars1 = variables.split("&");
  console.log(vars1);
  console.log(vars1.indexOf(`page=${page}`));
  let existe = vars1.includes(`page=${page}`);
  if (existe) {
    let posPage = vars1.indexOf(`page=${page}`);
    vars1[posPage] = "page=" + nextPage;
  } else {
    vars1.push("page=" + nextPage);
  }
  let newVars = "";
  console.log(vars1);
  vars1.forEach((e) => {
    newVars = newVars + e + "&";
  });
  let tamVars = newVars.length;
  newVars = newVars.slice(0, tamVars - 1);
  console.log(newVars);
  urlNextPage = urlNextPage + newVars;
  console.log(urlNextPage);

  let urlPrevPage = "";
  urlPrevPage = vars[0] + "?";
  console.log(vars);
  let variablesPrev = vars[1];
  let varsPrev = variablesPrev.split("&");
  console.log(varsPrev);
  console.log(varsPrev.indexOf(`page=${page}`));
  let existePrev = varsPrev.includes(`page=${page}`);
  if (existePrev) {
    let posPage = varsPrev.indexOf(`page=${page}`);
    varsPrev[posPage] = "page=" + prevPage;
  }
  let newVarsPrev = "";
  console.log(varsPrev);
  varsPrev.forEach((e) => {
    newVarsPrev = newVarsPrev + e + "&";
  });
  let tamVarsPrev = newVarsPrev.length;
  newVarsPrev = newVarsPrev.slice(0, tamVarsPrev - 1);
  console.log(newVarsPrev);
  urlPrevPage = urlPrevPage + newVarsPrev;
  console.log(urlPrevPage);

  let listaBotones = "";
  let botones = document.getElementById("botones");

  let habilitarPrev = "";
  let habilitarNext = "";
  if (prevPage == null) {
    habilitarPrev = "disabled";
  } else {
    habilitarPrev = "";
  }
  if (nextPage == null) {
    habilitarNext = "disabled";
  } else {
    habilitarNext = "";
  }
  listaBotones = `
    <button type="button" ${habilitarPrev} class="btn btn-secondary" onclick="location.href='${urlPrevPage}'">Previus</button>
    <button type="button" class="btn btn-secondary">${page}</button>
    <button type="button" ${habilitarNext}  class="btn btn-secondary" onclick="location.href='${urlNextPage}'">Next</button>
  `;
  botones.innerHTML = listaBotones;
}

async function agregarProducto() {
  const listaProductos = document.getElementById("listaProductos");
  const productos = "";
  let valido = true;
  //console.log("entro a agregar producto...");
  const { value: formValues } = await Swal.fire({
    title: "Agregar Producto:",
    html:
      '<input id="swal-input1" class="swal2-input"  placeholder="Title">' +
      '<input id="swal-input2" class="swal2-input"  placeholder="Description">' +
      '<input id="swal-input3" class="swal2-input"  placeholder="Price">' +
      '<input id="swal-input4" class="swal2-input"  placeholder="Thumbnail">' +
      '<input id="swal-input5" class="swal2-input"  placeholder="Code">' +
      '<input id="swal-input6" class="swal2-input"  placeholder="Stock">',
    focusConfirm: false,
    preConfirm: () => {
      return [
        document.getElementById("swal-input1").value,
        document.getElementById("swal-input2").value,
        document.getElementById("swal-input3").value,
        document.getElementById("swal-input4").value,
        document.getElementById("swal-input5").value,
        document.getElementById("swal-input6").value,
      ];
    },
  });

  for (let element in formValues) {
    if (
      formValues[element] == null ||
      formValues[element] == "" ||
      formValues[element] == 0
    ) {
      valido = false;
    }
  }

  if (formValues && valido) {
    console.log(formValues[0]);
    let producto = {
      title: formValues[0],
      description: formValues[1],
      price: formValues[2],
      thumbnail: formValues[3],
      code: formValues[4],
      stock: formValues[5],
      //id: ultimoId + 1,
    };
    console.log("en index producto: ", producto);
    let data = "";
    await fetch(currentUrl + "/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(producto),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        // Manejar la respuesta del servidor
        data = result;
      });
    console.log(data);
    if (data.status == "error") {
      Swal.fire(
        "No se pudo agregar el producto!!!",
        "No estas autorizado, cambia a de ROL para poder realizar esta acción",
        "info"
      );
    } else {
      socket.emit("productoAgregado", producto);
      Swal.fire("Producto Agregado con exito!!!", "", "success");
    }
  } else {
    Swal.fire("no se agrego ningun producto!!!", "", "info");
  }
}

async function eliminarProducto(idEliminar) {
  console.log("id a eliminar - ", idEliminar);
  let data = "";
  let urlAux = currentUrl.split("/api");

  await fetch(urlAux[0] + `/api/products/${idEliminar}`, {
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
  if (data.status != "error") {
    console.log(data.infoEmailUserPremium);
    if (data.infoEmailUserPremium) {
      let obj = {
        message: `Te informamos que el producto ${data.infoEmailUserPremium.productDeleted} que tu agregaste fue eliminado de la base`,
        subject: "Producto Eliminado!!!",
      };
      console.log("notificando a usuario premium que se elimino un producto");
      Swal.fire(
        `Notificando a usuario ${data.infoEmailUserPremium.email} premium que se elimino un producto`,
        "",
        "info"
      );
      await fetch(`/api/mail/sendEmail/${data.infoEmailUserPremium.email}`, {
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
      console.log(data);
    }
    socket.emit("eliminarProducto", idEliminar);
    Swal.fire("Se elimino el producto correctamente!!!", "", "info");
  } else {
    Swal.fire(
      "No se pudo eliminar el producto!!!",
      "No estas autorizado, cambia a de ROL para poder realizar esta acción",
      "info"
    );
  }
}

async function editarProducto(productId) {
  //let product = "";

  console.log(productId);
  let product = await obtenerProductoById(productId);
  console.log("modtrando Product desde editar.....");
  console.log(product);
  let valido = true;

  //console.log(product);
  const { value: formValues } = await Swal.fire({
    title: "Editar Producto:",
    html:
      '<input id="swal-input1" class="swal2-input"  placeholder="Title" value= ' +
      product.title +
      ">" +
      '<input id="swal-input2" class="swal2-input"  placeholder="Description" value= ' +
      product.description +
      ">" +
      '<input id="swal-input3" class="swal2-input"  placeholder="Price" value= ' +
      product.price +
      ">" +
      '<input id="swal-input4" class="swal2-input"  placeholder="Thumbnail" value= ' +
      product.thumbnail +
      ">" +
      '<input id="swal-input5" class="swal2-input"  placeholder="Code" value= ' +
      product.code +
      ">" +
      '<input id="swal-input6" class="swal2-input"  placeholder="Stock" value=' +
      product.stock +
      ">",
    focusConfirm: false,
    preConfirm: () => {
      return [
        document.getElementById("swal-input1").value,
        document.getElementById("swal-input2").value,
        document.getElementById("swal-input3").value,
        document.getElementById("swal-input4").value,
        document.getElementById("swal-input5").value,
        document.getElementById("swal-input6").value,
      ];
    },
  });

  for (let element in formValues) {
    console.log(formValues[element]);
    if (
      formValues[element] == null ||
      formValues[element] == "" ||
      formValues[element] == 0
    ) {
      valido = false;
    }
  }

  // :(
  // console.log("fomValues:::::::::::::");
  // console.log(formValues, valido);
  if (formValues && valido) {
    //console.log(formValues[0]);
    let producto = {
      title: formValues[0],
      description: formValues[1],
      price: formValues[2],
      thumbnail: formValues[3],
      code: formValues[4],
      stock: formValues[5],
      id: product.id,
    };
    console.log("producto editado final -> ", producto);
    let urlAux = currentUrl.split("?");
    console.log("haciendo put a url : ", urlAux[0] + "/" + productId);
    let dataRes = "";
    await fetch(urlAux[0] + "/" + productId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(producto),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        dataRes = result;
      });
    if (dataRes.status == "error") {
      Swal.fire(
        "No se pudo agregar el producto!!!",
        "No estas autorizado, cambia a de ROL para poder realizar esta acción",
        "info"
      );
    } else {
      socket.emit("productoEditado", producto);
      await Swal.fire("Producto editado con exito!!!", "", "success");
    }
  } else {
    await Swal.fire("no se edito el producto!!!", "", "info");
  }
}

function enviandoValores(formValues) {
  console.log(JSON.stringify(formValues));
}
async function obtenerProductoById(productId) {
  console.log("enrto a obtener producto ById ", productId);
  let product = "";
  console.log("currentUrl en obtenerProductoById -> ", currentUrl);
  let urlAux = currentUrl.split("/api");
  console.log("urlAux = ", urlAux);
  console.log("haciendo fetch a -> ", urlAux[0] + "/api/products/" + productId);
  await fetch(urlAux[0] + "/api/products/" + productId)
    .then((response) => response.json())
    .then((result) => {
      console.log("Result en obtenerProductoById");
      console.log(result);
      //console.log(result.docs);
      // Manejar la respuesta del servidor
      product = result;
    });
  console.log("enviando product desde obtenerProductoById", product);
  return product;
}

function aplicarFiltro() {
  console.log("entro a aplicar filtro...");
  let numProductsByPage = document.getElementById("numProductsByPage").value;
  let ordenProducts = document.getElementById("ordenProducts").value;
  let buscarPorProducto = document.getElementById(
    "buscarPorListaProductos"
  ).value;

  // var value = e.value;
  // var text = e.options[e.selectedIndex].text;
  console.log(
    "FILTROOO: ",
    numProductsByPage,
    " -  ",
    ordenProducts,
    " -  ",
    buscarPorProducto
  );
  let urlFilter = "/api/products";
  let params = "?";
  if (
    numProductsByPage == "Numero de productos por pagina :" ||
    numProductsByPage == "predeterminado"
  ) {
    params = params + `limit=10&`;
  } else {
    params = params + `limit=${numProductsByPage}&`;
  }
  if (ordenProducts == "Ordenar:" || ordenProducts == "ninguno") {
    console.log("ordenar es igual, es decir que no cambia");
    params = params;
  } else {
    params = params + `sort=${ordenProducts}&`;
  }

  if (
    buscarPorProducto == "ninguno" ||
    buscarPorProducto == "Buscar por Producto"
  ) {
    params = params;
  } else {
    params = params + `query=${buscarPorProducto}&`;
  }
  console.log(params);
  urlFilter = urlFilter + params;
  console.log(urlFilter);
  window.location.replace(urlFilter + "page=1");
}

async function addToCart(idProduct, product) {
  let cantidadProducto = document.getElementById(
    `inputCantProduct${idProduct}`
  ).value;

  //    /:idCart/:product/:idProduct
  let idCart = cartIdLogeado.split(">");
  let urlAux = currentUrl.split("/api");
  console.log(urlAux[0]);
  console.log(
    "entro a agregar producto a carrito...",
    idCart[1],
    "id product",
    idProduct,
    " product ",
    product
  );

  let stock = document.getElementById("stockProduct" + idProduct).innerHTML;
  console.log(stock);
  if (cantidadProducto == 0 || cantidadProducto <= 0) {
    await Swal.fire(
      "Digita valores validos!!!",
      "Que no sean menores o mayores al stock",
      "error"
    );
  } else {
    let quantity = { quantity: cantidadProducto };
    console.log(isNaN(idCart[1]));
    let dataRes = "";
    if (!isNaN(idCart[1])) {
      Swal.fire(
        "No se pudo agregar el producto!!!",
        "No estas autorizado, cambia a de ROL para poder realizar esta acción",
        "info"
      );
    } else {
      await fetch(
        urlAux[0] + `/api/carts/${idCart[1].trim()}/${product}/${idProduct}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(quantity),
        }
      )
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          dataRes = result;
        });

      if (dataRes.status.toUpperCase() == "ERROR") {
        await Swal.fire(
          "No se pudo agregar el producto!!!",
          "No estas autorizado, cambia a de ROL para poder realizar esta acción - " +
            `${dataRes.result}`,
          "info"
        );
      } else {
        //socket.emit("productoEditado"); - para cuando tenga que restarle al stock
        await Swal.fire("Se añadio con exito el producto", "", "success");
      }
    }
  }
}

function goToCart() {
  let idCart = cartIdLogeado.split(">");
  let urlAux = currentUrl.split("/api");
  console.log(urlAux[0]);
  console.log(idCart[1]);
  let urlCart = urlAux[0] + "/api/carts/" + idCart[1].trim();
  console.log(urlCart);
  window.location.replace(urlCart);
}

function goToChat() {
  console.log("redirigiendo a chat....");
  let urlAux = currentUrl.split("/api");
  let urlChat = urlAux[0] + "/api/chat";
  window.location.replace(urlChat);
}

async function create100Products() {
  let data = "";
  let urlAux = currentUrl.split("/api");
  Swal.fire("Creando 100 productos, espera un momento!", "", "success");
  await fetch(urlAux[0] + "/api/mockingproducts", {
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
      console.log(data);
      // Manejar la respuesta del servidor
    })
    .catch((err) => {
      console.log("ERROR: ", err);
    });

  //console.log("resultado cerrar sesion-> ", data);
  await Swal.fire("Se crearon los productos con exito...", "", "success");
  socket.emit("productoAgregado");
}

function gotoTestLogger() {
  let url = currentUrl.split("/api");
  window.location.replace(url[0] + "/api/loggerTest");
}

async function changeRol() {
  Swal.fire("Tu perfil se cambiara a " + userRol.innerHTML, "info");
  let urlAux = currentUrl.split("/api");
  let rolChange = {
    rol: userRol.innerHTML,
  };
  console.log(userIdLogeado);
  let data;
  await fetch(`/api/users/premium/${userIdLogeado}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rolChange),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      data = result;
    });

  console.log(data);
  if (data.status == "success") {
    await Swal.fire("Tu rol se actualizo satisfactoriamente!", "", "success");
    socket.emit("rolActualizado");
  } else {
    await Swal.fire("No se pudo cambiar el rol!", `${data.message}`, "warning");
  }
}

function cargarDocumentos() {
  let id = userIdLogeado.split(">");
  console.log(id);
  window.location.replace(`/api/users/${id[1].trim()}/documents`);
}

function goToAdminUsers() {
  window.location.replace("/api/users/panelAdminUsers");
}
