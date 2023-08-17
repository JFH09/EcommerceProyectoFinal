import { cartModel } from "../dao/models/cart.model.js";
import productModel from "../dao/models/product.model.js";
import ticketModel from "../dao/models/ticket.model.js";
import ticketCodeModel from "../dao/models/ticketCode.model.js";
import { v4 as uuidv4 } from "uuid";

const getRootCart = async (req, res) => {
  console.log("obteniendo lista total de carritos :");
  try {
    let carts = await cartModel.find();
    res.json({ result: "success", payload: carts });
  } catch (err) {
    console.log("No se pudo obtener el carrito con mongoose : ", err);
  }
};

const getViewCartById = async (req, res) => {
  console.log(req.params.id);
  let idCarrito = req.params.id;
  console.log("idCart 19 : ", idCarrito);
  console.log("obteniendo carrito by id: 20");
  try {
    let cart = await cartModel.findOne({ _id: "649e7d15cb463aef3c6b25a9" });
    //  .populate("products.product");
    console.log(cart);
    if (cart != null) {
      res.render("cart", { cart });
    } else {
      res.render("cart", {});
    }
  } catch (err) {
    console.log("No se pudo obtener el carrito con mongoose : ", err);
  }
};

const getCartById = async (req, res) => {
  let idCarrito = req.params.id;
  console.log("idCart 36 : ", idCarrito);
  console.log("obteniendo carrito by id: 37");
  try {
    let cart = await cartModel
      .findOne({ _id: idCarrito })
      .populate("products.product");
    res.status(201).json(cart);
  } catch (err) {
    console.log("No se pudo obtener el carrito con mongoose : ", err);
  }
};

const addNProductsToCart = async (req, res) => {
  let { quantity } = req.body;
  console.log(quantity);
  let { idCarrito, product, idProduct } = req.params;

  //console.log("entro a post ...", req.body.products);
  console.log("entro a post ...");
  console.log("agregando el carrito con la info -> ", product);

  if (!product || !idProduct || !idCarrito) {
    console.log("entro a condicional de valores incompletos");
    return res.json({ result: "error", error: "Valores incompletos..." });
  }

  console.log("buscando si existe un carrito con el id ", idCarrito);

  let cart = await cartModel.findOne({ _id: idCarrito });
  //console.log("result: ", cart);

  if (!cart) {
    quantity = 1;
    // console.log("No se encontro el carrito...");
    req.logger.warning("No se encontro el carrito!!!, puede que no exista");
    // console.log("se debe crear un nuevo carrito....");
    // console.log(
    //   "puede que no exista el carrito con ese id, para poder agregar un product cree un nuevo carro ..."
    // );

    return res.json({
      result: "error",
      error: "e debe crear un nuevo carrito....",
    });
  } else {
    req.logger.info(" se encontro el carrito!!!");
    // console.log("si existe el carrito ...Agregando el producto al carrito...");
    // console.log(
    //   "buscando la posicion y datos del idproduct que hay que agregar..."
    // );

    //let quantityStockProduct =

    let productPosc = cart.products.findIndex(
      (elemento) => elemento.product == product
    );
    let productData = cart.products.find(
      (elemento) => elemento.product == product
    );

    // console.log(productData);
    if (!productData) {
      //quantity = 1;
      productData = { product, quantity, idProduct };
      cart.products.push(productData);
    } else {
      productData.quantity = productData.quantity + quantity;
      cart.products[productPosc] = productData;
    }

    // console.log(cart);

    try {
      let result = await cartModel.updateOne({ _id: idCarrito }, cart);
      req.logger.info("se edito el carrito!!!");
      res.json({ status: "success", payload: result });
    } catch (err) {
      req.logger.warning("No se pudo EDITAR el carrito, puede que no exista");
      // console.log("No se pudo EDITAR el carrito, puede que no exista");
      res.json({
        result: "error",
        error: "No se pudo EDITAR el carrito, puede que no exista",
      });
    }
  }
};

