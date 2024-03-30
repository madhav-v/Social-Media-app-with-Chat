import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
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

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<InnerLayout />}>
          <Route index element={<DashBoard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="editProfile" element={<EditProfile />} />
          <Route path="friendRequest" element={<Connection />} />
          <Route path="friends" element={<Friends />} />
          <Route path="friends/:id" element={<FriendProfile />} />
          <Route path="chat" element={<ChatLayout />}>
            <Route index element={<Chat />} />
            <Route path=":id" element={<ChatPanel />} />
          </Route>
        </Route>

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
}

export default App;
