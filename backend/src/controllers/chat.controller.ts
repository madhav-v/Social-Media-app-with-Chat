import { Request, Response } from "express";
import { getRepository } from "typeorm";
import ErrorHandler from "../utils/errorhandler";
import { Chat } from "../models/Chat.model";
import { User } from "../models/User.model";
import { CustomRequest } from "../middlewares/auth.middleware";

export class ChatController {
  accessChat = async (req: CustomRequest, res: Response) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        throw new ErrorHandler("UserId not send with request", 400);
      }

      const chatRepo = getRepository(Chat);
      const userRepo = getRepository(User);

      const existingChat = await chatRepo
        .createQueryBuilder("chat")
        .leftJoinAndSelect("chat.users", "users")
        .leftJoinAndSelect("chat.latestMessage", "latestMessage")
        .where("chat.isGroupChat = :isGroupChat", { isGroupChat: false })
        .andWhere("users.id IN (:...ids)", { ids: [req.user.id, userId] })
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
          relations: ["users", "latestMessage"],
        });

        res.status(201).send(fullChat);
      }
    } catch (error: any) {}
  };

  fetchChats = async (req: CustomRequest, res: Response) => {
    try {
      const chatRepo = getRepository(Chat);

      const chats = await chatRepo
        .createQueryBuilder("chat")
        .leftJoinAndSelect("chat.users", "users")
        .leftJoinAndSelect("chat.groupAdmin", "groupAdmin")
        .leftJoinAndSelect("chat.latestMessage", "latestMessage")
        .where("users.id = :userId", { userId: req.user.id })
        .orderBy("chat.updatedAt", "DESC")
        .getMany();

      res.json(200).json(chats);
    } catch (error: any) {}
  };
}
