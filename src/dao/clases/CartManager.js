import { response } from "express";
import fs from "fs";

export default class CartManager {
  constructor(path) {
    this.carts = [];
    this.path = "./files/carts.json";
    this.fs = fs;
    this.init = [];
    // this.fs.writeFileSync(this.path, "[]", (err) => {
    //   if (err) return console.log("ERROR", err);
    //   else {
    //     console.log("Escribio...");
    //   }
    // });
  }
  // id: 1/ productsCart : papas / idProducto: 3
  addProductToCart(idCarrito, product, idProduct) {
    let response;
    let encontrado = false;
    let contenidoArchivo = this.fs.readFileSync(this.path, "utf-8");
    this.carts = JSON.parse(contenidoArchivo);
    let productToAdd;
    // console.log(this.carts);
    // console.log(this.carts[0].products);
    // console.log(this.carts[0].products[0]);
    // console.log(this.carts[0].products[0].quantity);

    console.log("Agregando Product al carrito con id -> ", idCarrito);
    this.carts.forEach((element) => {
      if (element.id == idCarrito) {
        encontrado = true;
        let productosEnCarrito = [];
        for (const key in element.products) {
          // console.log("elemento !!!!!", element.products[key]);
          console.log("Tam arreglo", element.products.length);
          console.log("Tam arreglo", element.products[key]);
          if (element.products[key] != null) {
            if (
              product == element.products[key].product &&
              idProduct == element.products[key].productId
            ) {
              console.log(`Ya existe un producto ${product} en el carrito !!!`);
              productToAdd = {
                product: product,
                quantity: element.products[key].quantity + 1,
                productId: idProduct,
              };
            } else {
              productToAdd = {
                product: product,
                quantity: 1,
                productId: idProduct,
              };
              console.log(productToAdd);
              productosEnCarrito.push(element.products[key]);
            }
          } else {
            console.log("El carrito esta vacio...");
            productToAdd = {
              product: product,
              quantity: 1,
              productId: idProduct,
            };
            //productosEnCarrito.push(element.products[key]);
          }
        }
        productosEnCarrito.push(productToAdd);
        console.log(productosEnCarrito);
        this.carts = this.carts.filter((i) => i.id != idCarrito);
        let carritoActual = { id: idCarrito, products: productosEnCarrito };
        this.carts.push(carritoActual);
        this.carts = this.carts.sort((x, y) => x.id - y.id);
        let data = JSON.stringify(this.carts);
        // console.log(data);
        this.fs.writeFileSync(this.path, data, (err) => {
          if (err) console.log("ERROR", err);
          else {
            console.log("Escribio...");
          }
        });
        response = `Producto  ${product} agregado satisfactoriamente `;
      }
    });

    if (encontrado) {
      response = `Producto  ${product} agregado satisfactoriamente `;
    } else {
      response = `No se encontro el carrito con el id ${idCarrito}`;
    }
    return response;
  }

  addCart() {
    let contenidoArchivo = this.fs.readFileSync(this.path, "utf-8");
    this.carts = JSON.parse(contenidoArchivo);

    let cantidadCarritos = this.carts.length;

    this.carts.push({ id: cantidadCarritos + 1, products: [null] });

    this.carts = this.carts.sort((x, y) => x.id - y.id);
    let data = JSON.stringify(this.carts);
    // console.log(data);
    this.fs.writeFileSync(this.path, data, (err) => {
      if (err) return `"ERROR" ${err}`;
      else {
        response = `Carro creado con id # ${cantidadCarritos + 1}`;
      }
    });
    return `Carro creado con id # ${cantidadCarritos + 1}`;
  }

  getCarts() {
    console.log("entro aqui", this.path);
    let contenido = this.fs.readFileSync(this.path, "utf-8");
    return JSON.parse(contenido);
  }

  getCartById(id) {
    let encontrado = false;
    let carrito;
    let contenidoArchivo = this.fs.readFileSync(this.path, "utf-8");
    this.carts = JSON.parse(contenidoArchivo);

    console.log("buscar id = ", id);
    this.carts.forEach((e) => {
      if (e.id == id) {
        carrito = e.products;
        encontrado = true;
        return carrito;
      }
    });
    if (encontrado) {
      return carrito;
    } else {
      return "Not Found";
    }
  }
}
/* 
{"productsCart":[{"idProducto":3, "title":papas, "cantidad":1}],  "id":1}
{"title":"agua","description":"bebida","price":2.66,"thumbnail":"ruta2.png","code":"bebidas#543","stock":33,"id":2}
{"title":"papas","description":"paquetes","price":10.2,"thumbnail":"ruta5.png","code":"paquetes#788","stock":99,"id":3}
{"title":"cebolla","description":"verdura","price":2.00,"thumbnail":"ruta7.png","code":"verdura#88","stock":9,"id":4}
{"title":"jabon","description":"aseo","price":80.9,"thumbnail":"rutaJabon.png","code":"aseo#009","stock":41,"id":1}
*/
