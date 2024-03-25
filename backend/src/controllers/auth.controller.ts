import { Request, Response } from "express";
import ErrorHandler from "../utils/errorhandler";
import { getRepository } from "typeorm";
import { User } from "../models/User.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../utils/validateEnv";
import logger from "../config/logger";

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
}
