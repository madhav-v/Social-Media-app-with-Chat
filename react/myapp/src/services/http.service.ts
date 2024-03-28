import axiosInstance from "./axios.config";

class HttpService {
  headers: any = {};

  getHeader = (config: { auth: boolean; file: boolean }) => {
    if (config.auth) {
      this.headers["Authorization"] = "Bearer " + localStorage.getItem("token");
    }
    if (config.file) {
      this.headers["Content-Type"] = "multipart/form-data";
    }
  };

  getRequest = async (url: string, config = { auth: false, file: false }) => {
    try {
      this.getHeader(config);
      const response = await axiosInstance.get(url, {
        headers: {
          ...this.headers,
        },
      });
      return response;
    } catch (exception: any) {
      throw exception;
    }
  };

  postRequest = async (
    url: string,
    data: any = {},
    config = { auth: false, file: false }
  ) => {
    try {
      this.getHeader(config);
      const response = await axiosInstance.post(url, data, {
        headers: {
          ...this.headers,
        },
      });
      return response;
    } catch (exception: any) {
      throw exception;
    }
  };

  putRequest = async (
    url: string,
    data: any = {},
    config = { auth: false, file: false }
  ) => {
    try {
      this.getHeader(config);
      const response = await axiosInstance.put(url, data, {
        headers: {
          ...this.headers,
        },
      });
      return response;
    } catch (exception: any) {
      throw exception;
    }
  };

  patchRequest = async (
    url: string,
    data: any = {},
    config = { auth: false, file: false }
  ) => {
    try {
      this.getHeader(config);
      const response = await axiosInstance.patch(url, data, {
        headers: { ...this.headers },
      });
      return response;
    } catch (exception: any) {
      throw exception;
    }
  };

  deleteRequest = async (url: string, config: any = {}) => {
    try {
      this.getHeader(config);
      const response = await axiosInstance.delete(url, {
        headers: {
          ...this.headers,
        },
      });
      return response;
    } catch (exception: any) {
      throw exception;
    }
  };
}

export default HttpService;
