import express from "express";
import productsRoutes from "./routes/fileSystem/productos.router.js";
import cartsRoutes from "./routes/fileSystem/carts.router.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);

app.get("/", (req, resp) => {
  resp.send(
    "Servidor Arriba!!! pruebe con =  /productos , /productos/# o /productos?limit=#"
  );
});

app.listen(8080, () => {
  console.log("Servidor escuchando en el puerto 8080");
});
