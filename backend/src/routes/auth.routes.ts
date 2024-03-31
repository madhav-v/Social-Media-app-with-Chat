import express from "express";
import { AuthController } from "../controllers/auth.controller";
import { checkAuth } from "../middlewares/auth.middleware";

const router = express.Router();
const authCtrl = new AuthController();

//Authentication
router.post("/register", authCtrl.register);
router.post("/login", authCtrl.login);
router.post("/forgetPassword", authCtrl.forgetPassword);
router.post("/resetPassword", authCtrl.resetPassword);
router.get("/:id", checkAuth, authCtrl.getUserById);
export default router;
