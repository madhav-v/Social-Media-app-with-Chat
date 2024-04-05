import { LessThan, MoreThan, getRepository } from "typeorm";
import { Notification } from "../models/Notification.model";
import { User } from "../models/User.model";
import { Post } from "../models/Post.model";
import { CustomRequest } from "../middlewares/auth.middleware";
import logger from "../config/logger";
import ErrorHandler from "../utils/errorhandler";
import { Response } from "express";

class NotificationController {
  createNotification = async (
    userToNotify: User,
    userPerformedAction: User,
    post: Post,
    actionType: "like" | "comment"
  ) => {
    const notificationRepository = getRepository(Notification);
    const notification = notificationRepository.create({
      userToNotify,
      userPerformedAction,
      post,
      actionType,
      read: false,
    });

    await notificationRepository.save(notification);
  };

  getUserNotifications = async (req: CustomRequest, res: Response) => {
    try {
      const notificationRepository = getRepository(Notification);
      const notifications = await notificationRepository.find({
        where: { userToNotify: req.user },
        relations: ["userPerformedAction", "post"],
        order: { createdAt: "DESC" },
      });

      res.status(200).json(notifications);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error getting user notifications: ${message}`, error);
      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  getNotificationsAfterTime = async (req: CustomRequest, res: Response) => {
    try {
      const timestamp = req.query.timestamp as string;
      if (!timestamp) {
        throw new ErrorHandler("Timestamp is required", 400);
      }
      const notificationRepository = getRepository(Notification);
      const notifications = await notificationRepository.find({
        where: {
          userToNotify: req.user,
          createdAt: LessThan(new Date(timestamp)),
        },
        relations: ["userPerformedAction", "post"],
        order: { createdAt: "DESC" },
      });

      res.status(200).json(notifications);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error getting user notifications: ${message}`, error);
      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };
}

const notificationCtrl = new NotificationController();
export default notificationCtrl;
