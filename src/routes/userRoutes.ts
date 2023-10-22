import express from "express";
import userRoutesController from "./controller/userRoutesController";

const userRoutes = express.Router();

userRoutes.post("/register", userRoutesController.register);
userRoutes.post("/login", userRoutesController.login);

export default userRoutes;
