import "./App.css";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Auth/login";
import RegisterPage from "./pages/Auth/register";
import ErrorPage from "./pages/Error";
import InnerLayout from "./pages/Home/Layout";
import DashBoard from "./pages/Home/Layout/dashboard";
import Profile from "./pages/Profile";
import EditProfile from "./pages/Profile/edit";
import Connection from "./pages/FriendRequest";
import ChatLayout from "./pages/Chat/layout";
import Chat from "./pages/Chat";
import ChatPanel from "./pages/Chat/chatPanel";
import Friends from "./pages/Friends";
import FriendProfile from "./pages/Friends/friendProfile";
import ResetPassword from "./pages/ForgetPassword/forgetPassword";
import SetPassword from "./pages/ForgetPassword/setPassword";
import GroupChat from "./pages/Chat/groupchat";
import GroupLayout from "./pages/Chat/groupchat.layout";
import GroupPanel from "./pages/Chat/groupchatPanel";
import Notification from "./pages/Notification";
import { useEffect } from "react";
import { requestPermission, messaging } from "./components/firebase";
import { onMessage } from "firebase/messaging";
import ToastAlert from "./components/Toast";
function App() {
  useEffect(() => {
    requestPermission();
    onMessage(messaging, (payload) => {
      console.log(payload);
      ToastAlert(
        "success",
        payload.notification.title,
        payload.notification.body
      );
    });
  }, []);
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgetPassword" element={<ResetPassword />} />
        <Route path="reset-password/:token" element={<SetPassword />} />
        <Route path="/home" element={<InnerLayout />}>
          <Route index element={<DashBoard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="editProfile" element={<EditProfile />} />
          <Route path="friendRequest" element={<Connection />} />
          <Route path="friends" element={<Friends />} />
          <Route path="friends/:id" element={<FriendProfile />} />
          <Route path="notification" element={<Notification />} />
          <Route path="chat" element={<ChatLayout />}>
            <Route index element={<Chat />} />
            <Route path=":id" element={<ChatPanel />} />
          </Route>
          <Route path="groupchat" element={<GroupLayout />}>
            <Route index element={<GroupChat />} />
            <Route path=":id" element={<GroupPanel />} />
          </Route>
        </Route>

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
}

export default App;
