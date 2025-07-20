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
      const res = await axiosSecure.get(
        `/member/dashboard?email=${user.email}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 text-[color:var(--color-base-content)]">
      <h1 className="text-3xl font-bold text-center mb-8">
        Welcome, <span className="text-primary">{user.displayName}</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full ">
        <div
          className="card bg-primary-content text-primary p-6 cursor-pointer hover:shadow-lg transition"
          onClick={() => navigate("/dashboard/makepayment")}
        >
          <FaMoneyCheckAlt className="text-3xl mb-2 mx-auto" />
          <h3 className="text-lg font-semibold text-center">Make a Payment</h3>
        </div>
        <div
          className="card bg-primary-content text-primary p-6 cursor-pointer hover:shadow-lg transition"
          onClick={() => navigate("/dashboard/payment-history")}
        >
          <FaClipboardList className="text-3xl mb-2 mx-auto" />
          <h3 className="text-lg font-semibold text-center">
            View Payment History
          </h3>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
