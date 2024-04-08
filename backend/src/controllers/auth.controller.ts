import { Request, Response } from "express";
import ErrorHandler from "../utils/errorhandler";
import { getRepository } from "typeorm";
import { User } from "../models/User.model";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import env from "../utils/validateEnv";
import logger from "../config/logger";
import mailSvc from "../utils/mail";

export class AuthController {
  register = async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const userRepository = getRepository(User);
      const existingUser = await userRepository.findOne({
        where: { email: data.email },
      });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = userRepository.create({
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      let result = await userRepository.save(user);

      logger.info(`User registered successfully: ${result.id}`);
      res.status(201).json({
        user: result,
        message: "User Registered Successfully",
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error registering user: ${message}`, error);
      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const data = req.body;

      const userRepository = getRepository(User);
      const user = await userRepository.findOne({
        where: { email: data.email },
      });
      if (!user) {
        throw new ErrorHandler("User not found", 404);
      }
      const isPasswordValid = await bcrypt.compare(
        data.password,
        user.password
      );
      if (!isPasswordValid) {
        throw new ErrorHandler("Invalid credentials", 401);
      }

      if (data.fcm_token) {
        user.fcmToken = data.fcm_token;
        await userRepository.save(user);
      }
      const accessToken = jwt.sign({ id: user.id }, env.JWT_SECRET, {
        expiresIn: 86400,
      });

      const refreshToken = jwt.sign({ id: user.id }, env.JWT_SECRET, {
        expiresIn: "30d",
      });

      logger.info(`User logged in successfully: ${user.id}`);
      res.status(200).json({
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: user,
        status: true,
        message: "Login successful",
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error logging in user: ${message}`, error);
      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  getUserById = async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id); // Get the user id from request params
      if (isNaN(userId)) {
        throw new Error("Invalid user ID");
      }

      const userRepository = getRepository(User);

      // Find the user by id
      const user = await userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new ErrorHandler("User not found", 404);
      }

      res.status(200).json({
        user: user,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error getting user by id: ${message}`, error);

      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  forgetPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      if (!email) {
        throw new ErrorHandler("Email is required", 400);
      }
      const userRepository = getRepository(User);
      let user = await userRepository.findOne({ where: { email } });
      if (!user) {
        throw new ErrorHandler("User not found", 404);
      }
      console.log(user);

      const token = jwt.sign({ id: user.id }, env.JWT_SECRET, {
        expiresIn: "1h",
      });
      const url = `${env.CLIENT_URL}/reset-password/${token}`;
      const body = `Click this link to reset your password: ${url}`;
      console.log(body);

      await mailSvc.sendMail(email, "Reset Your Password", body);
      res.status(200).json({
        message: "Password reset email sent successfully",
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error forgetting password: ${message}`, error);

      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const { token, password } = req.body;
      if (!token || !password) {
        throw new ErrorHandler("Token and password are required", 400);
      }
      let decoded: JwtPayload;
      if (typeof token === "string") {
        decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      } else {
        throw new ErrorHandler("Invalid token format", 400);
      }
      const userRepository = getRepository(User);
      let user = await userRepository.findOne({ where: { id: decoded.id } });
      if (!user) {
        throw new ErrorHandler("User not found", 404);
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      await userRepository.save(user);
      res.status(200).json({
        message: "Password reset successfully",
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error resetting password: ${message}`, error);

      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };
}