const editCartByIdandArrayProducts = async (req, res) => {
  let quantity = 0;
  let { idCarrito } = req.params;
  let arrayProducts = req.body;
  console.log(
    "agregando el carrito con la info -> ",
    idCarrito,
    "array",
    arrayProducts
  );

  if (!idCarrito || !arrayProducts) {
    // console.log("entro a condicional de valores incompletos");
    return res.json({ result: "error", error: "Valores incompletos..." });
  }

  // console.log("buscando si existe un carrito con el id ", idCarrito);

  let cart = await cartModel.findOne({ _id: idCarrito });
  // console.log("result: ", cart);

  if (!cart) {
    req.logger.warning("No se encontro el carrito, puede que no exista");
    // console.log("No se encontro el carrito...");
    // console.log("se debe crear un nuevo carrito....");
    // console.log(
    //   "puede que no exista el carrito con ese id, para poder agregar un product cree un nuevo carro ..."
    // );

    return res.json({
      result: "error",
      error: "Se debe crear un nuevo carrito....",
    });
  } else {
    // console.log("si existe el carrito ...Agregando el producto al carrito...");
    req.logger.info("existe el carrito ...Agregando el producto al carrito");
    arrayProducts.forEach((element) => {
      cart.products.push({
        product: element.idProduct,
        quantity: element.quantity,
      });
    });

    // console.log(cart);

    try {
      let result = await cartModel.updateOne({ _id: idCarrito }, cart);
      req.logger.info("Carrito editado");
      res.json({ status: "success", payload: result });
      console.log(result);
    } catch (err) {
      req.logger.info("No se pudo EDITAR el carrito, puede que no exista");
      //console.log("No se pudo EDITAR el carrito, puede que no exista");
      res.json({
        result: "error",
        error: "No se pudo EDITAR el carrito, puede que no exista",
      });
    }
  }
};

const deleteCartById = async (req, res) => {
  console.log("entro a eliminar carrito...");
  let { id } = req.params;

  try {
    let result = await cartModel.deleteOne({ _id: id });
    req.logger.info("SE elimino carrito");
    res.json({ status: "success", payload: result });
  } catch (err) {
    req.logger.warning("No se pudo eliminar el carrito, puede que no existao");
    // console.log("No se pudo eliminar el carrito, puede que no exista");
    res.json({
      result: "error",
      error: "No se pudo eliminar el carrito, puede que no exista",
    });
  }
};

const addNewCart = async (req, res) => {
  let response = await cartModel.create({});
  res.json({ response: "Se creo el carrito...", result: response });
};

