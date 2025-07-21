import React from "react";
import { FaBuilding, FaUserShield, FaFileAlt } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";

const InfoCard = ({ icon: Icon, title, description, color }) => (
  <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition duration-300 border border-base-200">
    <div className="card-body items-center text-center">
      <div className={`bg-opacity-10 p-4 rounded-full mb-4 text-4xl ${color}`}>
        <Icon />
      </div>
      <h2 className="card-title text-lg font-semibold text-[color:var(--color-base-content)]">
        {title}
      </h2>
      <p className="text-sm opacity-80 text-[color:var(--color-base-content)]">
        {description}
      </p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-[80vh] px-4 py-10 text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-[color:var(--color-base-content)]">
        Welcome back,{" "}
        <span className="text-primary">{user?.displayName || "Admin"}</span>! 🎉
      </h1>
      <p className="text-base opacity-70 max-w-2xl mx-auto mb-10 text-[color:var(--color-base-content)]">
        You’re managing the building system like a pro. Use the menu to handle
        apartments, agreements, payments, and users efficiently.
      </p>

      <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
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

export default AdminDashboard;
