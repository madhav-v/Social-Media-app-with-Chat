import { messaging } from "./components/firebase";

const requestPermissionAndRetrieveToken = async () => {
  try {
    // Request permission for notifications
    await messaging.requestPermission();

    // Retrieve the FCM token
    const token = await messaging.getToken();

    return token;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};

export default requestPermissionAndRetrieveToken;
