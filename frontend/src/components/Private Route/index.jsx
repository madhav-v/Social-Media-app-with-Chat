import { Outlet, useNavigate } from "react-router-dom";

const PrivateRoute = () => {
  const navigate = useNavigate();
  const token = window.localStorage.getItem("token");
  if (!token) {
    navigate("/");
    return null;
  } else return <Outlet />;
};
export default PrivateRoute;
