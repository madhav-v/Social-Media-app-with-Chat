import { useEffect, useState } from "react";
import notificationSvc from "../../services/notification.service";
import { Link } from "react-router-dom";
// import {
//   onMessageListener,
//   requestPermission,
// } from "../../components/firebase";
const Notification = () => {
  const [notifications, setNotifications] = useState();

  const getNotifications = async () => {
    try {
      const response = await notificationSvc.getNotifications();
      setNotifications(response);
    } catch (exception) {
      console.log(exception);
    }
  };
  useEffect(() => {
    getNotifications();
  }, [notifications]);

  // useEffect(() => {
  //   // Request permission for notifications
  //   requestPermission();

  //   // Listen for incoming messages
  //   const unsubscribe = onMessageListener((payload) => {
  //     console.log("Payload", payload);
  //     setNotifications({
  //       title: payload?.notification?.title,
  //       body: payload?.notification?.body,
  //     });
  //   });

  //   // Unsubscribe from the listener when component unmounts
  //   return () => {
  //     if (typeof unsubscribe === "function") {
  //       unsubscribe();
  //     }
  //   };
  // }, []);

  return (
    <>
      <div className="w-full min-h-screen bg-screen pt-[10vh] mt-2">
        <div className="flex w-[80%] mx-auto flex-col my-3 rounded-xl">
          <div className="px-2 border-b-2 border-[rgba(0, 0, 0, 0.6)] flex justify-between py-1">
            <h2 className="text-lg font-bold text-[rgba(0, 0, 0, 0.6)] xl:text-xl mx-2 ">
              Notifications
            </h2>
          </div>
          <div className="w-full">
            {notifications &&
              notifications.map((notification, index) => (
                <li key={index} className="bg-white shadow-md p-4 rounded-md">
                  <div className="flex items-center space-x-4">
                    <img
                      src={`${import.meta.env.VITE_IMAGE_URL}/${
                        notification.userPerformedAction.profilePic
                      }`}
                      alt="Profile"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <Link
                        to={`/home/friends/${notification.userPerformedAction.id}`}
                      >
                        <p className="font-bold">
                          {notification.userPerformedAction.firstName}{" "}
                          {notification.userPerformedAction.lastName}
                        </p>
                      </Link>
                      <p>
                        {notification.actionType}d on your post{" "}
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p>{notification.post.content}</p>
                  </div>
                </li>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Notification;
