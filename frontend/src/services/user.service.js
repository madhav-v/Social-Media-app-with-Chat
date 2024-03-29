import HttpService from "./http.service";

class UserService extends HttpService {
  addBio = async (bio) => {
    try {
      const response = await this.postRequest(
        "/v1/user/bio",
        { bio: bio },
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

  addProfilePic = async (data) => {
    try {
      const response = await this.postRequest("/v1/user/addProfilePic", data, {
        auth: true,
        file: true,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  updateCoverPic = async (data) => {
    try {
      const response = await this.postRequest("/v1/user/addCoverPic", data, {
        auth: true,
        file: true,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };
}

const userSvc = new UserService();
export default userSvc;
