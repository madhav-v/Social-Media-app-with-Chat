import express from "express";
import { ChatController } from "../controllers/chat.controller";
import { checkAuth } from "../middlewares/auth.middleware";

const router = express.Router();
const chatController = new ChatController();

router.post("/access", checkAuth, chatController.accessChat);
router.get("/fetch", checkAuth, chatController.fetchChats);
router.post("/createGroup", checkAuth, chatController.createGroupChat);
router.put("/rename", checkAuth, chatController.renameGroup);
router.put("/addToGroup", checkAuth, chatController.addToGroup);
router.put("/removeFromGroup", checkAuth, chatController.removeFromGroup);

export default router;
