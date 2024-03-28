import { Request, Response } from "express";
import { getRepository } from "typeorm";
import ErrorHandler from "../utils/errorhandler";
import { Message } from "../models/Message.model";
import { CustomRequest } from "../middlewares/auth.middleware";
import logger from "../config/logger";
import { MulterFile } from "../types/multer.types";

export class MessageController {
  createMessage = async (req: CustomRequest, res: Response) => {
    try {
      const { chatId, content } = req.body;
      const messageRepo = getRepository(Message);

      const images = req.files
        ? (req.files as MulterFile[]).map((file) => file.path)
        : [];
      const newMessage = messageRepo.create({
        chat: chatId,
        sender: req.user.id,
        content,
        images,
      });

      await messageRepo.save(newMessage);

      res.status(201).json(newMessage);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error creating message: ${message}`, error);
      res.status(statusCode).json({ error: err.message });
    }
  };

  getMessages = async (req: CustomRequest, res: Response) => {
    try {
      const messageRepository = getRepository(Message);
      const messages = await messageRepository.find({
        where: { chat: { id: parseInt(req.params.chatId) } },
        relations: ["sender", "chat"],
      });
      res.json(messages);
    } catch (error: any) {
      const statusCode = error.statusCode || 400;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error fetching messages: ${message}`, error);
      res.status(statusCode).json({ error: err.message });
    }
  };
}
