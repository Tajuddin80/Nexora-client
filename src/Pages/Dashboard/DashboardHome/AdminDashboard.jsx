import React from "react";
import { FaBuilding, FaUserShield, FaFileAlt } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";

const InfoCard = ({ icon: Icon, title, description, color }) => (
  <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition duration-300 border border-base-200">
    <div className="card-body items-center text-center">
      <div className={`bg-opacity-10 p-4 rounded-full mb-4 text-4xl ${color}`}>
        <Icon />
      </div>
      <h2 className="card-title text-lg font-semibold">{title}</h2>
      <p className="text-base-content text-sm opacity-80">{description}</p>
    </div>
  </div>
);
const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-[80vh] flex flex-col items-center text-center px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">
        Welcome back, <span className="text-primary">{user?.displayName || "Admin"}</span>! 🎉
      </h1>
      <p className="text-base-content text-opacity-70 max-w-2xl mb-10 text-sm md:text-base">
        You’re managing the building system like a pro. Use the menu to handle apartments, agreements, payments, and users efficiently.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        <InfoCard
          icon={FaBuilding}
          title="Manage Apartments"
          description="View, filter, and maintain apartment listings across the property."
          color="text-primary"
        />
        <InfoCard
          icon={FaFileAlt}
          title="Agreements & Payments"
          description="Track and process rent payments and user agreements."
          color="text-success"
        />
        <InfoCard
          icon={FaUserShield}
          title="Admin Controls"
          description="Approve requests, assign roles, and manage the entire system."
          color="text-warning"
        />
      </div>
    </div>
  );
};
export default AdminDashboard