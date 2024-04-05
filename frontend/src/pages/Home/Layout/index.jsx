import { Outlet } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import { useEffect, useState } from "react";
import notificationSvc from "../../../services/notification.service";
import { Toaster } from "react-hot-toast";
import ToastAlert from "../../../components/Toast";

const InnerLayout = () => {
  // const [notific, setNotific] = useState([]);

  // const getNotifications = async () => {
  //   const response = await notificationSvc.getNotifications();
  //   console.log("notific", response);
  //   setNotific(response);

  //   response.forEach((notification) => {
  //     ToastAlert(
  //       "success",
  //       `New ${notification.actionType} from ${notification.userPerformedAction.firstName}`
  //     );
  //   });
  // };

  // useEffect(() => {
  //   getNotifications();
  // }, []);

  return (
    <>
      <Navbar />
      <Outlet />
      <Toaster />
    </>
  );
};

export default InnerLayout;
