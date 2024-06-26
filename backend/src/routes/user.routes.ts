import express from "express";
import { UserController } from "../controllers/user.controller";
import { checkAuth } from "../middlewares/auth.middleware";
import upload from "../middlewares/multer.middleware";

const router = express.Router();
const userCtrl = new UserController();

router.post(
  "/addProfilePic",
  checkAuth,
  upload.single("image"),
  userCtrl.addProfilePic
);
router.post("/bio", checkAuth, userCtrl.updateBio);
router.post(
  "/addCoverPic",
  checkAuth,
  upload.single("coverPic"),
  userCtrl.updateCoverPicture
);
router.get("/me", checkAuth, userCtrl.getLoggedInUser);
router.get("/search", checkAuth, userCtrl.searchUser);
router.get("/all", checkAuth, userCtrl.getUsers);

export default router;