const addIdProductToCart = async (req, res) => {
  let idCart = req.params.idCart;
  let idProduct = req.params.idProduct;
  let { quantity } = req.body;

  console.log("product: ", idProduct, "idCart", idCart, "quantity", quantity);
  try {
    let carrito = await cartModel.find({ _id: idCart });
    let producto = await cartModel.find({ _id: idProduct });

    if (carrito && producto) {
      req.logger.info("existen product y carrito");
      let cart = carrito[0];
      // console.log("*****344", cart);
      // console.log(carrito);
      // console.log(carrito[0].products);
      let existe = false;
      let posicionProducto = "";
      cart.products.forEach((elemento) => {
        // console.log("en foreach 355", elemento.product._id);
        if (elemento.product._id == idProduct) {
          req.logger.info("SE encontro product en carrito");
          //verificar tambien el code
          // console.log("el producto existe en el carrito...");
          // console.log(
          //   "Quantity de product guardado esta en :",
          //   elemento.quantity
          // );
          let cantActualProduct = parseInt(elemento.quantity);
          quantity = parseInt(quantity);
          quantity = cantActualProduct + quantity;
          existe = true;
          //let id = elemento.product.idCarrito.split('"');
          // console.log(elemento._id);
          // console.log("typeof -> ", typeof elemento._id);
          let el = elemento._id.toString();
          // console.log("typeof -> ", typeof el);
          let div = el.split('"', 2);
          // console.log("division", div[0]);
          div = div[0];
          // console.log(cart.products);
          posicionProducto = cart.products.indexOf(elemento);
          //PENSAR COMO PUEDO OBTENER LA POSICION PARA QUE SI EXISTE ACTUALICE EL PRODUCT EN VEZ DE PUSHEARLO
          // console.log("pos Product .> ", posicionProducto);
        } else {
          console.log("el producto NO  existe en el carrito...");
          req.logger.warning("el producto no existe en el carrito");
        }
      });

      // console.log("LINE 385 Quantity quedo en :", quantity);
      // console.log("Posicion Producto", posicionProducto);
      let user = req.session.user;
      console.log("user obtenido 262", user);
      console.log("trayendo info del idProduct -  ", idProduct);
      let productInfo = await productModel.findById({ _id: idProduct });
      let estado;
      let result;
      console.log("obteniendo usu para EDITAR prodct 265", user);
      console.log("obteniendo producto para editar 266", productInfo);
      let ownerProduct = productInfo.owner;
      let owner = ownerProduct.split(" ");
      //|| user.rol.toUpperCase() != "PREMIUM"
      if (user.id != owner[1]) {
        if (existe) {
          //cart.products[]
          // console.log("actualizando producto en la posicion ", posicionProducto);
          // console.log(cart.products[posicionProducto].quantity);
          req.logger.info("agregando producto que existe en el carrito");
          cart.products[posicionProducto].quantity = quantity;
          // console.log(cart.products[posicionProducto]);
        } else {
          req.logger.info("agregando producto que no existe en el carrito");
          cart.products.push({ product: idProduct, quantity: quantity });
        }
        req.logger.info("Actualizando carrito!!!");
        result = await cartModel.updateOne({ _id: idCart }, cart);
        estado = "success";
        // res.json({ status: "success", result: result });
      } else {
        req.logger.info("No puede realizar esta accion!!!");
        result = "No puede realizar esta accion ";
        estado = "error";
      }
      res.json({ status: estado, result: result });
    } else {
      res.json({ status: "Error", result: "El carrito puede que no exista 1" });
    }
    // res.json({ status: estado, result: result });
  } catch (err) {
    req.logger.error("No se pudo realizar la acción");
    res.json({
      status: "Error",
      result: "No se pudo realizar la acción",
      err,
    });
  }
};

const restCantProductoById = async (req, res) => {
  let idCart = req.params.idCart;
  let idProduct = req.params.idProduct;
  //let { quantity } = req.body;

  console.log("product: ", idProduct, "idCart", idCart);
  try {
    let carrito = await cartModel.find({ _id: idCart });
    let producto = await cartModel.find({ _id: idProduct });

    if (carrito && producto) {
      let cart = carrito[0];
      // console.log("*****425", cart);
      console.log(carrito);
      console.log(carrito[0].products);
      let existe = false;
      let posicionProducto = "";
      cart.products.forEach((elemento) => {
        // console.log("en foreach 355", elemento.product._id);
        if (elemento.product._id == idProduct) {
          //verificar tambien el code
          console.log("el producto existe en el carrito...");
          // console.log(
          //   "Quantity de product guardado esta en :",
          //   elemento.quantity
          // );
          //quantity = elemento.quantity - 1;
          // console.log(elemento.quantity - 1);
          //console.log("quantity en disminuit line 438", quantity);
          existe = true;
          //let id = elemento.product.idCarrito.split('"');
          // console.log(elemento._id);
          // console.log("typeof -> ", typeof elemento._id);
          let el = elemento._id.toString();
          // console.log("typeof -> ", typeof el);
          let div = el.split('"', 2);
          // console.log("division", div[0]);
          div = div[0];
          // console.log(cart.products);
          posicionProducto = cart.products.indexOf(elemento);
          // console.log("pos Product .> ", posicionProducto);
        } else {
          // console.log("el producto NO  existe en el carrito...");
        }
      });

      // console.log("Quantity quedo en :", quantity);
      // console.log("Posicion Producto", posicionProducto);
      if (existe) {
        //cart.products[]
        // console.log("actualizando producto en la posicion ", posicionProducto);
        // console.log(cart.products[posicionProducto].quantity);
        cart.products[posicionProducto].quantity =
          cart.products[posicionProducto].quantity - 1;
        console.log(cart.products[posicionProducto]);
      } else {
        cart.products.push({ product: idProduct, quantity: quantity });
      }

      let result = await cartModel.updateOne({ _id: idCart }, cart);
      req.logger.info("disminuyendo producto del carrito");
      res.json({ status: "success", result: result });
    } else {
      req.logger.warning("El carrito puede que no exista");
      res.json({ status: "Error", result: "El carrito puede que no exista 1" });
    }
  } catch (err) {
    req.logger.warning("El carrito puede que no exista");
    res.json({
      status: "Error",
      result: "El carrito puede que no exista 2",
      err,
    });
  }
};

