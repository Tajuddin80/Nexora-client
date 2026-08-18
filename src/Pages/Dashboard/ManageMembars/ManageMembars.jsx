import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useState } from "react";
import { FaComments, FaEye, FaUserMinus, FaUsers } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loader from "../../../Shared/component/Loader/Loader";
import showToast from "../../../lib/toast";

export default function ManageMembars() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedDue, setSelectedDue] = useState([]);
  const axiosSecure = useAxiosSecure();

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const res = await axiosSecure.get("/members");
      return res.data;
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (email) => {
      await axiosSecure.patch(`/members/${email}/remove`);
    },
    onSuccess: () => {
      showToast.success("Member role changed to normal user.");
      queryClient.invalidateQueries(["members"]);
    },
    onError: (err) => {
      showToast.error(err?.response?.data?.message || "Failed to remove member.");
    },
  });

  const handleRemove = (email) => {
    if (window.confirm("Are you sure? They will lose member access.")) {
      removeMutation.mutate(email);
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
    <div className="w-full px-4 md:px-10 py-8">
      {/* Box Header */}
      <div className="mb-8 p-6 bg-base-100 border border-base-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <FaUsers className="text-4xl text-primary" />
          <div>
            <h1 className="text-2xl md:text-4xl font-extrabold uppercase tracking-wider text-base-content">
              Manage Members
            </h1>
            <p className="text-xs md:text-sm text-base-content/70 font-medium">
              View active building members, check due months, remove member access, or start a direct conversation.
            </p>
          </div>
        </div>
        <span className="px-4 py-2 bg-primary text-primary-content text-xs font-bold uppercase tracking-wider border border-primary self-start md:self-auto">
          {members.length} Active Members
        </span>
      </div>

      {/* Members Table */}
      <div className="bg-base-100 border border-base-200 shadow-sm overflow-x-auto">
        <table className="table w-full rounded-none">
          <thead>
            <tr className="bg-base-200/60 text-base-content font-black text-xs uppercase tracking-wider border-b border-base-200">
              <th className="p-4">Member Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Apartment No</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200 text-sm font-semibold">
            {members.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-8 text-base-content/60 font-bold">
                  No active members found.
                </td>
              </tr>
            ) : (
              members.map((m) => (
                <tr key={m._id || m.email} className="hover:bg-base-200/30 transition-colors">
                  <td className="p-4 font-bold text-base-content">{m.userName || "(no name)"}</td>
                  <td className="p-4 font-mono text-xs text-base-content/80">{m.email}</td>
                  <td className="p-4 font-bold text-primary">{m.apartmentNo || "N/A"}</td>
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
                        className="btn btn-sm btn-primary rounded-none font-bold uppercase text-xs tracking-wider gap-1 text-white"
                        title="Open direct chat with this member"
                      >
                        <FaComments /> Message
                      </button>

                      {/* View Dues Button */}
                      <button
                        onClick={() => handleShowDue(m.email)}
                        className="btn btn-sm btn-outline btn-info rounded-none font-bold uppercase text-xs tracking-wider gap-1"
                      >
                        <FaEye /> View Dues
                      </button>

                      {/* Remove Member Button */}
                      <button
                        onClick={() => handleRemove(m.email)}
                        className="btn btn-sm btn-outline btn-error rounded-none font-bold uppercase text-xs tracking-wider gap-1"
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
    </div>
  );
}
