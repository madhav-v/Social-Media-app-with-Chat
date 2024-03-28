import express from "express";
import { MessageController } from "../controllers/message.controller";
import { checkAuth } from "../middlewares/auth.middleware";

const router = express.Router();
const messageCtrl = new MessageController();

router.post("/message", checkAuth, messageCtrl.createMessage);
router.get("/message/:chatId", checkAuth, messageCtrl.getMessages);

export default router;
