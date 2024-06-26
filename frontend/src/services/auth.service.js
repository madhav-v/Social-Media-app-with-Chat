import axiosInstance from "./axios.config";

class AuthService {
  async login(credentials) {
    try {
      const response = await axiosInstance.post("/v1/auth/login", credentials);
      return response;
    } catch (error) {
      s;
    }
  }

  async register(data) {
    try {
      const response = await axiosInstance.post("/v1/auth/register", data, {});
      return response;
    } catch (exception) {
      throw exception;
    }
  }

  async getLoggedInUser() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not set..");
      }
      const userInfo = await axiosInstance.get("/v1/user/me", {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });
      return userInfo;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async forgetPassword(email) {
    try {
      const response = await axiosInstance.post(
        "/v1/auth/forgetPassword",
        email,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(data) {
    try {
      const response = await axiosInstance.post("/v1/auth/resetPassword", data);

      return response;
    } catch (error) {
      throw error;
    }
  }

  getUserById = async (id) => {
    try {
      const response = await axiosInstance.get(`/v1/auth/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response;
    } catch (err) {
      throw err;
    }
  };
}

const authSvc = new AuthService();
export default authSvc;
