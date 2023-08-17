let currentUrl = window.location.href;
let temporizador;
let stopped = true;
console.log("entro a proceso de compra con ticket....");
let tiempoMaxCompra = 1; //MInutos
let cont = 0;
let seconds = [0, 0];
let minutes = [0, 0];
//let Hours = "00";
let vence = "0" + minutes[1] + ":" + "0" + seconds[1];
let barra = document.getElementById("barra");
let tiempo = document.getElementById("tiempo");
window.addEventListener("load", () => {
  iniciarTemporizador();
});

function iniciarTemporizador() {
  temporizador = setInterval(tiempoCompra, 1000);
  console.log(temporizador);
}

async function tiempoCompra() {
  cont = cont + 1;
  seconds[1] = cont;
  vence = "0" + minutes[1] + ":" + "0" + seconds[1];
  if (seconds[1] >= 10) {
    seconds[1] = cont;
    vence = "0" + minutes[1] + ":" + seconds[1];
  }
  if (seconds[1] >= 60) {
    cont = 0;
    seconds[1] = 0;
    minutes[1]++;
    vence = "0" + minutes[1] + ":" + "0" + seconds[1];
  }

  if (minutes[1] == tiempoMaxCompra) {
    clearInterval(temporizador);
    stopped = true;
    actializarEstadoTicket();
  }
  barra.style.width = cont + "%";
  tiempo.innerHTML = vence;
}

async function actializarEstadoTicket() {
  await Swal.fire({
    title: "se acabo el tiempo de espera para realizar la compra!!!",
    text: "El tiempo esta determinado en 1min por las pruebas...",
    icon: "info",
    showCancelButton: true,
    confirmButtonColor: "#029126",
    cancelButtonColor: "#d33",
    confirmButtonText: "Esperar 10Min!",
  }).then(async (result) => {
    clearInterval(temporizador);
    if (result.isConfirmed) {
      Swal.fire(
        "Se aumento el tiempo para realizar la compra...",
        "Tienes 10min para realizar la compra",
        "success"
      );

      cont = 0;
      seconds[1] = 0;
      minutes[1] = 0;
      tiempoMaxCompra = 10;
      vence = "0" + minutes[1] + ":" + "0" + seconds[1];

      if (stopped == true) {
        console.log("entro a reiniciar el temporizador..");
        iniciarTemporizador();
      }
    } else {
      await eliminarTicket();
    }
  });
}

async function eliminarTicket() {
  let urlVolver = currentUrl.split("/purchase");
  console.log(urlVolver);
  let ticketId = document.getElementById("ticketId").innerHTML;
  let ticketCode = document.getElementById("tickedCode").innerHTML;
  console.log("ticketToDelete", ticketId);
  let infoTicket = {
    ticketId: ticketId,
    ticketCode: ticketCode,
  };
  console.log("infoTicket", infoTicket);
  let data = "";
  await fetch(currentUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(infoTicket),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      data = result;
    });

  if (data.status == "success") {
    await Swal.fire(
      "Volviendo al carrito",
      "Los productos permaneceran en tu carrito ",
      "info"
    );
    window.location.replace(urlVolver[0]);
  } else {
    Swal.fire("Ocurrio un error", "", "info");
  }
}

let btnPagar = document.getElementById("pagar");

btnPagar.addEventListener("click", async (event) => {
  event.preventDefault();
  console.log("obteniendo informacion para actualizar data....");
  //let infoTicket = await obtenerInfoTicketById();
  obtenerInfoTicketById();
  console.log(
    "actualizando informacion de productos que no se pudieron comprar...",
    infoTicket
  );
  console.log("actualizando stock de los productos comprados...");
  console.log("Compra realizada...");
});

