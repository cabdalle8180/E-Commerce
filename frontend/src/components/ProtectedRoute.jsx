import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ children, adminOnly = false }) {
  const { userInfo } = useSelector((state) => state.user);
  const location = useLocation();
  const token =
    userInfo?.token || localStorage.getItem("userToken");

  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (adminOnly && userInfo?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
