import express from "express";
import productsRoutesController from "./controller/productsRoutesController";
import checkAuth from "../middlewares/checkAuth";

const productsRoutes = express.Router();

productsRoutes.get("/", checkAuth, productsRoutesController.getAllProducts);
productsRoutes.get("/:id", checkAuth, productsRoutesController.getProductById);
productsRoutes.post("/", checkAuth, productsRoutesController.createProduct);
productsRoutes.post("/buy/:id", checkAuth, productsRoutesController.buyProduct)
productsRoutes.put("/:id", checkAuth, productsRoutesController.modifyProduct);
productsRoutes.delete("/:id", checkAuth, productsRoutesController.deleteProduct);

export default productsRoutes;