async function obtenerInfoTicketById() {
  let idTicket = document.getElementById("ticketId").innerHTML;
  let ticket_Id = {
    ticketId: idTicket,
  };
  console.log("url", currentUrl);
  let data = "";
  const response = await fetch(currentUrl + `/${idTicket}`, {
    method: "GET",
    //body: JSON.stringify(ticket_Id),
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

  console.log("informacion de ticket ACTUALIZADA (?)-> ", data);
  if (data.status == "success") {
    console.log("actualizando datos en carrito....");
    let carritoActualizado = await eliminarProductosDeCarrito(data.result);
    if (carritoActualizado) {
      await Swal.fire(
        "Se actualizo el carrito a partir de la compra 2",
        "",
        "success"
      );
      //await actualizandoStockCompra(data.result);

      await actualizandoStockCompra(data.result);
      await eliminarTicket();
    } else {
      await Swal.fire("Ocurrio algo en el proceso...", "", "info");
    }
  }
}

async function eliminarProductosDeCarrito(...listaProductosComprados) {
  let cambiosOk = false;
  let urlAux = currentUrl.split("/purchase");
  console.log("url -> ", urlAux[0] + ":product" + ":idProduct");
  console.log("ListaComprados = > ", listaProductosComprados);
  let data = "";
  let tamanoLista = listaProductosComprados[0].length;
  let contadorDeleted = 0;
  for (const producto of listaProductosComprados[0]) {
    console.log(producto);
    console.log(producto.product);
    let urlToDelete =
      urlAux[0] + `/${producto.product.trim()}/${producto.idProduct.trim()}`;
    console.log(urlToDelete);

    await fetch(urlToDelete, {
      method: "DELETE",
      // body: JSON.stringify(ticket_Id),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        data = result;
        console.log(data);
        //Manejar la respuesta del servidor
      })
      .catch((err) => {
        console.log("ERROR: ", err);
      });

    // if (data.status == "success") {
    //   contadorDeleted++;
    //   console.log("informacion de ticket ACTUALIZADA (?)-> ", tamanoLista);
    // }
    contadorDeleted++;
    console.log("informacion de ticket ACTUALIZADA (?)-> ", tamanoLista);
  }

  if (contadorDeleted == tamanoLista) {
    console.log("Se actualizo correctamente la infotmacion el elcarrito");
    cambiosOk = true;
    //await eliminarTicket();
  }

  return cambiosOk;
}

async function actualizandoStockCompra(...listaProductosComprados) {
  await Swal.fire("actualizandoStockCompra", "", "info");
  //HACER UN GET AL NOMBRE DEL PRODUCTO QUE TRAR LA LISTA PRODUCTOS Y CUANDO ME TRAIGA TODO EL OBJETO, ACTUALIZAR EL
  //VARIABLE STOCK Y AHI HACER UN UPDATE A CADA UNA...
  let cambiosOk = false;
  let urlAux = currentUrl.split("/api");
  console.log("url -> ", urlAux[0] + "/api/products/:id");
  console.log(listaProductosComprados[0]);
  let data = [];
  for (const producto of listaProductosComprados[0]) {
    console.log(
      "url -> ",
      urlAux[0] + "/api/products/product/" + producto.product.trim()
    );
    let url = urlAux[0] + "/api/products/product/" + producto.product.trim();
    await fetch(url, {
      method: "GET",
      //body: JSON.stringify(ticket_Id),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        data.push(result);
        console.log(data);
        // Manejar la respuesta del servidor
      })
      .catch((err) => {
        console.log("ERROR: ", err);
      });
  }
  await restandoQuantity(data, listaProductosComprados[0]);
  console.log("informacion de ticket ACTUALIZADA (?)-> ", data);
}

async function restandoQuantity(
  listaProductsStockActualizar,
  listaProductosComprados
) {
  console.log(listaProductsStockActualizar);
  console.log(listaProductosComprados);
  console.log(currentUrl);
  let cantidadProductsToChange = listaProductosComprados[0].length;
  let url = currentUrl.split("/api");
  let idTicket = document.getElementById("ticketId").innerHTML;
  console.log("id product to update - ", listaProductsStockActualizar[0]._id);
  //console.log("quantity product to update - ", listaProductosComprados[0].);
  let productoToUpdate = {
    productsStockUpdate: listaProductsStockActualizar,
    ticketCart: ticketId,
  };

  let dataRes = "";
  let getInfoTicket = await fetch(url[0] + "/api/carts/ticket/" + idTicket, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      dataRes = result;
    });

  console.log(dataRes);
  let infoPurchase = dataRes.infoPurchase.split("nextProduct");
  console.log(infoPurchase);
  let infoPurchase2 = infoPurchase.filter((p) => p != " ");

  let infoQuantity = [];
  for (const product of infoPurchase2) {
    let separado = product.split("|");
    infoQuantity.push(separado);
  }
  console.log(infoQuantity);
  let productQuantity = [];
  for (const product of infoQuantity) {
    let quantity = product[2].split(":");
    let infoProduct = {
      product: product[1],
      quantity: quantity[1],
    };
    console.log(infoProduct);
    productQuantity.push(infoProduct);
  }
  console.log(productQuantity);
  //ARMANDO EL OBJETO PRODUCTO TO UPDATE:
  let listaProductosUpdated = [];
  for (let i in listaProductsStockActualizar) {
    console.log(listaProductsStockActualizar[i]);
    console.log("stock antes ...", listaProductsStockActualizar[i].stock);
    listaProductsStockActualizar[i].stock =
      listaProductsStockActualizar[i].stock - productQuantity[i].quantity;
    console.log("Actualizado stock product -", listaProductsStockActualizar[i]);
    listaProductosUpdated.push(listaProductsStockActualizar[i]);
  }
  console.log(listaProductosUpdated);
  let data = [];
  for (const product of listaProductosUpdated) {
    let id = product._id;
    let urlPut = url[0] + "/api/products/user/" + id;
    console.log("haciendo get a url -> ", urlPut);
    await fetch(url[0] + "/api/products/user/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        data.push(result);
      });
  }

  await Swal.fire("Se completo el proceso de compra!!!", "", "success");
  console.log("resultado Update stock", data);
}
