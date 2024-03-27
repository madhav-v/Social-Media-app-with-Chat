import axiosInstance from "./axios.config";

class AuthService {
  async login(credentials: any) {
    try {
      const response = await axiosInstance.post("/v1/auth/login", credentials);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async register(data: any) {
    try {
      const response = await axiosInstance.post("/v1/auth/register", data, {});
      return response;
    } catch (exception) {
      throw exception;
    }
  }

  async getUserByToken(token: string) {
    try {
      const response = await axiosInstance.post(
        "/v1/auth/activate/" + token,
        {},
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response;
    } catch (exception) {
      console.log("Exception:", exception);
      throw exception;
    }
  }

  async getLoggedInUser() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not set..");
      }
      const userInfo = await axiosInstance.get("/v1/auth/me", {
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

  async getUserWithProfile() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not set..");
      }
      const userInfo = await axiosInstance.get("/v1/auth/me/profile", {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });
      return userInfo;
    } catch (error) {
      throw error;
    }
  }

  async forgetPassword(email: string) {
    try {
      const response = await axiosInstance.post(
        "/v1/auth/forget-password",
        { email: email },
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

  async resetPassword(userEmail: string, password: string) {
    try {
      const response = await axiosInstance.post(
        "/v1/auth/password-reset",
        { email: userEmail, password },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status) {
        return response.data;
      } else {
        throw new Error(response.data.msg);
      }
    } catch (error) {
      throw error;
    }
  }

  async getUserProfileById(userId: string) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not set..");
      }
      const response = await axiosInstance.get(`/v1/auth/user/${userId}`, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const authSvc = new AuthService();
export default authSvc;
