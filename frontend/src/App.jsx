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

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<InnerLayout />}>
          <Route index element={<DashBoard />} />
          {/* <Route path="profile" element={<Profile />} />
          <Route path="chat" element={<ChatLayout />}>
            <Route index element={<Chat />} />
            <Route path=":id" element={<ChatPanel />} />
          </Route> */}
        </Route>

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
}

export default App;
