console.log("Entro a js de cart");
const socket = io();
let currentUrl = window.location.href;
let carrito = "";

let btnVolver = document.getElementById("volver");
btnVolver.addEventListener("click", () => {
  let currentUrl = window.location.href;
  let urlAux = currentUrl.split("/api");
  let urlProd = urlAux[0] + "/api/products";
  window.location.replace(urlProd);
});

let btnComprar = document.getElementById("comprar");
btnComprar.addEventListener("click", async () => {
  if (carrito.products.length == 0) {
    await Swal.fire("Agrega carritos para proceder a la compra!!!", "", "info");
  } else {
    console.log("hay productos en el carrito...");
    verificarStockCompra();
  }
});

socket.on("getCart", (data) => {
  console.log("Entro a get cart del socket");
  console.log(currentUrl);
  let idUrl = currentUrl.split("/");
  console.log(idUrl);
  let ultimoPosUrl = idUrl.length;
  console.log("La ultiama posicion a buscar es => ", ultimoPosUrl);
  let idCarrito = idUrl[ultimoPosUrl - 1];
  console.log("el id a buscar es -> ", idCarrito);

  let tituloIdCarrito = document.getElementById("tituloIdCarrito");
  tituloIdCarrito.innerHTML = idCarrito;

  getCarrito();
});

async function getCarrito() {
  let listaProductos = document.getElementById("listaProductos");
  console.log("Entron a getCarrito...");
  let arregloCarrito = "";
  await fetch(currentUrl + "/carrito")
    .then((response) => response.json())
    .then((result) => {
      console.log(typeof result);
      console.log(result.docs);
      // Manejar la respuesta del servidor
      arregloCarrito = result;
      carrito = result;
    });
  console.log("53Cart", arregloCarrito);
  console.log(arregloCarrito.products);
  //   console.log(arregloCarrito.products[2]);
  //   console.log(arregloCarrito.products[2].product.title);
  //   console.log(arregloCarrito.products[2].product._id);
  let productos = "";

  //   for (let i = 0; i <= arregloCarrito.products.length; i++) {
  //     console.log(arregloCarrito.products[i]);
  //   }
  if (arregloCarrito.products.length != 0) {
    arregloCarrito.products.forEach((producto) => {
      console.log("40 ---", producto.product.title);
      console.log("48 ---", producto.quantity);
      if (producto.quantity != 0) {
        productos =
          productos +
          `
        <div class="card col-3 mb-2" style="margin:3px; width:49%; " id="${producto.product._id}">
            <div class="row ">
                <div class="col-md-4 ">
                    <img src="https://cdn-icons-png.flaticon.com/512/2203/2203183.png"
                        class="img-fluid rounded-start" style="padding-top: 15px; width:93%" alt="imagen-producto">
                    <div class="">
                        <p class="card-text">Thumbnail: ${producto.product.thumbnail} </p>   
                    </div>
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title" > Title:  ${producto.product.title}</h5>
                        <h5 class="card-text"> Id: ${producto.product._id} </h5>
                        <p class="card-text">Price c/u: ${producto.product.price}</p>
                        <p class="card-text">Code: ${producto.product.code}  </p>
                        <p class="card-text">Stock: ${producto.product.stock} </p>
                        <p class="card-text text-info">Quantity: ${producto.quantity} </p> 
    
                        <p class="card-text">Description: <br>  ${producto.product.description}</p>
  
                        
                        <button class="btn btn-danger m-1" onclick="quitarProducto('${producto._id}')">Quitar un producto</button>
                        <button class="btn btn-danger m-1" onclick="EliminarProducto('${producto._id}', '${producto.title}')">Eliminar todo el producto</button>

                    </div>
                </div>
            </div>
        </div>`;
      }
    });
  } else {
    productos = `
    <div class="card col-3 mb-2" style="margin:3px; width:49%; "">
        <h1 class="text-info" id="carritoVacio">El carrito esta vacio </h1>
    </div>`;
  }

  listaProductos.innerHTML = productos;
}

async function quitarProducto(idProduct) {
  console.log("id a buscar ----", idProduct);
  //console.log("El carrrito 89: ", carrito.products[2].quantity);
  let producto = carrito.products.find((e) => {
    //console.log(e);
    if (e._id == idProduct) {
      return e;
    }
  });
  console.log("producto en quitarProduct 91-> ", producto);
  await disminuirCantidadProducto(producto.product._id);
  socket.emit("quitoCarrito", producto);
  Swal.fire("se quito un producto del carrito!!!", "", "success");
}

