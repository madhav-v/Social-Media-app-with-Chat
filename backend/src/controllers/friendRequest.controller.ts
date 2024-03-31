import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { FriendRequest } from "../models/FriendRequest.model";
import { User } from "../models/User.model";
import { CustomRequest } from "../middlewares/auth.middleware";
import ErrorHandler from "../utils/errorhandler";
import logger from "../config/logger";
import { io } from "../config/socket";

export class FriendRequestController {
  sendFriendRequest = async (req: CustomRequest, res: Response) => {
    try {
      const id = req.user.id;

      const { recipientId } = req.body;

      const userRepository = getRepository(User);
      const recipient = await userRepository.findOne({
        where: { id: recipientId },
      });

      if (!recipient) {
        return res.status(404).send("Recipient not found");
      }

      const friendRequestRepository = getRepository(FriendRequest);
      const existingRequest = await friendRequestRepository.findOne({
        where: {
          sender: { id: id },
          recipient: { id: recipientId },
          status: "pending",
        },
      });

      if (existingRequest) {
        return res.status(400).send("Friend request already sent");
      }

      const friendRequest = friendRequestRepository.create({
        sender: { id: req.user.id },
        recipient,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await friendRequestRepository.save(friendRequest);

      io.emit("newFriendrequest", { recipientId });

      res.status(200).send("Friend request sent successfully");
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode); // Create an instance of ErrorHandler
      logger.error(`Error sending friend request: ${message}`, error);
      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  acceptFriendRequest = async (req: CustomRequest, res: Response) => {
    try {
      const { requestId } = req.body;
      const friendRequestRepository = getRepository(FriendRequest);
      const friendRequest = await friendRequestRepository.findOne({
        where: { id: requestId },
        relations: ["sender", "recipient"],
      });

      if (!friendRequest) {
        return res.status(404).send("Friend request not found");
      }

      // if (friendRequest.recipient.id !== req.user.id) {
      //   return res
      //     .status(403)
      //     .send("You are not authorized to accept this request");
      // }

      friendRequest.status = "accepted";
      await friendRequestRepository.save(friendRequest);

      io.emit("friendRequestAccepted", { requestId });

      res.status(200).send("Friend request accepted successfully");
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode); // Create an instance of ErrorHandler
      logger.error(`Error accepting friend request: ${message}`, error);
      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  getFriends = async (req: CustomRequest, res: Response) => {
    try {
      const userId = req.user.id;

      const friendRequests = await getRepository(FriendRequest)
        .createQueryBuilder("friendRequest")
        .where("friendRequest.status = :status", { status: "accepted" })
        .andWhere(
          "(friendRequest.sender = :userId OR friendRequest.recipient = :userId)",
          { userId }
        )
        .leftJoinAndSelect("friendRequest.sender", "sender")
        .leftJoinAndSelect("friendRequest.recipient", "recipient")
        .getMany();

      const friends = friendRequests.map((request) => {
        if (request.sender && request.recipient) {
          return request.sender.id === userId
            ? request.recipient
            : request.sender;
        } else {
          return null;
        }
      });

      res.status(200).json({
        friends: friends,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode); // Create an instance of ErrorHandler
      logger.error(`Error getting friends: ${message}`, error);
      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  getFriendRequests = async (req: CustomRequest, res: Response) => {
    try {
      const recipientId = req.user.id;

      const friendRequests = await getRepository(FriendRequest).find({
        where: {
          recipient: recipientId,
          status: "pending",
        },
        relations: ["sender"],
      });

      res.status(200).json({
        friendRequests: friendRequests,
      });
    } catch (exception: any) {
      const statusCode = exception.statusCode || 500;
      const message = exception.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode); // Create an instance of ErrorHandler
      logger.error(`Error getting friend requests: ${message}`, exception);
      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  deleteFriendRequest = async (req: CustomRequest, res: Response) => {
    try {
      const { requestId } = req.body;
      const friendRequestRepository = getRepository(FriendRequest);
      const friendRequest = await friendRequestRepository.findOne({
        where: { id: requestId },
      });

      if (!friendRequest) {
        return res.status(404).send("Friend request not found");
      }

      await friendRequestRepository.remove(friendRequest);

      res.status(200).send("Friend request deleted successfully");
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode); // Create an instance of ErrorHandler
      logger.error(`Error deleting friend request: ${message}`, error);
      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };
}
