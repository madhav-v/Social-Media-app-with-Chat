import express from "express";
import { checkAuth } from "../middlewares/auth.middleware";
import notificationCtrl from "../controllers/notification.controller";
const router = express.Router();

router.get("/", checkAuth, notificationCtrl.getUserNotifications);
router.get(
  "/after-time",
  checkAuth,
  notificationCtrl.getNotificationsAfterTime
);

export default router;
