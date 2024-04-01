// import { GetAllPostsResponse } from "../types/post";
import HttpService from "./http.service";

class PostService extends HttpService {
  createPost = async (data) => {
    try {
      const response = await this.postRequest("v1/post/", data, {
        auth: true,
        file: true,
      });
      return response;
    } catch (exception) {
      throw exception;
    }
  };

  getAllPosts = async () => {
    try {
      const response = await this.getRequest("v1/post/", {
        auth: true,
        file: false,
      });
      return response;
    } catch (exception) {
      throw exception;
    }
  };

  getMyPosts = async () => {
    try {
      const response = await this.getRequest("v1/post/myposts", {
        auth: true,
        file: false,
      });
      return response;
    } catch (exception) {
      throw exception;
    }
  };

  getPostByUser = async (id) => {
    try {
      const response = await this.getRequest(`v1/post/user/${id}`, {
        auth: true,
        file: false,
      });
      return response;
    } catch (exception) {
      throw exception;
    }
  };

  getPostById = async (id) => {
    try {
      const response = await this.getRequest(`v1/post/${id}`, {
        auth: true,
        file: false,
      });
      return response;
    } catch (exception) {
      throw exception;
    }
  };

  deletePost = async (id) => {
    try {
      const response = await this.deleteRequest(`v1/post/${id}`, {
        auth: true,
        file: false,
      });
      return response;
    } catch (exception) {
      throw exception;
    }
  };

  updatePost = async (id, data) => {
    try {
      const response = await this.putRequest(`v1/post/${id}`, data, {
        auth: true,
        file: false,
      });
      return response;
    } catch (exception) {
      throw exception;
    }
  };

  likePost = async (id) => {
    try {
      const response = await this.postRequest(`v1/post/${id}/like`, {
        auth: true,
        file: false,
      });
      return response;
    } catch (exception) {
      throw exception;
    }
  };

  commentPost = async (id, data) => {
    try {
      const response = await this.postRequest(`v1/post/${id}/comment`, data, {
        auth: true,
        file: false,
      });
      return response;
    } catch (exception) {
      throw exception;
    }
  };
}

const postSvc = new PostService();
export default postSvc;
