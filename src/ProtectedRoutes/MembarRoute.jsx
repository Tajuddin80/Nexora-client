import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";
import Loader from "../Shared/component/Loader/Loader";

const MembarRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();

  if (loading || roleLoading) {
    return <Loader />;
  }

  if (!user || role !== "member") {
    return <Navigate to={"/forbidden"}></Navigate>;
  }

  return children;
};

export default MembarRoute;
