import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { FaComments, FaEye, FaUserMinus, FaUsers, FaExclamationTriangle } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loader from "../../../Shared/component/Loader/Loader";
import showToast from "../../../lib/toast";

export default function ManageMembars() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedDue, setSelectedDue] = useState([]);
  const [removeMemberEmail, setRemoveMemberEmail] = useState(null);
  const axiosSecure = useAxiosSecure();

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const res = await axiosSecure.get("/members");
      return res.data || [];
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (email) => {
      await axiosSecure.patch(`/members/${email}/remove`);
    },
    onSuccess: () => {
      showToast.success("Member role changed to normal user.");
      queryClient.invalidateQueries(["members"]);
      queryClient.invalidateQueries(["admin-stats"]);
      queryClient.invalidateQueries(["apartments"]);
      queryClient.invalidateQueries(["all-apartments"]);
    },
    onError: (err) => {
      showToast.error(err?.response?.data?.message || "Failed to remove member.");
    },
  });

  const handleRemove = (email) => {
    setRemoveMemberEmail(email);
  };

  const confirmRemove = () => {
    if (removeMemberEmail) {
      removeMutation.mutate(removeMemberEmail);
      setRemoveMemberEmail(null);
    }
  };

  const handleShowDue = async (email) => {
    try {
      const res = await axiosSecure.get(`/members/${email}/due-months`);
      setSelectedDue(res.data);
      if (res.data && res.data.length > 0) {
        const dueList = res.data.map((m) => `${m.month}: $${m.amount}`).join("\n");
        showToast.info(`Due Months for ${email}:\n${dueList}`);
      } else {
        showToast.success(`No pending due months for ${email}.`);
      }
    } catch (err) {
      showToast.error("Failed to fetch due months.");
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="w-full px-4 md:px-10 py-8 bg-base-100 text-base-content border border-base-content/25 shadow-xs space-y-6">
      {/* Box Header */}
      <div className="p-6 bg-base-100 border border-base-content/20 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 bg-base-content/10 text-base-content border border-base-content/20 flex items-center justify-center text-xl shrink-0">
            <FaUsers />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wide text-base-content">
              Manage Members
            </h1>
            <p className="text-xs md:text-sm text-base-content/75 font-medium">
              View active building members, check due months, remove member access, or start a direct conversation.
            </p>
          </div>
        </div>
        <span className="px-4 py-2 bg-base-content text-base-100 text-xs font-black uppercase tracking-widest border border-base-content self-start md:self-auto shrink-0">
          {members.length} Active Members
        </span>
      </div>

      {/* Members Table */}
      <div className="bg-base-100 border border-base-content/20 shadow-xs overflow-x-auto">
        <table className="table w-full rounded-none text-base-content">
          <thead>
            <tr className="bg-base-content/10 text-base-content font-black text-xs uppercase tracking-wider border-b border-base-content/20">
              <th className="p-4 text-left">Member Name</th>
              <th className="p-4 text-left">Email Address</th>
              <th className="p-4 text-left">Apartment No</th>
              <th className="p-4 text-left">Block Name</th>
              <th className="p-4 text-left">Floor Level</th>
              <th className="p-4 text-left">Monthly Rent</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-content/10 text-xs font-bold">
            {members.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-8 text-base-content/70 font-bold">
                  No active members found.
                </td>
              </tr>
            ) : (
              members.map((m) => (
                <tr key={m._id || m.email} className="hover:bg-base-content/5 transition-colors">
                  <td className="p-4 font-black text-base-content">{m.userName || "(no name)"}</td>
                  <td className="p-4 font-mono font-bold text-base-content/85">{m.email}</td>
                  <td className="p-4 font-black text-base-content">Apt {m.apartmentNo || "N/A"}</td>
                  <td className="p-4 font-extrabold text-base-content">{m.blockName || m.block || "Block A"}</td>
                  <td className="p-4 font-extrabold text-base-content">Floor {m.floorNo || m.floor || 1}</td>
                  <td className="p-4 font-black text-base-content">${m.rent || 0} / mo</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      {/* Direct Message Button */}
                      <button
                        onClick={() =>
                          navigate("/dashboard/chat", {
                            state: {
                              email: m.email,
                              userName: m.userName || m.email,
                              apartmentNo: m.apartmentNo || "Member",
                            },
                          })
                        }
                        className="btn btn-sm bg-base-content text-base-100 hover:bg-base-content/80 rounded-none font-bold uppercase text-[11px] tracking-wider gap-1 border-none"
                        title="Open direct chat with this member"
                      >
                        <FaComments /> Message
                      </button>

                      {/* View Dues Button */}
                      <button
                        onClick={() => handleShowDue(m.email)}
                        className="btn btn-sm border border-base-content/30 bg-transparent text-base-content hover:bg-base-content/10 rounded-none font-bold uppercase text-[11px] tracking-wider gap-1"
                      >
                        <FaEye /> View Dues
                      </button>

                      {/* Remove Member Button */}
                      <button
                        onClick={() => handleRemove(m.email)}
                        className="btn btn-sm border border-base-content/30 bg-transparent text-base-content hover:bg-base-content/10 rounded-none font-bold uppercase text-[11px] tracking-wider gap-1"
                      >
                        <FaUserMinus /> Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Custom Confirmation Modal for Member Removal */}
      {removeMemberEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-base-100 border border-base-content/30 shadow-2xl p-6 max-w-md w-full text-base-content rounded-none space-y-5">
            <div className="flex items-center gap-3 border-b border-base-content/15 pb-3">
              <div className="w-9 h-9 bg-base-content/10 text-base-content border border-base-content/20 flex items-center justify-center text-sm">
                <FaExclamationTriangle />
              </div>
              <h3 className="text-lg font-black uppercase tracking-wide text-base-content">
                Revoke Member Privileges
              </h3>
            </div>
            <p className="text-sm text-base-content/85 font-medium leading-relaxed">
              Are you sure you want to revoke member privileges for <span className="font-mono font-bold">{removeMemberEmail}</span>? They will lose access to member benefits and their active lease will be terminated.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRemoveMemberEmail(null)}
                className="btn btn-ghost rounded-none font-bold uppercase text-xs tracking-wider text-base-content hover:bg-base-content/10 border border-base-content/20"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmRemove}
                className="btn bg-base-content text-base-100 hover:bg-base-content/80 rounded-none font-bold uppercase text-xs tracking-wider border-none px-6"
              >
                Confirm Revoke
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
