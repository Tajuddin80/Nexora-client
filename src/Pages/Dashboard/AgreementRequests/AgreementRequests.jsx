import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import showToast from "../../../lib/toast";
import {
  FaTasks,
  FaUser,
  FaBuilding,
  FaDollarSign,
  FaCalendarAlt,
  FaComments,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaFileAlt,
  FaQuestionCircle,
} from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loader from "../../../Shared/component/Loader/Loader";
import EmptyState from "../../../Shared/component/EmptyState/EmptyState";

const AgreementRequests = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // State for Custom Confirmation Modal
  const [confirmModalData, setConfirmModalData] = useState(null); // { id, userEmail, action, apartmentNo }

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
      queryClient.invalidateQueries(["members"]);
      queryClient.invalidateQueries(["admin-stats"]);
      queryClient.invalidateQueries(["apartments"]);
      queryClient.invalidateQueries(["all-apartments"]);
      showToast.success(
        `Agreement successfully ${variables.action === "accept" ? "Accepted! User promoted to Member." : "Rejected."}`
      );
      setConfirmModalData(null);
    },
    onError: (err) => {
      showToast.error(err?.response?.data?.message || "Operation failed.");
      setConfirmModalData(null);
    },
  });

  const handleOpenConfirm = (req, action) => {
    setConfirmModalData({
      id: req._id,
      userEmail: req.userEmail,
      userName: req.userName,
      apartmentNo: req.apartmentNo,
      action,
    });
  };

  const handleConfirmAction = () => {
    if (!confirmModalData) return;
    mutation.mutate({
      id: confirmModalData.id,
      userEmail: confirmModalData.userEmail,
      action: confirmModalData.action,
    });
  };

  const handleChatWithApplicant = () => {
    navigate("/dashboard/chat");
  };

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <EmptyState
        icon={<FaExclamationTriangle className="text-3xl text-error" />}
        title="Error Loading Requests"
        message={error?.message || "Could not retrieve agreement requests."}
      />
    );

  return (
    <div className="w-full px-2 md:px-6 py-4 space-y-6">
      {/* Box Header */}
      <div className="p-6 bg-base-100 border-2 border-base-content flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-black uppercase tracking-wider text-base-content flex items-center gap-3">
            <FaTasks /> Agreement Applications
          </h1>
          <p className="text-xs md:text-sm text-base-content/75 font-medium mt-1">
            Review user-fulfilled agreement applications. Accept to promote user to member or chat directly to discuss terms.
          </p>
        </div>
        <span className="px-4 py-2 bg-base-content text-base-100 font-black text-xs uppercase tracking-wider border border-base-content">
          {requests.length} Pending Requests
        </span>
      </div>

      {/* Requests Grid */}
      {requests.length === 0 ? (
        <EmptyState
          icon={<FaFileAlt className="text-3xl text-base-content" />}
          title="No Pending Agreement Applications"
          message="There are currently no new rental agreement applications waiting for admin decision."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-base-100 border-2 border-base-content p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition-all duration-200"
            >
              {/* Header Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-base-content/20">
                  <span className="px-2.5 py-0.5 bg-base-content text-base-100 font-black text-[10px] uppercase tracking-wider">
                    Pending Review
                  </span>
                  <span className="text-xs font-bold text-base-content/70 flex items-center gap-1">
                    <FaCalendarAlt /> {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="bg-base-100 p-4 border border-base-content flex items-center gap-3">
                  <FaBuilding className="text-3xl text-base-content shrink-0" />
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
                <div className="space-y-1.5 text-xs font-bold bg-base-100 p-3 border border-base-content">
                  <div className="flex items-center gap-2 text-base-content uppercase tracking-wider">
                    <FaUser className="text-base-content" /> {req.userName || "Tenant Applicant"}
                  </div>
                  <div className="text-base-content/70 truncate pl-5 font-mono">
                    {req.userEmail}
                  </div>
                  <div className="text-base-content font-black text-sm flex items-center gap-1 pl-5">
                    <FaDollarSign /> Rent: ${req.rent} / month
                  </div>
                </div>
              </div>

              {/* Actions - Sharp Buttons */}
              <div className="space-y-2 pt-2 border-t border-base-content/20">
                <button
                  onClick={handleChatWithApplicant}
                  className="btn border border-base-content bg-transparent text-base-content hover:bg-base-content hover:text-base-100 rounded-none btn-sm w-full font-black uppercase text-xs tracking-wider"
                >
                  <FaComments /> Chat with Applicant
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenConfirm(req, "accept")}
                    disabled={mutation.isLoading}
                    className="btn bg-base-content text-base-100 hover:bg-base-content/80 rounded-none btn-sm flex-1 font-black uppercase text-xs tracking-wider gap-1 border-none"
                  >
                    <FaCheck /> Accept
                  </button>
                  <button
                    onClick={() => handleOpenConfirm(req, "reject")}
                    disabled={mutation.isLoading}
                    className="btn border border-base-content bg-transparent text-base-content hover:bg-base-content hover:text-base-100 rounded-none btn-sm flex-1 font-black uppercase text-xs tracking-wider gap-1"
                  >
                    <FaTimes /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom Theme Confirmation Modal */}
      {confirmModalData && (
        <div className="fixed inset-0 z-[999] bg-black/70 flex items-center justify-center p-4">
          <div className="bg-base-100 text-base-content border-2 border-base-content p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center gap-3 border-b border-base-content/20 pb-4">
              <div className="w-10 h-10 bg-base-content text-base-100 flex items-center justify-center text-lg shrink-0">
                <FaQuestionCircle />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-base-content/60 block">
                  Confirmation Required
                </span>
                <h3 className="text-lg font-black uppercase tracking-wider text-base-content">
                  {confirmModalData.action === "accept" ? "Accept Agreement" : "Reject Agreement"}
                </h3>
              </div>
            </div>

            <p className="text-sm font-medium text-base-content/80 leading-relaxed">
              Are you sure you want to{" "}
              <span className="font-black text-base-content uppercase">
                {confirmModalData.action}
              </span>{" "}
              the agreement request for{" "}
              <span className="font-bold text-base-content">
                Apartment {confirmModalData.apartmentNo}
              </span>{" "}
              submitted by{" "}
              <span className="font-mono text-base-content">
                {confirmModalData.userEmail}
              </span>?
              {confirmModalData.action === "accept" && (
                <span className="block mt-2 font-bold text-xs uppercase tracking-wider text-base-content">
                  • User will be automatically promoted to Resident Member role.
                </span>
              )}
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-base-content/20">
              <button
                onClick={() => setConfirmModalData(null)}
                disabled={mutation.isLoading}
                className="btn border border-base-content bg-transparent text-base-content hover:bg-base-content/10 rounded-none text-xs font-bold uppercase tracking-wider px-5"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={mutation.isLoading}
                className="btn bg-base-content text-base-100 hover:bg-base-content/80 rounded-none text-xs font-black uppercase tracking-wider px-6 border-none flex items-center gap-2"
              >
                {mutation.isLoading ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : confirmModalData.action === "accept" ? (
                  <>
                    <FaCheck /> Confirm Accept
                  </>
                ) : (
                  <>
                    <FaTimes /> Confirm Reject
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgreementRequests;
