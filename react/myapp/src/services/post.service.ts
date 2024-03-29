// import { GetAllPostsResponse } from "../types/post";
import HttpService from "./http.service";

class PostService extends HttpService {
  createPost = async (data: any) => {
    try {
      const response = await this.postRequest("v1/post/", data, {
        auth: true,
        file: true,
      });
      return response;
    } catch (exception: any) {
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
    } catch (exception: any) {
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
    } catch (exception: any) {
      throw exception;
    }
  };
}

const postSvc = new PostService();
export default postSvc;