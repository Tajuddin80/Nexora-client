import React from "react";
import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";
import Loader from "../Shared/component/Loader/Loader";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  // console.log(location);

  if (loading) {
    return <Loader></Loader>;
  }

  if (!user) {
    return (
      <Navigate state={{ from: location.pathname }} to="/signin">
        {" "}
      </Navigate>
    );
  }

  return children;
};

export default PrivateRoute;