import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 30000,
  timeoutErrorMessage: "Server Timed out...",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptors
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // if (error.response) {
    //   if (error.response.status === 401) {
    //     // redirect user to login Screen
    //     // refresh token
    //     // toast.warn("Please login first");
    //     // window.location.href = "/login";
    //   } else if (error.response.status === 403) {
    //     window.location.href = "/";
    //   } else if (error.response.status === 404) {
    //     window.location.href = "/error";
    //   } else {
    //     throw error.response;
    //   }
    // }

    console.error("Reject Interceptor", error);
  }
);

export default axiosInstance;
