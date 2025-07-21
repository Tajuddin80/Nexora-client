import React from "react";
import { useNavigate } from "react-router";
import { FaHandshake } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 text-[color:var(--color-base-content)]">
      <h1 className="text-4xl font-bold mb-4">
        Welcome,{" "}
        <span className="text-primary">{user?.displayName || "User"}</span>
      </h1>
      <p className="text-base md:text-lg opacity-80 max-w-xl mb-6">
        Ready to become a member? Request an agreement to enjoy full access to
        building services and make rent payments.
      </p>
      <button
        onClick={() => navigate("/apartments")}
        className="btn btn-primary gap-2"
      >
        <FaHandshake /> Request Agreement
      </button>
    </div>
  );
};

export default UserDashboard;
