importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyD6FGV9nxVTFLi588QkycjZ8GqKi2GKxLU",
  authDomain: "push-e8e67.firebaseapp.com",
  projectId: "push-e8e67",
  storageBucket: "push-e8e67.appspot.com",
  messagingSenderId: "964531625477",
  appId: "1:964531625477:web:63108d5b235517de45466c",
  measurementId: "G-98G98SJBTJ",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message payload: ",
    payload
  );

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
