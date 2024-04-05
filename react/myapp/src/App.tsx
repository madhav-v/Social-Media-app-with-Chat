import { Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/Auth/Login";
import RegisterPage from "./pages/Auth/Register";
// import NavBar from "./components/Navbar";
import InnerLayout from "./pages/Home/Layout";
import DashBoard from "./pages/Home/Layout/dashboard";
import ErrorPage from "./pages/Error";
import Profile from "./pages/Profile";
import ChatLayout from "./pages/Chat/Layout";
import Chat from "./pages/Chat";
import ChatPanel from "./pages/Chat/chatPanel";
// import EditProfile from "./pages/Profile/edit";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/home" element={<InnerLayout />}>
          <Route index element={<DashBoard />} />
          <Route path="profile" element={<Profile />} />
          {/* <Route path="editProfile" element={<EditProfile />} /> */}
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
