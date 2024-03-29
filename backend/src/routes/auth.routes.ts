import express from "express";
import { AuthController } from "../controllers/auth.controller";

const router = express.Router();
const authCtrl = new AuthController();


//Authentication
router.post("/register", authCtrl.register);
router.post("/login", authCtrl.login);



export default router;
