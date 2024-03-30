import express from "express";
import { AuthController } from "../controllers/auth.controller";
import { checkAuth } from "../middlewares/auth.middleware";

const router = express.Router();
const authCtrl = new AuthController();

//Authentication
router.post("/register", authCtrl.register);
router.post("/login", authCtrl.login);
router.get("/:id", checkAuth, authCtrl.getUserById);

export default router;
