import { Request, Response } from "express";
import { getRepository } from "typeorm";
import ErrorHandler from "../utils/errorhandler";
import { Chat } from "../models/Chat.model";
import { User } from "../models/User.model";
import { CustomRequest } from "../middlewares/auth.middleware";
import logger from "../config/logger";

export class ChatController {
  accessChat = async (req: CustomRequest, res: Response) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        throw new ErrorHandler("UserId not send with request", 400);
      }

      const chatRepo = getRepository(Chat);
      const userRepo = getRepository(User);
      const currentUserID = req.user.id;
      const requestedUserID = userId;
      const existingChat = await chatRepo
        .createQueryBuilder("chat")
        .leftJoin("chat.users", "user")
        .where("chat.isGroupChat = :isGroupChat", { isGroupChat: false })
        .andWhere("user.id IN (:currentUserID, :requestedUserID)", {
          currentUserID: req.user.id,
          requestedUserID: userId,
        })
        .groupBy("chat.id")
        .having("COUNT(chat.id) = 2") // Ensure there are exactly two users in the chat
        .getOne();

      if (existingChat) {
        res.send(existingChat);
      } else {
        const users = await userRepo.findByIds([req.user.id, userId]);
        const newChat = chatRepo.create({
          chatName: "sender",
          users: users,
          isGroupChat: false,
        });

        await chatRepo.save(newChat);

        const fullChat = await chatRepo.findOne({
          where: { id: newChat.id },
          relations: ["users", "messages"],
        });
        console.log(fullChat);

        res.status(201).send(fullChat);
      }
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error accessing chat: ${message}`, error);
      res.status(statusCode).json({ error: err.message });
    }
  };

  fetchChats = async (req: CustomRequest, res: Response) => {
    try {
      const userId = req.user.id;
      const chatRepo = getRepository(Chat);

      const chats = await chatRepo.findOne({
        where: {
          users: req.user.id,
        },
        relations: ["users", "messages"],
        order: { id: "DESC" },
      });
      // const userChats = chats.filter((chat) =>
      //   chat.users.some((user) => user.id === userId)
      // );
      res.status(200).json({ data: chats });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error fetching chats: ${message}`, error);
      res.status(statusCode).json({ error: err.message });
    }
  };

  createGroupChat = async (req: CustomRequest, res: Response) => {
    try {
      const { users, name } = req.body;
      if (!users || !name) {
        throw new ErrorHandler("Please provide all fields", 400);
      }
      const chatRepo = getRepository(Chat);
      const userRepo = getRepository(User);

      const usersList = await userRepo.findByIds(users);

      if (usersList.length < 2) {
        throw new ErrorHandler("Please provide at least two users", 400);
      }

      usersList.push(req.user);

      const newChat = new Chat();
      newChat.chatName = name;
      newChat.users = usersList;
      newChat.isGroupChat = true;
      newChat.groupAdmin = req.user;

      const savedChat = await chatRepo.save(newChat);

      const fullGroupChat = await chatRepo.findOne({
        where: { id: savedChat.id },
        relations: ["users", "groupAdmin"],
      });

      res.status(201).send(fullGroupChat);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode); // Create an instance of ErrorHandler with one argument
      logger.error(`Error creating group chat: ${message}`, error);
      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  renameGroup = async (req: CustomRequest, res: Response) => {
    try {
      const { chatId, chatName } = req.body;
      const chatRepo = getRepository(Chat);
      const updatedChat = await chatRepo.findOne({
        where: { id: chatId },
      });

      if (!updatedChat) {
        throw new ErrorHandler("Chat not found", 404);
      }

      updatedChat.chatName = chatName;

      let newChat = await chatRepo.save(updatedChat);

      res.json(newChat);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error renaming group chat: ${message}`, error);
      res.status(statusCode).json({ error: err.message });
    }
  };

  removeFromGroup = async (req: CustomRequest, res: Response) => {
    try {
      const { chatId, userId } = req.body;
      const chatRepo = getRepository(Chat);
      const userRepo = getRepository(User);
      const updatedChat = await chatRepo.findOne({
        where: { id: chatId },
        relations: ["users"],
      });

      if (!updatedChat) {
        throw new ErrorHandler("Chat not found", 404);
      }
      const userIdNumber =
        typeof userId === "string" ? parseInt(userId, 10) : userId;

      updatedChat.users = updatedChat.users.filter(
        (user) => user.id !== userIdNumber
      );

      await chatRepo.save(updatedChat);
      res.json(updatedChat);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error removing user from group chat: ${message}`, error);
      res.status(statusCode).json({ error: err.message });
    }
  };

  addToGroup = async (req: CustomRequest, res: Response) => {
    try {
      const { chatId, userId } = req.body;
      const chatRepo = getRepository(Chat);
      const userRepo = getRepository(User);
      const updatedChat = await chatRepo.findOne({
        where: { id: chatId },
        relations: ["users"],
      });
      console.log(updatedChat);

      if (!updatedChat) {
        throw new ErrorHandler("Chat not found", 404);
      }
      const userToAdd = await userRepo.findOne({
        where: { id: userId },
      });
      if (!userToAdd) {
        throw new ErrorHandler("User not found", 404);
      }
      updatedChat.users.push(userToAdd);
      await chatRepo.save(updatedChat);
      res.json(updatedChat);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error adding user to group chat: ${message}`, error);
      res.status(statusCode).json({ error: err.message });
    }
  };

  getGroupChats = async (req: CustomRequest, res: Response) => {
    try {
      const chatRepo = getRepository(Chat);
      const userId = req.user.id;
      const groupChats = await chatRepo
        .createQueryBuilder("chat")
        .innerJoin("chat.users", "user", "user.id = :userId", { userId })
        .where("chat.isGroupChat = true")
        .leftJoinAndSelect("chat.users", "users")
        .leftJoinAndSelect("chat.groupAdmin", "groupAdmin")
        .getMany();
      res.json(groupChats);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error fetching group chats: ${message}`, error);
      res.status(statusCode).json({ error: err.message });
    }
  };

  getGroupChatById = async (req: CustomRequest, res: Response) => {
    try {
      const chatId = parseInt(req.params.id);
      const chatRepo = getRepository(Chat);
      const chat = await chatRepo.findOne({
        where: { id: chatId },
        relations: ["users", "messages", "groupAdmin"],
      });
      if (!chat) {
        throw new ErrorHandler("Chat not found", 404);
      }
      res.json(chat);
    } catch (exception: any) {
      const statusCode = exception.statusCode || 500;
      const message = exception.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error fetching group chat by id: ${message}`, exception);
      res.status(statusCode).json({ error: err.message });
    }
  };
}
