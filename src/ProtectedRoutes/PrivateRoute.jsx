import React from "react";
import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";
import Loader from "../Shared/component/Loader/Loader";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loader while checking auth
  if (loading) {
    return <Loader />;
  }

  // If not logged in, redirect to /signin with state
  if (!user) {
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }

  // Otherwise, show the protected content
  return children;
};

export default PrivateRoute;
