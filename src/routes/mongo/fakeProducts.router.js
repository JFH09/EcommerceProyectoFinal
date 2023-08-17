import { Router } from "express";
import fakeProductsController from "../../controllers/fakeProductsController.js";

const router = Router();

router.get("/", fakeProductsController.getFakeProducts);

export default router;
