import express from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import postRoutes from "./post.routes";
import friendReqRoutes from "./friendRequest.routes";
import chatRoutes from "./chat.routes";
import messageRoutes from "./message.routes";
import notificationRoutes from "./notification.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/post", postRoutes);
router.use("/friendReq", friendReqRoutes);
router.use("/chats", chatRoutes);
router.use("/message", messageRoutes);
router.use("/notification", notificationRoutes);

export default router;
