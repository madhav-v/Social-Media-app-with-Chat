import HttpService from "./http.service";

class GroupChatService extends HttpService {
  getGroupChats = async () => {
    try {
      const response = await this.getRequest("/v1/chats/getGroup", {
        auth: true,
        file: false,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  getGroupById = async (id) => {
    try {
      const response = await this.getRequest(`/v1/chats/group/${id}`, {
        auth: true,
        file: false,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  
}

const groupSvc = new GroupChatService();

export default groupSvc;
