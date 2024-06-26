import { Request, Response } from "express";
import ErrorHandler from "../utils/errorhandler";
import { Like, Not, getRepository } from "typeorm";
import { User } from "../models/User.model"; // Assuming you have a User model
import logger from "../config/logger";

interface CustomRequest extends Request {
  user?: any;
}

export class UserController {
  addProfilePic = async (req: CustomRequest, res: Response) => {
    try {
      let profilePic = "";
      if (req.file) {
        profilePic = req.file.path;
      }
      const userRepository = getRepository(User);
      let user = await userRepository.findOne({
        where: { id: req.user.id },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.profilePic = profilePic;

      console.log("user", user);

      await userRepository.save(user);
      res.status(201).json({
        user,
        message: "Profile Picture Added Successfully",
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error adding profile picture: ${message}`, error);
      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  updateBio = async (req: CustomRequest, res: Response) => {
    try {
      const { bio } = req.body;
      const userRepository = getRepository(User);
      let user = await userRepository.findOne({
        where: { id: req.user.id },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.bio = bio;
      await userRepository.save(user);
      res.status(201).json({
        data: user,
        message: "Bio Updated Successfully",
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error updating bio: ${message}`, error);
      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  updateCoverPicture = async (req: CustomRequest, res: Response) => {
    try {
      let coverPic = "";
      if (req.file) {
        coverPic = req.file.path;
      }
      const userRepository = getRepository(User);
      let user = await userRepository.findOne({
        where: { id: req.user.id },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.coverPic = coverPic;
      await userRepository.save(user);
      res.status(201).json({
        user,
        message: "Cover Picture Updated Successfully",
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error updating cover picture: ${message}`, error);
      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  getLoggedInUser = async (req: CustomRequest, res: Response) => {
    try {
      const userRepository = getRepository(User);
      let user = await userRepository.findOne({
        where: { id: req.user.id },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({
        data: user,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error getting logged-in user: ${message}`, error);
      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  searchUser = async (req: CustomRequest, res: Response) => {
    try {
      let { query } = req.query;
      if (typeof query === "string") {
        query = query.charAt(0).toUpperCase() + query.slice(1); // Capitalize the first letter of the query
      }
      const userRepository = getRepository(User);

      const users = await userRepository.find({
        where: [
          { firstName: Like(`%${query}%`) },
          { lastName: Like(`%${query}%`) },
        ],
      });

      res.status(200).json({
        data: users,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error searching user: ${message}`, error);
      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  getUsers = async (req: CustomRequest, res: Response) => {
    try {
      const loggedInUserId = req.user.id;
      const userRepository = getRepository(User);
      const users = await userRepository.find({
        where: {
          id: Not(loggedInUserId), // Exclude the logged-in user's ID from the query
        },
      });
      res.status(200).json({
        data: users,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error getting users: ${message}`, error);
      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };
}
