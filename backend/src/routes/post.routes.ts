import express from "express";
import { PostController } from "../controllers/post.controller";
import { checkAuth } from "../middlewares/auth.middleware";
import upload from "../middlewares/multer.middleware";

const router = express.Router();
const postController = new PostController();

router.post(
  "/",
  checkAuth,
  upload.array("media", 5),
  postController.createPost
);

router.get("/", checkAuth, postController.getAllPosts);

router.get("/myposts", checkAuth, postController.getMyPosts);
router.get("/:id", checkAuth, postController.getPostById);

router.delete("/:id", checkAuth, postController.deletePost);

router.put(
  "/:id",
  checkAuth,
  upload.array("media", 5),
  postController.updatePost
);

export default router;
