import express from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import postRoutes from "./post.routes";
import friendReqRoutes from "./friendRequest.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/post", postRoutes);
router.use("/friendReq", friendReqRoutes);

export default router;
