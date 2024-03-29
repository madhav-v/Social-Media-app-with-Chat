import axiosInstance from "../config/axios.config";

class HttpService {
  headers = {};
  getHeader = (config) => {
    if (config.auth) {
      this.headers["Authorization"] = "Bearer " + localStorage.getItem("token");
    }
    if (config.file) {
      this.headers["Content-Type"] = "multipart/form-data";
    }
  };

  getRequest = async (url, config = { auth: false, file: false }) => {
    try {
      this.getHeader(config);
      let response = await axiosInstance.get(url, {
        headers: {
          ...this.headers,
        },
      });

      return response;
    } catch (exception) {
      throw exception;
    }
  };
  postRequest = async (
    url,
    data = {},
    config = { auth: false, file: false }
  ) => {
    try {
      this.getHeader(config);

      let response = await axiosInstance.post(url, data, {
        headers: {
          ...this.headers,
        },
      });
      return response;
    } catch (exception) {
      throw exception;
    }
  };
  putRequest = async (
    url,
    data = {},
    config = { auth: false, file: false }
  ) => {
    try {
      this.getHeader(config);

      let response = await axiosInstance.put(url, data, {
        headers: {
          ...this.headers,
        },
      });
      return response;
    } catch (exception) {
      throw exception;
    }
  };
  patchRequest = async (
    url,
    data = {},
    config = { auth: false, file: false }
  ) => {
    try {
      this.getHeader(config);

      let response = await axiosInstance.patch(url, data, {
        headers: { ...this.headers },
      });
      return response;
    } catch (exception) {
      throw exception;
    }
  };
  deleteRequest = async (url, config = {}) => {
    try {
      this.getHeader(config);

      let response = await axiosInstance.delete(url, {
        headers: {
          ...this.headers,
        },
      });
      return response;
    } catch (exception) {
      throw exception;
    }
  };
}

export default HttpService;
