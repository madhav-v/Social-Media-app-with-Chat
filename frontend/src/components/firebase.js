import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyB-a5cni6lLdOtuOtq03WovHU1z8r1v-RQ",
  authDomain: "fir-cloud-92a40.firebaseapp.com",
  projectId: "fir-cloud-92a40",
  storageBucket: "fir-cloud-92a40.appspot.com",
  messagingSenderId: "1034750118814",
  appId: "1:1034750118814:web:d8132aaa1badc77467e48f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);

export const requestPermission = () => {
  console.log("Requesting User Permission");
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
      return getToken(messaging, {
        vapidKey:
          "BMhV9t0zZGlsuSq11bpFc1ZVDYA8borJpJX9xaQ-EBg1bebjyqeYC9xC2NV8kjtH6YIwM8zQPMMUcZ67ufaHIJU",
      })
        .then((currentToken) => {
          if (currentToken) {
            console.log("Token: ", currentToken);
          } else {
            console.log(
              "No registration token available. Request permission to generate one."
            );
          }
        })
        .catch((err) => {
          console.log("An error occurred while retrieving token. ", err);
        });
    } else {
      console.log("Unable to get permission to notify.");
    }
  });
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
