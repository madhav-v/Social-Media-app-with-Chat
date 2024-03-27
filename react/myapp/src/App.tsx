import { Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/Auth/Login";
import RegisterPage from "./pages/Auth/Register";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  );
}

export default App;
