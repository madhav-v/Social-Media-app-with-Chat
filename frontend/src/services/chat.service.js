import HttpService from "./http.service";

class ChatService extends HttpService {
  accessChat = async (data) => {
    try {
      const response = await this.postRequest("/v1/chats/access", data, {
        auth: true, // Requires authentication
        file: false, // Does not support file upload
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  fetchChats = async () => {
    try {
      const response = await this.getRequest("/v1/chats/fetch", {
        auth: true,
        file: false,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  createGroupChat = async (data) => {
    try {
      const response = await this.postRequest("/v1/chats/createGroup", data, {
        auth: true,
        file: false,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  renameGroup = async (data) => {
    try {
      const response = await this.putRequest("/v1/chats/rename", data, {
        auth: true,
        file: false,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  removeFromGroup = async (data) => {
    try {
      const response = await this.putRequest(
        "/v1/chats/removeFromGroup",
        data,
        {
          auth: true,
          file: false,
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  addToGroup = async (data) => {
    try {
      const response = await this.putRequest("/v1/chats/addToGroup", data, {
        auth: true,
        file: false,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };
}

const chatService = new ChatService();

export default chatService;
