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

  searchUsers = async (query) => {
    try {
      if (typeof query === "string") {
        query = query.charAt(0).toUpperCase() + query.slice(1); // Capitalize the first letter of the query
      }

      const response = await this.getRequest(`/v1/user/search?query=${query}`, {
        auth: true,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  };
}

const userSvc = new UserService();
export default userSvc;
