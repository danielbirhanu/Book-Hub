import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader";

const PrivateRoute = () => {
  const { userInfo, authChecked } = useSelector((state) => state.auth);

  if (!authChecked) {
    return <Loader />;
  }

  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
