console.log("Llamando a realTimeProducts!!!");
const socket = io();
let ultimoId;
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
      id: ultimoId + 1,
    };
    socket.emit("productoAgregado", producto);
    Swal.fire("Producto Agregado con exito!!!", "", "success");
  } else {
    Swal.fire("no se agrego ningun producto!!!", "", "info");
  }
}

function eliminarProducto(idEliminar) {
  // console.log("id a eliminar - ", idEliminar);
  socket.emit("eliminarProducto", idEliminar);
  Swal.fire("Se elimino el producto correctamente!!!", "", "info");
}

function editarProducto(idProduct) {
  //console.log(idProduct);
  let valido = true;
  socket.emit("buscarProductoEdit", idProduct);
  socket.on("productToEdit", async (product) => {
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
      if (
        formValues[element] == null ||
        formValues[element] == "" ||
        formValues[element] == 0
      ) {
        valido = false;
      }
    }

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
      socket.emit("productoEditado", producto);
      Swal.fire("Producto editado con exito!!!", "", "success");
    } else {
      Swal.fire("no se edito el producto!!!", "", "info");
    }
  });
}

socket.on("listaProductos", (lista) => {
  console.log("Se recibio lista productos ", lista);
  const listaProductos = document.getElementById("listaProductos");
  let productos = "";
  let ultimoElemento = lista[lista.length - 1];
  ultimoId = ultimoElemento.id;
  lista.forEach((producto) => {
    productos =
      productos +
      `
    <div class="card col-3 mb-2" style="margin:3px; width:49%; " id="${producto.id}">
        <div class="row ">
            <div class="col-md-4 ">
                <img src="https://cdn-icons-png.flaticon.com/512/2203/2203183.png"
                    class="img-fluid rounded-start" style="padding-top: 15px; width:93%" alt="imagen-producto">
                <div class="">
                    <p class="card-text">Thumbnail: ${producto.thumbnail} </p>   
                </div>
            </div>
            <div class="col-md-8">
                <div class="card-body cardEstudiante">
                    <h5 class="card-title" > Title:  ${producto.title}</h5>
                    <h5 class="card-text"> Id: ${producto.id} </h5>
                    <p class="card-text">Price: ${producto.price}</p>
                    <p class="card-text">Code: ${producto.code}  </p>
                    <p class="card-text">Stock: ${producto.stock} </p>

                    <p class="card-text">Description: <br>  ${producto.description}</p>

                    <button class="btn btn-primary m-1"  onclick="editarProducto(${producto.id})">Editar</button>
                    <button class="btn btn-danger m-1" onclick="eliminarProducto(${producto.id})">Eliminar</button>
                </div>
            </div>
        </div>
    </div>
    `;
  });

  listaProductos.innerHTML = productos;
});
