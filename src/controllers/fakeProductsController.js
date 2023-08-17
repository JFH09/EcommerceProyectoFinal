import FakeProduct from "../services/fakeProducts.service.js";

const FakeProductService = new FakeProduct();
const getFakeProducts = async (req, res) => {
  let user = req.session.user;
  req.logger.warning(
    "el usuario que esta agregando el producto es : ",
    user.rol
  );

  let ownerInfo = "";
  if (user.rol.toUpperCase() != "PREMIUM") {
    console.log("El producto fue creado por un no premium");
    ownerInfo = "ADMIN";
  } else {
    console.log("El producto fue creado por user premium");
    ownerInfo = "PREMIUM " + user.id;
  }
  try {
    let products = await FakeProductService.getFakeProducts(ownerInfo);
    req.logger.info("se crearon los 100  productos!!!");
    return res.status(201).json(products);
  } catch (err) {
    req.logger.error("No se crearon los 100  productos!!!");
    return res.send(401).json({ status: "error", error: error });
  }
};

export default {
  getFakeProducts,
};
