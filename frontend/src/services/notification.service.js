import HttpService from "./http.service";

class NotificationService extends HttpService {
  getNotifications = async () => {
    try {
      const response = await this.getRequest("/v1/notification/", {
        auth: true,
        file: false,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  getNotificationsAfterTime = async (timestamp) => {
    try {
      const response = await this.getRequest(
        `/v1/notification/after-time?timestamp=${timestamp}`,
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
}

const notificationSvc = new NotificationService();

export default notificationSvc;
