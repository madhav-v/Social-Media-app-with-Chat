import { Outlet } from "react-router-dom";
import Navbar from "../../../components/Navbar";

const InnerLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default InnerLayout;
