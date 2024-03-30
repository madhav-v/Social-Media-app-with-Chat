import HttpService from "./http.service";

class FriendRequestService extends HttpService {
  sendFriendRequest = async (data) => {
    try {
      const response = await this.postRequest("v1/friendReq/send", data, {
        auth: true, // Requires authentication
        file: false, // Does not support file upload
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  acceptFriendRequest = async (id) => {
    try {
      const response = await this.putRequest("v1/friendReq/accept", id, {
        auth: true,
        file: false,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  deleteFriendRequest = async (id) => {
    try {
      const response = await this.deleteRequest(`v1/friendReq/delete`, id, {
        auth: true,
        file: false,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  getFriends = async () => {
    try {
      const response = await this.getRequest("v1/friendReq/friends", {
        auth: true,
        file: false,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  getFriendRequest = async () => {
    try {
      const response = await this.getRequest("v1/friendReq/get", {
        auth: true,
        file: false,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };
}

const friendRequestService = new FriendRequestService();

export default friendRequestService;