const deleteAllProductCart = async (req, res) => {
  console.log("Eliminando todo el producto del carrito...");
  let idCart = req.params.idCart;
  let idProduct = req.params.idProduct;
  let product = req.params.product;
  //let { quantity } = req.body;

  console.log("354 product: ", idProduct, "idCart", idCart, "product", product);
  try {
    let carrito = await cartModel.find({ _id: idCart });
    let producto = await cartModel.find({ _id: idProduct });
    console.log("idProducto entra a cartsController 375", idProduct);
    if (carrito && producto) {
      let cart = carrito[0];
      console.log("*****378", cart);
      console.log(carrito);
      console.log(carrito[0].products);
      let existe = false;
      let posicionProducto = "";
      cart.products.forEach((elemento) => {
        let idElement = JSON.stringify(elemento._id);
        let elementIdSeparated = idElement.split('"');

        console.log(
          "comparando ids -> ",
          elementIdSeparated[1],
          " -IDPRODUCT ",
          idProduct
        );
        console.log("en foreach 384", elemento._id);
        if (elementIdSeparated[1] == idProduct) {
          //verificar tambien el code
          console.log("el producto existe en el carrito...");
          console.log(elemento.quantity - 1);
          existe = true;
          console.log(elemento._id);
          console.log("typeof -> ", typeof elemento._id);
          let el = elemento._id.toString();
          console.log("typeof -> ", typeof el);
          let div = el.split('"', 2);
          console.log("division", div[0]);
          div = div[0];
          console.log(cart.products);
          posicionProducto = cart.products.indexOf(elemento);
          console.log("pos Product .> ", posicionProducto);
        } else {
          console.log("el producto NO  existe en el carrito... 401");
        }
      });

      // console.log("Quantity quedo en :", quantity);
      console.log("Posicion Producto", posicionProducto);
      if (existe) {
        //cart.products[]
        console.log("actualizando producto en la posicion ", posicionProducto);
        //console.log(cart.products[posicionProducto].quantity);
        console.log("line 534");
        console.log(cart.products);
        cart.products = cart.products.filter(
          (e) => e != cart.products[posicionProducto]
        );
        console.log("line 539");
        console.log(cart.products);
      } else {
        res.json({
          status: "error",
          result: "No se pudo eliminar el producto del carrito",
        });
      }

      let result = await cartModel.updateOne({ _id: idCart }, cart);

      res.json({ status: "success", result: result });
      req.logger.warning("Se elimino todo un producto del carrito");
    } else {
      req.logger.warning("dEl carrito puede que no exista");
      res.json({ status: "Error", result: "El carrito puede que no exista 1" });
    }
  } catch (err) {
    res.json({
      status: "Error",
      result: "El carrito puede que no exista 2",
      err,
    });
  }
};

