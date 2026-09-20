import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import useUserRole from "../../../hooks/useUserRole";
import Loader from "../../../Shared/component/Loader/Loader";
import {
  FaBuilding,
  FaFileContract,
  FaCalendarAlt,
  FaDollarSign,
  FaCheckCircle,
  FaClock,
  FaShieldAlt,
  FaExclamationTriangle,
  FaLock,
  FaCreditCard,
} from "react-icons/fa";

const MyProfile = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { role } = useUserRole();
  const navigate = useNavigate();

  // Fetch all agreements for current user
  const { data: userAgreements = [], isLoading: isAgreementsLoading } = useQuery({
    queryKey: ["user-agreements", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/agreements/user/${user.email}`);
      return res.data || [];
    },
    enabled: !!user?.email,
  });

  // Fetch rent payment history / unpaid bills for current user
  const { data: rentPayments = [], isLoading: isPaymentsLoading } = useQuery({
    queryKey: ["user-rent-payments", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/rent-payments/${user.email}`);
      return res.data || [];
    },
    enabled: !!user?.email,
  });

  if (!user) {
    return <div className="p-8 text-center text-base-content font-bold">Please log in to view your profile.</div>;
  }
  if (isAgreementsLoading || isPaymentsLoading) {
    return <Loader />;
  }

  // Active lease or pending agreement
  const activeAgreement = userAgreements.find(
    (a) => a.status === "accepted" || a.status === "pending"
  );

  const isMember = role === "member" || activeAgreement?.status === "accepted";

  const unpaidBills = rentPayments.filter((p) => p.status === "unpaid");
  const totalUnpaidBalance = unpaidBills.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="p-6 md:p-10 bg-base-100 text-base-content border border-base-content/25 shadow-xs space-y-8 w-full">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-base-content/15">
        <div className="flex items-center gap-5">
          <img
            src={user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
            }}
            alt={user?.displayName || "User Avatar"}
            className="w-20 h-20 object-cover border-2 border-base-content shadow-xs shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 bg-base-content text-base-100">
                {isMember ? "MEMBER PROFILE" : "USER PROFILE"}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 bg-base-content/10 text-base-content border border-base-content/20 flex items-center gap-1">
                <FaLock className="text-xs text-base-content" /> 1 Unit Limit Compliant
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-base-content uppercase tracking-wide">
              {user?.displayName || "Resident Account"}
            </h1>
            <p className="text-xs md:text-sm text-base-content/75 font-bold font-mono">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Applied / Leased Apartment Details Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaBuilding className="text-xl text-base-content" />
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide text-base-content">
              My Leased Apartment Details
            </h2>
          </div>
          {activeAgreement && (
            <span
              className={`text-xs font-black uppercase tracking-widest px-3 py-1 border ${
                activeAgreement.status === "accepted"
                  ? "bg-base-content text-base-100 border-base-content"
                  : "bg-base-content/10 text-base-content border-base-content/30"
              }`}
            >
              {activeAgreement.status === "accepted" ? "Lease Accepted & Active" : "Agreement Under Review"}
            </span>
          )}
        </div>

        {!activeAgreement ? (
          <div className="p-8 border border-dashed border-base-content/30 text-center space-y-3 bg-base-content/5">
            <FaFileContract className="mx-auto text-4xl text-base-content/40" />
            <h3 className="text-lg font-extrabold uppercase tracking-wide text-base-content">
              No Active Apartment Lease
            </h3>
            <p className="text-sm text-base-content/75 font-medium w-full">
              You do not currently occupy an apartment. Browse available units on the listings page to submit your digital agreement.
            </p>
          </div>
        ) : (
          <div className="p-6 bg-base-100 border border-base-content/25 shadow-xs space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-base-100 border border-base-content/20 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-base-content/70 block mb-1">
                  Apartment No
                </span>
                <p className="text-xl font-black text-base-content">
                  Apt {activeAgreement.apartmentNo}
                </p>
              </div>

              <div className="p-4 bg-base-100 border border-base-content/20 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-base-content/70 block mb-1">
                  Block Name
                </span>
                <p className="text-xl font-black text-base-content">
                  {activeAgreement.blockName || activeAgreement.block || "Block A"}
                </p>
              </div>

              <div className="p-4 bg-base-100 border border-base-content/20 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-base-content/70 block mb-1">
                  Floor Level
                </span>
                <p className="text-xl font-black text-base-content">
                  Floor {activeAgreement.floorNo || activeAgreement.floor || 1}
                </p>
              </div>

              <div className="p-4 bg-base-100 border border-base-content/20 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-base-content/70 block mb-1">
                  Monthly Rent
                </span>
                <p className="text-xl font-black text-base-content">
                  ${activeAgreement.rent} / mo
                </p>
              </div>
            </div>

            <div className="p-4 bg-base-content/5 border border-base-content/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-bold">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-base-content text-sm" />
                <span>Agreement Date: {new Date(activeAgreement.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-base-content/80">
                <FaShieldAlt className="text-base-content text-sm" />
                <span>Single Occupancy Enforced (1 Apartment Max)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Monthly Rent Calculation & Penalty Monitor Section - Only visible for verified members */}
      {isMember && (
        <div className="space-y-4 pt-4 border-t border-base-content/15">
          <div className="flex items-center gap-2">
            <FaDollarSign className="text-xl text-base-content" />
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide text-base-content">
              Monthly Rent Calculation & Billing Summary
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-base-100 border border-base-content/25 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-base-content/70 block mb-1">
                  Outstanding Unpaid Balance
                </span>
                <h3 className="text-3xl font-black text-base-content">
                  ${totalUnpaidBalance}
                </h3>
                <p className="text-xs text-base-content/75 font-medium mt-2">
                  Calculated automatically on the 1st of each calendar month.
                </p>
              </div>
              <button
                onClick={() => navigate("/dashboard/makepayment")}
                className="btn bg-base-content text-base-100 hover:bg-base-content/80 rounded-none w-full font-bold uppercase text-xs tracking-wider border-none gap-2 mt-4"
              >
                <FaCreditCard /> Pay Rent Bill via Stripe
              </button>
            </div>

            <div className="p-6 bg-base-100 border border-base-content/25 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-base-content/70 block mb-1">
                Consecutive Unpaid Months
              </span>
              <h3 className="text-3xl font-black text-base-content">
                {unpaidBills.length} / 3 Months
              </h3>
              <p className="text-xs text-base-content/75 font-medium mt-2">
                Unpaid bills generated by system cron scheduler.
              </p>
            </div>

            <div className="p-6 bg-base-100 border border-base-content/25 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-base-content flex items-center gap-1.5 mb-1">
                  <FaExclamationTriangle className="text-xs" /> Default Penalty Policy
                </span>
                <p className="text-xs text-base-content/85 font-medium leading-relaxed">
                  Failing to pay rent for 3 consecutive months triggers an automated system downgrade from Member to User role and terminates the active lease.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
