import { useEffect, useState } from "react";
import io from "socket.io-client";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:3005"); // Replace with your server URL

    // Listen for "like" events from the server
    socket.on("like", (data) => {
      console.log("data", data);
      // Add the new notification to the notifications state
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        { type: "like", postId: data.postId, userId: data.userId },
      ]);
    });

    // Clean up the socket connection on unmount
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <div>
      Notification
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notification;
