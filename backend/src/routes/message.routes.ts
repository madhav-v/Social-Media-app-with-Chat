import express from "express";
import { MessageController } from "../controllers/message.controller";
import { checkAuth } from "../middlewares/auth.middleware";
import upload from "../middlewares/multer.middleware";

const router = express.Router();
const messageCtrl = new MessageController();

router.post(
  "/",
  checkAuth,
  upload.array("images", 3),
  messageCtrl.createMessage
);
router.get("/:chatId", checkAuth, messageCtrl.getMessages);

export default router;
