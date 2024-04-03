import { Request, Response } from "express";
import ErrorHandler from "../utils/errorhandler";
import { Not, getRepository } from "typeorm";
import { Post } from "../models/Post.model";
import logger from "../config/logger";
import { User } from "../models/User.model";
import { Comment } from "../models/Comment.model";
import notificationCtrl from "./notification.controller";

interface CustomRequest extends Request {
  user?: any;
}

export class PostController {
  createPost = async (req: CustomRequest, res: Response) => {
    try {
      const { content } = req.body;
      const user = req.user.id;

      let media: string = "";

      if (req.files && Array.isArray(req.files)) {
        media = req.files
          .map((file: Express.Multer.File) => file.path)
          .join(",");
      }

      const postRepository = getRepository(Post);
      const post = postRepository.create({
        content,
        media,
        user,
      });

      const savedPost = await postRepository.save(post);
      return res.status(201).json(savedPost);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error creating post: ${message}`, error);
      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  getAllPosts = async (req: CustomRequest, res: Response) => {
    try {
      const postRepository = getRepository(Post);
      const userRepository = getRepository(User);
      const userId = req.user.id;

      const posts = await postRepository.find({
        where: { user: Not(userId) },
        relations: ["user", "likes", "comments", "comments.user"],
      });

      res.status(200).json({
        data: posts,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error getting all posts: ${message}`, error);
      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  getPostById = async (req: CustomRequest, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      const postRepository = getRepository(Post);
      const post = await postRepository
        .createQueryBuilder("post")
        .leftJoinAndSelect("post.user", "user")
        .where("post.id = :postId", { postId })
        .getOne();
      if (!post) {
        throw new ErrorHandler("Post not found", 404);
      }
      res.status(200).json(post);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error getting post by id: ${message}`, error);
      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  deletePost = async (req: CustomRequest, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      const postRepository = getRepository(Post);
      const post = await postRepository.findOne({ where: { id: postId } });
      if (!post) {
        throw new ErrorHandler("Post not found", 404);
      }
      await postRepository.remove(post);
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error deleting post: ${message}`, error);
      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  updatePost = async (req: CustomRequest, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      const { content } = req.body;

      let media: string = "";

      if (req.files && Array.isArray(req.files)) {
        media = req.files
          .map((file: Express.Multer.File) => file.path)
          .join(",");
      }

      const postRepository = getRepository(Post);
      const post = await postRepository.findOne({
        where: { id: postId },
      });
      if (!post) {
        throw new ErrorHandler("Post not found", 404);
      }
      post.content = content;
      post.media = media;
      const updatedPost = await postRepository.save(post);
      res.status(200).json(updatedPost);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error updating post: ${message}`, error);
      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  getMyPosts = async (req: CustomRequest, res: Response) => {
    try {
      const userId = parseInt(req.user.id);
      if (isNaN(userId)) {
        throw new Error("Invalid user ID");
      }
      const postRepository = getRepository(Post);

      const posts = await postRepository.find({
        where: { user: { id: userId } },
      });

      res.status(200).json({
        data: posts,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error getting all posts: ${message}`, error);

      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  getPostsByUser = async (req: CustomRequest, res: Response) => {
    try {
      const userId = parseInt(req.params.id); // Get the user id from request params
      if (isNaN(userId)) {
        throw new Error("Invalid user ID");
      }

      const postRepository = getRepository(Post);

      const posts = await postRepository.find({
        where: { user: { id: userId } },
        relations: ["user"],
      });

      res.status(200).json({
        data: posts,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error getting posts by user: ${message}`, error);

      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  likePost = async (req: CustomRequest, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      const userId = req.user.id;

      const postRepository = getRepository(Post);
      const post = await postRepository.findOne({
        where: { id: postId },
        relations: ["likes", "user"],
      });
      if (!post) {
        throw new ErrorHandler("Post not found", 404);
      }

      const userLiked = post.likes.some((user) => user.id === userId);

      if (userLiked) {
        throw new ErrorHandler("You have already liked this post", 400);
      }

      post.likes.push(req.user);
      let likedPost = await postRepository.save(post);

      await notificationCtrl.createNotification(
        post.user,
        req.user,
        post,
        "like"
      );

      res
        .status(200)
        .json({ message: "Post liked successfully", post: likedPost });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error liking post: ${message}`, error);
      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  commentPost = async (req: CustomRequest, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      const { content } = req.body;

      const postRepository = getRepository(Post);
      const post = await postRepository.findOne({
        where: { id: postId },
        relations: ["user"],
      });

      if (!post) {
        throw new ErrorHandler("Post not found", 404);
      }

      const commentRepository = getRepository(Comment);
      const comment = commentRepository.create({
        content,
        user: req.user,
        post,
      });

      await commentRepository.save(comment);

      await notificationCtrl.createNotification(
        post.user,
        req.user,
        post,
        "comment"
      );

      res.status(201).json(comment);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error commenting on post: ${message}`, error);
      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };
}
