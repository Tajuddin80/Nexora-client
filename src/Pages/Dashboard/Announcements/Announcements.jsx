import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useUserRole from "../../../hooks/useUserRole";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const Announcements = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { role } = useUserRole();
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "" });

  // ✅ Fetch all announcements
  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const res = await axiosSecure.get("/announcements");
      return res.data;
    },
  });

  // ✅ Mutation to add announcement (only admin)
  const addMutation = useMutation({
    mutationFn: async (newAnnouncement) => {
      const res = await axiosSecure.post("/announcements", newAnnouncement);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["announcements"]);
      Swal.fire("Success", "Announcement added!", "success");
      setShowModal(false);
      setFormData({ title: "", description: "" });
    },
    onError: () => {
      Swal.fire("Error", "Could not add announcement", "error");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      Swal.fire("Error", "All fields are required!", "error");
      return;
    }
    addMutation.mutate({
      title: formData.title,
      description: formData.description,
      announcedBy: user?.email,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">📢 Announcements</h2>
        {role === "admin" && (
          <button
            onClick={() => setShowModal(true)}
            className="btn bg-blue-600 text-white hover:bg-blue-700"
          >
            ➕ Share Announcement
          </button>
        )}
      </div>

      {isLoading ? (
        <p>Loading announcements...</p>
      ) : announcements.length === 0 ? (
        <p className="text-gray-500">No announcements yet.</p>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <div
              key={a._id}
              className="p-4 bg-white rounded-xl shadow hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold">{a.title}</h3>
              <p className="text-gray-600 mt-1">{a.description}</p>
              <p className="text-xs text-gray-400 mt-2">
                Announced by {a.announcedBy} on{" "}
                {new Date(a.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal for creating announcement */}
    {showModal && (
  <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
      <h3 className="text-xl font-bold mb-4">New Announcement</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="input input-bordered w-full"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
        />
        <textarea
          placeholder="Description"
          className="textarea textarea-bordered w-full"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="btn"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn bg-blue-600 text-white hover:bg-blue-700"
          >
            Share
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default Announcements;
