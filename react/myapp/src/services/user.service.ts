import HttpService from "./http.service";

class UserService extends HttpService {
  addBio = async (bio: string) => {
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

  addProfilePic = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("profilePic", file);
      const response = await this.postRequest(
        "/v1/user/addProfilePic",
        formData,
        {
          auth: true,
          file: true,
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  updateCoverPic = async (data: any) => {
    try {
      // const formData = new FormData();
      // formData.append("coverPic", file);
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
