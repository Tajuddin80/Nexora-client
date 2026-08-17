import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import {
  FaTasks,
  FaUser,
  FaBuilding,
  FaLayerGroup,
  FaDollarSign,
  FaCalendarAlt,
  FaComments,
  FaCheck,
  FaTimes,
  FaInfoCircle,
} from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loader from "../../../Shared/component/Loader/Loader";
import EmptyState from "../../../Shared/component/EmptyState/EmptyState";

const AgreementRequests = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: requests = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["agreements"],
    queryFn: async () => {
      const res = await axiosSecure.get("/agreements?status=pending");
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async ({ id, userEmail, action }) => {
      const res = await axiosSecure.patch(`/agreements/${id}`, {
        action,
        userEmail,
      });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["agreements"]);
      Swal.fire({
        icon: "success",
        title: `Agreement ${
          variables.action === "accept" ? "Accepted" : "Rejected"
        }`,
        text:
          variables.action === "accept"
            ? "Applicant has been promoted to Member and apartment marked as leased."
            : "Agreement application rejected.",
        timer: 2000,
        showConfirmButton: false,
      });
    },
    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: "Operation Failed",
        text: err?.response?.data?.message || err.message,
      });
    },
  });

  const handleAction = (id, userEmail, action) => {
    Swal.fire({
      title: `Are you sure to ${action}?`,
      text:
        action === "accept"
          ? "Accepting will promote this user to Member and mark the apartment as unavailable."
          : "Rejecting will mark this application as rejected.",
      icon: action === "accept" ? "question" : "warning",
      showCancelButton: true,
      confirmButtonColor: action === "accept" ? "#10b981" : "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${action}`,
    }).then((result) => {
      if (result.isConfirmed) {
        mutation.mutate({ id, userEmail, action });
      }
    });
  };

  const handleChatWithApplicant = () => {
    navigate("/dashboard/chat");
  };

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <EmptyState
        icon="⚠️"
        title="Error Loading Requests"
        message={error?.message || "Could not retrieve agreement requests."}
      />
    );

  return (
    <div className="w-full px-2 md:px-6 py-4 space-y-6">
      {/* Box Header */}
      <div className="p-6 bg-base-100 border-2 border-base-300 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-4xl font-black uppercase tracking-wider text-base-content flex items-center gap-3">
            <FaTasks className="text-primary" /> Agreement Applications
          </h1>
          <p className="text-xs md:text-sm text-base-content/70 font-medium mt-1">
            Review user-fulfilled agreement applications. Accept to promote user to member or chat directly to discuss terms.
          </p>
        </div>
        <span className="px-3 py-1 bg-amber-500 text-white font-black text-xs uppercase tracking-wider">
          {requests.length} Pending Requests
        </span>
      </div>

      {/* Requests Grid */}
      {requests.length === 0 ? (
        <EmptyState
          icon="📄"
          title="No Pending Agreement Applications"
          message="There are currently no new rental agreement applications waiting for admin decision."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-base-100 border-2 border-base-300 p-6 flex flex-col justify-between space-y-4 hover:border-primary transition-all duration-200"
            >
              {/* Header Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-base-200">
                  <span className="px-2.5 py-0.5 bg-amber-500 text-white font-black text-[10px] uppercase tracking-wider">
                    Pending Review
                  </span>
                  <span className="text-xs font-bold text-base-content/60 flex items-center gap-1">
                    <FaCalendarAlt /> {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="bg-base-200/50 p-4 border-2 border-base-300 flex items-center gap-3">
                  <FaBuilding className="text-3xl text-primary shrink-0" />
                  <div>
                    <h3 className="font-black text-lg text-base-content uppercase tracking-wide">
                      Apartment {req.apartmentNo}
                    </h3>
                    <p className="text-xs font-bold text-base-content/70 uppercase tracking-wider">
                      {req.blockName || req.block || "Block A"} • Floor {req.floorNo || req.floor || 1}
                    </p>
                  </div>
                </div>

                {/* Applicant Info */}
                <div className="space-y-1.5 text-xs font-bold bg-base-100 p-3 border border-base-300">
                  <div className="flex items-center gap-2 text-base-content uppercase tracking-wider">
                    <FaUser className="text-primary" /> {req.userName || "Tenant Applicant"}
                  </div>
                  <div className="text-base-content/70 truncate pl-5 font-mono">
                    {req.userEmail}
                  </div>
                  <div className="text-primary font-black text-sm flex items-center gap-1 pl-5">
                    <FaDollarSign /> Rent: ${req.rent} / month
                  </div>
                </div>
              </div>

              {/* Actions - Sharp Buttons */}
              <div className="space-y-2 pt-2 border-t-2 border-base-300">
                <button
                  onClick={handleChatWithApplicant}
                  className="btn btn-outline btn-primary rounded-none btn-sm w-full font-black uppercase text-xs tracking-wider border-2"
                >
                  <FaComments /> Chat with Applicant
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(req._id, req.userEmail, "accept")}
                    disabled={mutation.isLoading}
                    className="btn btn-success rounded-none btn-sm flex-1 text-white font-black uppercase text-xs tracking-wider gap-1 border-2 border-success"
                  >
                    <FaCheck /> Accept
                  </button>
                  <button
                    onClick={() => handleAction(req._id, req.userEmail, "reject")}
                    disabled={mutation.isLoading}
                    className="btn btn-error rounded-none btn-sm flex-1 text-white font-black uppercase text-xs tracking-wider gap-1 border-2 border-error"
                  >
                    <FaTimes /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgreementRequests;
