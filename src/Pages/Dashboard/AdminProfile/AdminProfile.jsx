import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loader from "../../../Shared/component/Loader/Loader";

const AdminProfile = () => {
  const { user } = useAuth(); 
  const axiosSecure = useAxiosSecure();

  const {
    data: stats,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/stats");
      return res.data;
    },
  });

  if (isLoading) return <Loader />;
  if (isError)
    return <p className="p-4 text-red-500">Error: {error.message}</p>;

  const roomData = [
    { name: "Available", value: stats.availablePercentage },
    { name: "Unavailable/Agreement", value: stats.unavailablePercentage },
  ];
  const COLORS = ["#34d399", "#f87171"];

  return (
    <div className="p-6 md:p-10 bg-base-100 rounded-2xl shadow-xl space-y-8">
      {/* Admin Info */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.photoURL || "https://via.placeholder.com/100"}
            alt="Admin"
            className="w-24 h-24 rounded-full border-4 border-primary shadow-md object-cover"
          />
          <div>
            {/*  use theme-aware text */}
            <h2 className="text-3xl font-bold text-base-content">
              {user?.displayName || "Admin"}
            </h2>
            <p className="text-lg text-base-content/70">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-4 bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--color-base-100)_90%)] rounded-xl shadow-md border-t-4 border-primary">
          <p className="text-base-content/70">Total Rooms</p>
          <h3 className="text-3xl font-bold text-base-content">
            {stats.totalRooms}
          </h3>
        </div>
        <div className="p-4 bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--color-base-100)_90%)] rounded-xl shadow-md border-t-4 border-green-400">
          <p className="text-base-content/70">% Available</p>
          <h3 className="text-3xl font-bold text-base-content">
            {stats.availablePercentage.toFixed(1)}%
          </h3>
        </div>
        <div className="p-4 bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--color-base-100)_90%)] rounded-xl shadow-md border-t-4 border-red-400">
          <p className="text-base-content/70">% Unavailable</p>
          <h3 className="text-3xl font-bold text-base-content">
            {stats.unavailablePercentage.toFixed(1)}%
          </h3>
        </div>
        <div className="p-4 bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--color-base-100)_90%)] rounded-xl shadow-md border-t-4 border-blue-400">
          <p className="text-base-content/70">Total Users</p>
          <h3 className="text-3xl font-bold text-base-content">
            {stats.totalUsers}
          </h3>
        </div>
        <div className="p-4 bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--color-base-100)_90%)] rounded-xl shadow-md border-t-4 border-purple-400">
          <p className="text-base-content/70">Total Members</p>
          <h3 className="text-3xl font-bold text-base-content">
            {stats.membersCount}
          </h3>
        </div>
      </div>

      {/* Chart */}
      <div className="  bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--color-base-100)_90%)]   p-6 rounded-xl shadow-md">
        <h3 className="text-3xl font-bold text-base-content">
          Room Availability
        </h3>
        <div className="w-full h-72">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={roomData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {roomData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
