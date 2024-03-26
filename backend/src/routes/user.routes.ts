import express from "express";
import { UserController } from "../controllers/user.controller";
import { checkAuth } from "../middlewares/auth.middleware";
import upload from "../middlewares/multer.middleware";

const router = express.Router();
const userCtrl = new UserController();

router.post(
  "/addProfilePic",
  upload.single("profilePic"),
  checkAuth,
  userCtrl.addProfilePic
);
router.post("/bio", checkAuth, userCtrl.updateBio);
router.post(
  "/addCoverPic",
  upload.single("coverPic"),
  checkAuth,
  userCtrl.updateCoverPicture
);
router.get("/me", checkAuth, userCtrl.getLoggedInUser);

export default router;
