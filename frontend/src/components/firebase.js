import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";


const firebaseConfig = {
  apiKey: "AIzaSyD6FGV9nxVTFLi588QkycjZ8GqKi2GKxLU",
  authDomain: "push-e8e67.firebaseapp.com",
  projectId: "push-e8e67",
  storageBucket: "push-e8e67.appspot.com",
  messagingSenderId: "964531625477",
  appId: "1:964531625477:web:63108d5b235517de45466c",
  measurementId: "G-98G98SJBTJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);

export const requestPermission = async () => {
  console.log("Requesting User Permission");
  const permission = await Notification.requestPermission();
  console.log(permission);

  if (permission == "granted") {
    const token = await getToken(messaging, {
      vapidKey:
        "BLANwcsFnLYlZk_6Fs8nramtJ97SZgaXIAbSC0Jw26n7yKvwQzFH1n2Bc724m61vRJAtcfUriRFDpIgBrYGZPJ4",
    });
    console.log(token);
  }
};

requestPermission();

export const onMessageListener = () => {
  return new Promise((resolve, reject) => {
    onMessage(
      messaging,
      (payload) => {
        console.log("Message received. ", payload);
        resolve(payload);
      },
      reject
    );
  });
};
getToken(messaging, {
  vapidKey:
    "BMhV9t0zZGlsuSq11bpFc1ZVDYA8borJpJX9xaQ-EBg1bebjyqeYC9xC2NV8kjtH6YIwM8zQPMMUcZ67ufaHIJU",
});

export const requestPermissionAndRetrieveToken = async () => {
  try {
    // Request permission for notifications
    const permission = await Notification.requestPermission();
    console.log(permission);

    if (permission === "granted") {
      // Retrieve the FCM token
      const token = await getToken(messaging);
      console.log(token);
      return token;
    }
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};

export const sendNotification = async (token, title, body) => {
  const message = {
    token: token,
    notification: {
      title: title,
      body: body,
    },
  };

  console.log("message", message);

  try {
    // Send the message
    await messaging.send(message);
    console.log("Notification sent successfully");
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};
