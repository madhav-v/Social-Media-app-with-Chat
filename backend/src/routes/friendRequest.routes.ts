import express from "express";
import { FriendRequestController } from "../controllers/friendRequest.controller";
import { checkAuth } from "../middlewares/auth.middleware";

const router = express.Router();
const friendRequestCtrl = new FriendRequestController();

router.post("/send", checkAuth, friendRequestCtrl.sendFriendRequest);

router.put("/accept", checkAuth, friendRequestCtrl.acceptFriendRequest);

router.get("/friends", checkAuth, friendRequestCtrl.getFriends);

router.get("/get", checkAuth, friendRequestCtrl.getFriendRequests);

router.delete("/delete", checkAuth, friendRequestCtrl.deleteFriendRequest);

export default router;
