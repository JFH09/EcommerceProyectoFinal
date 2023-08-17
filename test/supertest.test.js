import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Testing Ecommerce", () => {
  describe("Test de Prodcutos", () => {
    const productMock = {
      title: "pasta",
      description: "despensa",
      price: "2.66",
      thumbnail: "rutaPASTA.png",
      code: "despensa#3225",
      stock: "62",
      owner: "ADMIN",
    };
    it("El endpoint POST /api/products/ debe crear un producto correctamente siempre y cuando este logueado es decir que en el test debe aparecer un error y un mensaje diciendo que no esta autenticado", async () => {
      const { status, ok, _body } = await requester
        .post("/api/products/")
        .send(productMock);
      console.log(status);
      console.log(ok);
      console.log(_body);

      switch (status) {
        case 200:
          expect(_body.error).to.equal("Not authenticated");
      }
    });

    it("El endpoint GET /api/products/:id debe obtener la información de un prodcuto (como un objeto) por el id y traer todas las proiedades que lo componen", async () => {
      let idProduct = "64cec5849e98da720ab15a21";
      const { status, ok, _body } = await requester.get(
        `/api/products/${idProduct}`
      );
      console.log(status);
      console.log(ok);
      console.log(_body);

      expect(_body).to.be.an("object");
      expect(_body).to.have.property("_id");
      expect(_body).to.have.property("title");
      expect(_body).to.have.property("description");
      expect(_body).to.have.property("price");
      expect(_body).to.have.property("thumbnail");
      expect(_body).to.have.property("code");
      expect(_body).to.have.property("stock");
      expect(_body).to.have.property("owner");
      expect(_body).to.have.property("__v");
      //   expect(_body).to.have.property("__v2");
    });

    it("El endpoint GET /api/products/productsList debe obtener toda la lista de productos existentes en la base, tambien debe trar información extra como el totalDocs, limit,  totalPages,  page,  pagingCounter,  hasPrevPage,  hasNextPage,  prevPage,  nextPage, ya que son necesarios para seguir con la logica del negocio ", async () => {
      const { status, ok, _body } = await requester.get(
        `/api/products/productsList`
      );
      console.log(status);
      console.log(ok);
      console.log(_body);

      expect(_body.docs).to.be.an("array");
      expect(_body).to.have.property("totalDocs");
      expect(_body).to.have.property("limit");
      expect(_body).to.have.property("totalPages");
      expect(_body).to.have.property("page");
      expect(_body).to.have.property("pagingCounter");
      expect(_body).to.have.property("hasPrevPage");
      expect(_body).to.have.property("hasNextPage");
      expect(_body).to.have.property("prevPage");
      expect(_body).to.have.property("nextPage");
      //   expect(_body).to.have.property("__v2");
    });
  });

  describe("Test de Carts", () => {
    let idCart = "64ced53c32b17db8add6ef7a";
    let listaProductosCompra = [
      {
        product: {
          code: "bebidas#543",
          description: "bebida",
          owner: "ADMIN",
          price: "2.66",
          stock: "78",
          thumbnail: "rutaAGUA.png",
          title: "agua",
          __v: 0,
          _id: "64cec5849e98da720ab15a21",
        },
        quantity: 3,
        productCartId: "64d715ece690c32b34bda0ae",
      },
      {
        product: {
          _id: "64cec5bd9e98da720ab15a38",
          title: "Azucar",
          description: "Despensa",
          price: "3.44",
          thumbnail: "rutaAzucar.png",
          code: "azucar#222",
          stock: "80",
          owner: "PREMIUM 64ce8e5a3040b4124ddb50c9",
          __v: 0,
        },
        quantity: 5,
        productCartId: "64d715f2e690c32b34bda0b5",
      },
    ];
    let listaProductosPermanecenEnCarrito = [];
    let infoCarritoCompra = {
      listaProductosCompra: listaProductosCompra,
      listaProductosPermanecenEnCarrito: listaProductosPermanecenEnCarrito,
    };

    it("El endpoint GET /api/carts/:idCart/purchase/:ticketId debe obtener la informacion de una compra", async () => {
      let ticketId = "64d7c4cf90977f5b93991873";
      let idCart = "64ced53c32b17db8add6ef7a";
      const { status, ok, _body } = await requester.get(
        `/api/carts/${idCart}/purchase/${ticketId}`
      );
      console.log(status);
      console.log(ok);
      console.log(_body);
      expect(_body.status).to.equal("success");
      expect(_body.result).to.be.an("array");
    });

    it("El endpoint DELETE /api/carts/:idCart/purchase debe eliminar un ticket correctamente ", async () => {
      let idCartUsu = "64ce8e593040b4124ddb50c7";
      let infoTicket = {
        ticketId: "64cecf0ede16a5d4f5ef64c5",
        ticketCode: "64cecf0ede16a5d4f5ef64c3",
      };
      const { status, ok, _body } = await requester
        .delete(`/api/carts/${idCartUsu}/purchase`)
        .send(infoTicket);
      console.log(status);
      console.log(ok);
      console.log(_body);
      expect(_body).to.have.property("payload");
      expect(_body).to.have.property("payload2");
    });

    it("El endpoint POST /api/carts/ debe crear un nuevo carrito vacio correctamente ", async () => {
      const { status, ok, _body } = await requester.post(`/api/carts/`);
      console.log(status);
      console.log(ok);
      console.log(_body);
      expect(_body.response).to.equal("Se creo el carrito...");
      expect(_body.result).to.have.property("_id");
      expect(_body.result).to.have.property("products");
      // expect(_body).to.have.property("payload2");
    });
  });

  describe("Test de Sessions", () => {
    const UserLoginMock = {
      email: "usuario2@gmail.com",
      password: "usuario2",
    };

    let rolUsuario = "";
    it("El endpoint get /api/sessions/user/:id debe obtener la informacion de un ususario por id correctamente ", async () => {
      let id = "64cecfcb2dc6dc21417576de";
      const { status, ok, _body } = await requester.get(
        `/api/sessions/user/${id}`
      );
      console.log(status);
      console.log(ok);
      console.log(_body);
      expect(_body._id).to.equal(id);
      expect(_body).to.have.property("_id");
      expect(_body).to.have.property("first_name");
      expect(_body).to.have.property("last_name");
      expect(_body).to.have.property("email");
      expect(_body).to.have.property("age");
      expect(_body).to.have.property("password");
      expect(_body).to.have.property("rol");
      rolUsuario = _body.rol;
      expect(_body).to.have.property("carts");
      expect(_body).to.have.property("fullName");
      expect(_body).to.have.property("__v");
      expect(_body.carts).to.be.an("array");
    });
    it("El endpoint POST /api/sessions/login debe dejar ingresar un ususario correctamente ", async () => {
      const { status, ok, _body } = await requester
        .post("/api/sessions/login")
        .send(UserLoginMock);
      console.log(status);
      console.log(ok);
      console.log(_body);
      expect(_body.status).to.equal("success");
      expect(_body.payload).to.have.property("_id");
      expect(_body.payload.email).to.equal(UserLoginMock.email);
    });

    it("El endpoint GET /api/sessions/logoutSessiondebe dejar cerrar sesion correctamente ", async () => {
      const { status, ok, _body } = await requester.get(
        `/api/sessions/logoutSession`
      );
      console.log(ok);
      console.log(_body);
      expect(_body).to.have.property("status");
      expect(_body.payload).to.equal("logout ok!");
    });
  });
});