const getViewPurchase = async (req, res) => {
  console.log("entro a vista de ticket de compra...");
  let userEmail = req.session.user.email;

  try {
    let ticket = await ticketModel.findOne({ purchaser: userEmail });
    //.populate("code");

    console.log(userEmail, ticket);

    let infoCompra = ticket.infoPurchase.split("nextProduct");
    console.log("infoCompra:", infoCompra);
    res.render("purchase", {
      user: userEmail,
      ticket_id: ticket._id,
      ticketCode_id: ticket.code._id,
      ticketCode: ticket.code.code,
      ticketCode_expireAt: ticket.code.expireAt,
      purchase_dataTime: ticket.purchase_dataTime,
      amount: ticket.amount,
      purchaser: ticket.purchaser,
      infoPurchase: infoCompra,
    });
  } catch (err) {
    console.log("no se pudo relizar la operación");
    req.logger.error("No se pudo realizar la operacion ");
  }
};

const addTicketToPurchase = async (req, res) => {
  let infoCarritoCompra = req.body;
  console.log("454addTicket", infoCarritoCompra);
  let listaProductosCompra = infoCarritoCompra.listaProductosCompra;
  let listaProductosPermanecenEnCarrito =
    infoCarritoCompra.listaProductosPermanecenEnCarrito;

  let precioTotal = 0.0;
  let infoProductos = "";
  let infoProductosNoStock = "";
  listaProductosCompra.forEach((producto) => {
    console.log(producto.product.price);
    console.log("464", producto);
    let precioProducto = parseFloat(producto.product.price);
    precioTotal = precioTotal + precioProducto * producto.quantity;

    infoProductos =
      infoProductos +
      producto.productCartId +
      " | " +
      producto.product.title +
      " | quantity:" +
      producto.quantity +
      " | precioc/u:" +
      producto.product.price +
      " | TotalProduct -  " +
      precioProducto * producto.quantity +
      " nextProduct ";
  });

  listaProductosPermanecenEnCarrito.forEach((producto) => {
    console.log(producto.product._id);

    infoProductosNoStock =
      infoProductosNoStock +
      producto.productCartId +
      " quantity " +
      producto.quantity +
      " nextProduct ";
  });
  console.log(infoProductos);
  console.log(precioTotal);
  console.log(infoProductosNoStock);

  try {
    const codeTicket = uuidv4();
    const expirationTime = new Date(Date.now() + 10 * 60 * 1000);
    const ticketCode = await ticketCodeModel.create({
      code: codeTicket,
      expireAt: expirationTime,
    });

    console.log("ticketCode", ticketCode);
    let fechaActual = new Date();
    let fecha =
      fechaActual.getDate() +
      "/" +
      fechaActual.getMonth() +
      "/" +
      fechaActual.getFullYear() +
      " " +
      fechaActual.getHours() +
      ":" +
      fechaActual.getMinutes();
    console.log(req.session.user);
    let user = req.session.user;
    const ticket = {
      code: ticketCode,
      purchase_dataTime: fecha,
      amount: precioTotal,
      purchaser: user.email,
      infoPurchase: infoProductos,
      infoNoPurchase: infoProductosNoStock,
    };
    const ticketPurchase = await ticketModel.create(ticket);
    console.log(ticket);
    console.log("ticketPurchase => 496", ticketPurchase);
    res.json({
      status: "Success",
      result: ticketPurchase,
    });
  } catch (err) {
    console.log("No se pudo generar el ticket de compra");
    res.json({
      status: "Error",
      result: "No se pudo generar el ticket de compra",
      err,
    });
  }
};

