import { Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/Auth/Login";
import RegisterPage from "./pages/Auth/Register";
// import NavBar from "./components/Navbar";
import InnerLayout from "./pages/Home/Layout";
import DashBoard from "./pages/Home/Layout/dashboard";
import ErrorPage from "./pages/Error";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<InnerLayout />}>
          <Route index element={<DashBoard />} />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
}

export default App;
