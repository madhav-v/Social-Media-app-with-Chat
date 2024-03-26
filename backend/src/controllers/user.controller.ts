import { Request, Response } from "express";
import ErrorHandler from "../utils/errorhandler";
import { getRepository } from "typeorm";
import { Profile } from "../models/Profile.Model";
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
      const profileRepository = getRepository(Profile);
      let profile = await profileRepository.findOne({
        where: { user: req.user.id },
      });
      if (!profile) {
        profile = profileRepository.create({
          user: req.user.id,
          profilePic: profilePic,
        });
      } else {
        profile.profilePic = profilePic;
      }
      let result = await profileRepository.save(profile);
      res.status(201).json({
        user: result,
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
      const data = req.body;
      console.log(req.user);

      const profileRepository = getRepository(Profile);
      let profile = await profileRepository.findOne({
        where: { user: req.user.id },
      });
      if (!profile) {
        profile = profileRepository.create({
          user: req.user.id,
          bio: data.bio,
        });
      } else {
        profile.bio = data.bio;
      }
      let result = await profileRepository.save(profile);
      res.status(201).json({
        user: result,
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
      const profileRepository = getRepository(Profile);
      let profile = await profileRepository.findOne({
        where: { user: req.user.id },
      });
      if (!profile) {
        profile = profileRepository.create({
          user: req.user.id,
          coverPic: coverPic,
        });
      } else {
        profile.coverPic = coverPic;
      }
      let result = await profileRepository.save(profile);
      res.status(201).json({
        user: result,
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

  getLoggedInUser = (req: CustomRequest, res: Response) => {
    res.status(200).json({
      user: req.user,
    });
  };
}