const deleteTicketToPurchase = async (req, res) => {
  console.log("entro a eliminar ticket...");
  let { ticketId } = req.body;
  let { ticketCode } = req.body;
  console.log(ticketCode, "-", ticketId);
  try {
    let resultTicket = await ticketModel.deleteOne({ _id: ticketId });
    let resultTicketCode = await ticketCodeModel.deleteOne({
      code: ticketCode,
    });
    res.json({
      status: "success",
      payload: resultTicket,
      payload2: resultTicketCode,
    });
  } catch (err) {
    console.log(
      "No se pudo eliminar el ticket, puede que no exista o ya vencio"
    );
    res.json({
      result: "error",
      error: "No se pudo eliminar el ticket, puede que no exista o ya vencio",
    });
  }
};

const getInfoPurchase = async (req, res) => {
  let { ticketId } = req.params;
  let { idCart } = req.params;
  console.log("idCart ->", idCart);
  console.log("entrando a pagar....");

  console.log("obteniendo informacion para actualizar data....");
  let infoTicket = await ticketModel.findById({ _id: ticketId });
  console.log(infoTicket);

  console.log(
    "actualizando informacion de productos que no se pudieron comprar... en el ticket",
    ticketId
  );
  //Toca dejarlos en el carrito...
  let infoCarrito = await cartModel.findById({ _id: idCart });
  console.log("info carrito - ", infoCarrito);
  //let infoCartProductsNoComprados;
  //Armando array para actualizar info en el carrito...

  // let infoProductNoPurchase1 = infoTicket.infoNoPurchase.split("nextProduct");
  // console.log("infoNoComprados...", infoProductNoPurchase1);
  // let infoProductNoPurchase = infoProductNoPurchase1.filter((p) => p != " ");
  // console.log("infoNoComprados...", infoProductNoPurchase);
  // //eliminando productos del carrito para luego modificarlo con el array
  // infoProductNoPurchase.forEach((product) => {
  //   let infoProduct = product.split("quantity");
  //   console.log(infoProduct);
  //   console.log("idProducto a eliminar -> ", infoProduct[0]);
  //   //cartModel.deleteOne({_id:})
  // });

  let infoProductPurchase1 = infoTicket.infoPurchase.split("nextProduct");
  console.log("infoComprados...", infoProductPurchase1);
  let infoProductPurchase = infoProductPurchase1.filter((p) => p != " ");

  console.log("infoComprados...", infoProductPurchase);
  let listaProductToDelete = [];
  let productToDelete = {
    idProduct: "",
    product: "",
  };
  //eliminando productos del carrito comprados
  infoProductPurchase.forEach((product) => {
    let infoProduct = product.split("|");
    console.log(infoProduct);
    console.log("idProducto a eliminar -> ", infoProduct[0]);
    console.log("Producto a eliminar -> ", infoProduct[1]);
    let productToDelete = {
      idProduct: infoProduct[0],
      product: infoProduct[1],
    };

    listaProductToDelete.push(productToDelete);
  });
  console.log(listaProductToDelete);
  res.json({
    status: "success",
    result: listaProductToDelete,
  });
};

const getInfoTicket = async (req, res) => {
  console.log("ENTRO A GET ID ticket ***************");
  let { idTicket } = req.params;
  console.log("Entro a obtener product by id", idTicket);
  try {
    let ticket = await ticketModel.findOne({ _id: idTicket });
    console.log("ticket...**********");
    console.log(ticket);
    res.status(201).json(ticket);
  } catch (error) {
    console.log("No se pudo obtener los productos con mongoose : ", error);
    res.status(400).json("error", error);
  }
};
export default {
  getRootCart,
  getViewCartById,
  getCartById,
  addNProductsToCart,
  editCartByIdandArrayProducts,
  deleteCartById,
  addNewCart,
  addIdProductToCart,
  restCantProductoById,
  deleteAllProductCart,
  getViewPurchase,
  addTicketToPurchase,
  deleteTicketToPurchase,
  getInfoPurchase,
  getInfoTicket,
};
