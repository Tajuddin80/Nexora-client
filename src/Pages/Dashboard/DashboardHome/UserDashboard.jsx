import React from "react";
import { useNavigate } from "react-router";
import { FaHandshake } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome, {user?.displayName || "User"}</h1>
      <p className="text-lg mb-8 max-w-xl">
        Ready to become a member? Request an agreement to enjoy full access to building services and make rent payments.
      </p>
      <button
        onClick={() => navigate("/apartments")}
        className="btn btn-primary flex items-center gap-2"
      >
        <FaHandshake /> Request Agreement
      </button>
    </div>
  );
};

export default UserDashboard;