async function disminuirCantidadProducto(idProduct) {
  console.log("el producto que se va a quitar es ....", idProduct);
  await fetch(currentUrl + "/product/" + idProduct, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
    });
  console.log("se disminuyo en uno la cantidad del producto en el  carrito...");
}

async function EliminarProducto(idProduct, title) {
  console.log("el producto que se va a quitar es ....", idProduct);
  await fetch(currentUrl + `/${title}/` + idProduct, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
    });
  socket.emit("quitoCarrito");
  Swal.fire("se ELIMINO un producto del carrito!!!", "", "info");
  console.log("se elimino el producto del carrito...");
}

async function verificarStockCompra() {
  let listaProductosPermanecenEnCarrito = [];
  let listaProductosCompra = [];
  carrito.products.forEach((producto) => {
    console.log(producto.product);
    if (producto.product.stock < producto.quantity) {
      console.log(
        `El producto ${producto.product.title} no tiene el suficiente stock ${producto.product.stock} para continuar con la compra de ${producto.quantity}`
      );
      listaProductosPermanecenEnCarrito.push({
        product: producto.product,
        quantity: producto.quantity,
        productCartId: producto._id,
      });
    } else {
      console.log(
        `El producto ${producto.product.title}  tiene el suficiente stock ${producto.product.stock} para continuar con la compra de ${producto.quantity}`
      );
      listaProductosCompra.push({
        product: producto.product,
        quantity: producto.quantity,
        productCartId: producto._id,
      });
    }
  });

  console.log("lista de productos para comprar: ", listaProductosCompra);
  console.log(
    "lista de productos permanecen en carrito falta stock: ",
    listaProductosPermanecenEnCarrito
  );
  if (listaProductosPermanecenEnCarrito.length != 0) {
    await Swal.fire({
      title:
        "Hay productos que superan el stock disponible, modificalos o continua la compra",
      text: "Si continuas la compra, los productos que seleccionaste seguiran en el carrito",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#029126",
      cancelButtonColor: "#d33",
      confirmButtonText: "Continuar con la compra!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (listaProductosCompra.length == 0) {
          Swal.fire(
            "No hay productos en el carrito validos para comprar!",
            "Agrega productos validos",
            "info"
          );
        } else {
          await crearTicketCompra(
            listaProductosCompra,
            listaProductosPermanecenEnCarrito
          );
          actualizandoInfoCompra(
            listaProductosCompra,
            listaProductosPermanecenEnCarrito
          );
          await Swal.fire("Redireccionando para comprar!", "", "success");
          let currentUrl = window.location.href;
          //let urlAux = currentUrl.split("/api");
          //console.log("redireccionando....");
          //let urlProd = urlAux[0] + "/api/carts/idTicket/purchase";
          window.location.replace(currentUrl + "/purchase");
        }
      }
    });
  } else {
    await crearTicketCompra(
      listaProductosCompra,
      listaProductosPermanecenEnCarrito
    );
    actualizandoInfoCompra(
      listaProductosCompra,
      listaProductosPermanecenEnCarrito
    );
    await Swal.fire("Redireccionando para comprar!", "", "success");
    let currentUrl = window.location.href;
    // let urlAux = currentUrl.split("/api");
    // console.log("redireccionando....");
    //let urlProd = urlAux[0] + "/api/carts/idTicket/purchase";
    //window.location.replace(urlProd);
    window.location.replace(currentUrl + "/purchase");
  }
}

async function crearTicketCompra(
  listaProductosCompra,
  listaProductosPermanecenEnCarrito
) {
  console.log("entro a crearTicketCompra => ", listaProductosCompra);
  let data = "";
  let infoCarritoCompra = {
    listaProductosCompra: listaProductosCompra,
    listaProductosPermanecenEnCarrito: listaProductosPermanecenEnCarrito,
  };
  await fetch(currentUrl + "/purchase", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(infoCarritoCompra),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      // Manejar la respuesta del servidor
      data = result;
    });
  console.log(data);
}

function actualizandoInfoCompra(
  listaProductosCompra,
  listaProductosPermanecenEnCarrito
) {
  console.log("Actualizar la lista de productos del carrito del usuario...");
}
