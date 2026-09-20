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
import {
  FaBuilding,
  FaCheckCircle,
  FaTimesCircle,
  FaUsers,
  FaUserShield,
} from "react-icons/fa";
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
    return <p className="p-4 text-red-500 font-bold">Error loading stats: {error.message}</p>;

  const totalRooms = stats?.totalRooms || 0;
  const availablePercentage = stats?.availablePercentage || 0;
  const unavailablePercentage = stats?.unavailablePercentage || 0;
  const totalUsers = stats?.totalUsers || 0;
  const membersCount = stats?.membersCount || 0;

  const roomData = [
    { name: "Available", value: availablePercentage },
    { name: "Occupied/Leased", value: unavailablePercentage },
  ];
  const COLORS = ["#10b981", "#f43f5e"];

  return (
    <div className="p-6 md:p-10 bg-base-100 text-base-content border border-base-content/25 shadow-xs space-y-8 w-full">
      {/* Admin Info Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-base-content/15">
        <div className="flex items-center gap-5">
          <img
            src={user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
            }}
            alt="Admin"
            className="w-20 h-20 object-cover border-2 border-base-content shadow-xs shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-base-content text-base-100">
                ADMIN PORTAL
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-base-content uppercase tracking-wide mt-1">
              {user?.displayName || "System Administrator"}
            </h1>
            <p className="text-xs md:text-sm text-base-content/75 font-bold font-mono">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
        <div className="p-5 bg-base-100 border border-base-content/20 shadow-xs hover:border-base-content/60 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/70">
              Total Rooms
            </span>
            <div className="w-8 h-8 bg-base-content/10 text-base-content border border-base-content/20 flex items-center justify-center text-sm">
              <FaBuilding />
            </div>
          </div>
          <h3 className="text-3xl font-black text-base-content">
            {totalRooms}
          </h3>
        </div>

        <div className="p-5 bg-base-100 border border-base-content/20 shadow-xs hover:border-base-content/60 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/70">
              Available
            </span>
            <div className="w-8 h-8 bg-base-content/10 text-base-content border border-base-content/20 flex items-center justify-center text-sm">
              <FaCheckCircle className="text-emerald-500" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-base-content">
            {availablePercentage.toFixed(1)}%
          </h3>
        </div>

        <div className="p-5 bg-base-100 border border-base-content/20 shadow-xs hover:border-base-content/60 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/70">
              Occupied
            </span>
            <div className="w-8 h-8 bg-base-content/10 text-base-content border border-base-content/20 flex items-center justify-center text-sm">
              <FaTimesCircle className="text-rose-500" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-base-content">
            {unavailablePercentage.toFixed(1)}%
          </h3>
        </div>

        <div className="p-5 bg-base-100 border border-base-content/20 shadow-xs hover:border-base-content/60 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/70">
              Total Users
            </span>
            <div className="w-8 h-8 bg-base-content/10 text-base-content border border-base-content/20 flex items-center justify-center text-sm">
              <FaUsers />
            </div>
          </div>
          <h3 className="text-3xl font-black text-base-content">
            {totalUsers}
          </h3>
        </div>

        <div className="p-5 bg-base-100 border border-base-content/20 shadow-xs hover:border-base-content/60 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/70">
              Active Members
            </span>
            <div className="w-8 h-8 bg-base-content/10 text-base-content border border-base-content/20 flex items-center justify-center text-sm">
              <FaUserShield />
            </div>
          </div>
          <h3 className="text-3xl font-black text-base-content">
            {membersCount}
          </h3>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-base-100 border border-base-content/20 p-6 shadow-xs">
        <h3 className="text-xl font-black text-base-content uppercase tracking-wide mb-4">
          Room Occupancy Ratio
        </h3>
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
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
