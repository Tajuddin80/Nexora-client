import React from "react";
import { useQuery } from "@tanstack/react-query";

import { FaMoneyCheckAlt, FaClipboardList } from "react-icons/fa";
import { useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loader from "../../../Shared/component/Loader/Loader";

const MemberDashboard = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const { data = {}, isLoading } = useQuery({
    queryKey: ["memberDashboard"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/member/dashboard?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) return <Loader />;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Welcome back, {user.displayName}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-200 shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Current Month Rent</h2>
          <p className="text-4xl text-success font-bold">
            ৳ {data.currentMonthRent || 0}
          </p>
        </div>
        <div className="card bg-base-200 shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Coupons Used</h2>
          <p className="text-2xl">{data.totalCouponsUsed || 0}</p>
        </div>
        <div
          className="card bg-primary text-white p-6 cursor-pointer hover:shadow-lg"
          onClick={() => navigate("/dashboard/makepayment")}
        >
          <FaMoneyCheckAlt className="text-3xl mb-2" />
          <h3 className="text-lg font-semibold">Make a Payment</h3>
        </div>
        <div
          className="card bg-secondary text-white p-6 cursor-pointer hover:shadow-lg"
          onClick={() => navigate("/dashboard/payment-history")}
        >
          <FaClipboardList className="text-3xl mb-2" />
          <h3 className="text-lg font-semibold">View Payment History</h3>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
