import fs from "fs";

export default class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
    this.fs = fs;
    this.init = [];
    // this.fs.writeFileSync(this.path, "[]", (err) => {
    //   if (err) return console.log("ERROR", err);
    //   else {
    //     console.log("Escribio...");
    //   }
    // });
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    let valido = true;
    this.product = {
      title: title,
      description: description,
      price: price,
      thumbnail: thumbnail,
      code: code,
      stock: stock,
    };

    for (let element in this.product) {
      if (
        this.product[element] == null ||
        this.product[element] == "" ||
        this.product[element] == 0
      ) {
        valido = false;
      }
    }

    if (valido) {
      console.log("verificando la lista de productos...");
      let contenidoArchivo = this.fs.readFileSync(this.path, "utf-8");
      this.products = JSON.parse(contenidoArchivo);

      const existe = this.products.find(
        (producto) => producto.code == this.product.code
      );
      if (existe) {
        return `el producto con codigo - ${this.product.code} -  ya existe!!!!`;
      } else {
        console.log("Agregando Producto...");
        let id = 0;
        let ultimoElemento = this.products[this.products.length - 1];
        id = ultimoElemento.id + 1;
        this.product.id = id;
        this.products.push(this.product);
        let data = JSON.stringify(this.products);
        console.log(data);
        this.fs.writeFileSync(this.path, data, (err) => {
          if (err) console.log("ERROR", err);
          else {
            console.log("Escribio...");
          }
        });
        return `Producto  ${this.product.title} agregado satisfactoriamente `;
      }
    } else {
      return "Ingrese valores validos, no null, vacios o valores en 0";
    }
  }

  updateProductByIdAndObject(id, productoEditar) {
    let response;
    let encontrado = false;
    let contenidoArchivo = this.fs.readFileSync(this.path, "utf-8");
    this.products = JSON.parse(contenidoArchivo);

    console.log("Entro a edit Product el id -> ", id);
    this.products.forEach((element) => {
      if (element.id == id) {
        encontrado = true;
        element = productoEditar;
        this.products = this.products.filter((i) => i.id != id);
        element.id = parseInt(id);
        this.products.push(element);

        this.products = this.products.sort((x, y) => x.id - y.id);
        let data = JSON.stringify(this.products);
        //console.log(data);
        this.fs.writeFileSync(this.path, data, (err) => {
          if (err) {
            response = { mensaje: "ERROR Escribiendo en archivo", error: err };
            return;
          } else {
            console.log("Escribio...");
            response = {
              mensaje: "Producto actualizado satisfactoriamente",
              productoActualizado: element,
            };
          }
        });
      }
    });

    if (encontrado) {
      console.log("fin update.");
      console.log(response);
      response = `Producto con id - ${id} - actualizado satisfactoriamente`;
    } else {
      response = "No se encontro el id";
    }
    return response;
  }

  deleteProductById(id) {
    console.log("eliminar por id");
    let contenidoArchivo = this.fs.readFileSync(this.path, "utf-8");
    this.products = JSON.parse(contenidoArchivo);
    // let productToDelete = this.products;
    // productToDelete = productToDelete.filter((prod) => prod.id == id);
    // console.log("Product to delete", productToDelete);
    // console.log("solo id prdDelete", productToDelete[0].id);
    this.products = this.products.filter((prod) => prod.id != id);
    // this.products[this.products.indexOf(productToDelete[0])] = {
    //   id: productToDelete[0].id,
    // };
    // console.log("nuevo products->", this.products);
    //this.products = this.products.push(productToDelete.id);
    console.log(this.products);
    this.products = this.products.sort((x, y) => x.id - y.id);
    let data = JSON.stringify(this.products);
    this.fs.writeFileSync(this.path, data, (err) => {
      if (err) return console.log("ERROR", err);
      else {
        console.log("Escribio...");
      }
    });
    return this.products;
  }
  getProducts() {
    let contenido = this.fs.readFileSync(this.path, "utf-8");
    return JSON.parse(contenido);
  }

  getProductById(id) {
    let encontrado = false;
    let producto;
    let contenidoArchivo = this.fs.readFileSync(this.path, "utf-8");
    this.products = JSON.parse(contenidoArchivo);
    //console.log("consultando archivo products -> ", this.products);
    //console.log("cnt", contenidoArchivo);
    console.log("buscar id = ", id);
    this.products.forEach((e) => {
      if (e.id == id) {
        producto = e;
        encontrado = true;
        return producto;
      }
    });
    if (encontrado) {
      return [producto];
    } else {
      return [{ title: "Not Found" }];
    }
  }
}
/* 
{"title":"manzana","description":"fruta","price":88.09,"thumbnail":"rutaManzana.png","code":"frutas#111","stock":54,"id":1}
{"title":"agua","description":"bebida","price":2.66,"thumbnail":"ruta2.png","code":"bebidas#543","stock":33,"id":2}
{"title":"papas","description":"paquetes","price":10.2,"thumbnail":"ruta5.png","code":"paquetes#788","stock":99,"id":3}
{"title":"cebolla","description":"verdura","price":2.00,"thumbnail":"ruta7.png","code":"verdura#88","stock":9,"id":4}
{"title":"jabon","description":"aseo","price":80.9,"thumbnail":"rutaJabon.png","code":"aseo#009","stock":41,"id":1}
{ "title": "chocolatinas",
    "description": "dulces",
    "price": 2,
    "thumbnail": "rutaChoco.png",
    "code": "chocho#44",
    "stock": 55,
    "id": 5
  }
*/
