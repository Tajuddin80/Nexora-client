import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaBullhorn } from "react-icons/fa";
import useUserRole from "../../../hooks/useUserRole";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../../Shared/component/Loader/Loader";

const Announcements = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { role } = useUserRole();
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "" });

  //  Fetch announcements
  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const res = await axiosSecure.get("/announcements");
      return res.data;
    },
  });

  //  Add/Edit announcement
  const saveMutation = useMutation({
    mutationFn: async (announcement) => {
      if (editingId) {
        const res = await axiosSecure.patch(
          `/announcements/${editingId}`,
          announcement
        );
        return res.data;
      } else {
        const res = await axiosSecure.post("/announcements", announcement);
        return res.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["announcements"]);
      Swal.fire({
        icon: "success",
        title: editingId ? "Announcement updated!" : "Announcement added!",
        timer: 2000,
        showConfirmButton: false,
      });
      setShowModal(false);
      setFormData({ title: "", description: "" });
      setEditingId(null);
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: editingId
          ? "Could not update announcement"
          : "Could not add announcement",
        timer: 2000,
        showConfirmButton: false,
      });
    },
  });

  //  Delete announcement
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/announcements/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["announcements"]);
      Swal.fire({
        icon: "success",
        title: "Announcement removed!",
        timer: 2000,
        showConfirmButton: false,
      });
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Could not delete announcement",
        timer: 2000,
        showConfirmButton: false,
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      Swal.fire({
        icon: "error",
        title: "All fields are required!",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    saveMutation.mutate({
      title: formData.title,
      description: formData.description,
      announcedBy: user?.email,
      createdAt: new Date().toISOString(),
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete this announcement?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  const handleEdit = (announcement) => {
    setEditingId(announcement._id);
    setFormData({
      title: announcement.title,
      description: announcement.description,
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between flex-wrap gap-10 items-center">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <FaBullhorn className="" /> Announcements
        </h2>
        {role === "admin" && (
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({ title: "", description: "" });
              setShowModal(true);
            }}
            className="btn bg-primary text-primary-content hover:bg-primary/80 flex items-center gap-2"
          >
            <FaBullhorn /> Share Announcement
          </button>
        )}
      </div>

      {isLoading ? (
        <Loader />
      ) : announcements.length === 0 ? (
        <p className="text-gray-500">No announcements yet.</p>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <div
              key={a._id}
              className="p-4 bg-base-100 text-base-content rounded-xl shadow hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg text-primary font-semibold">
                    {a.title}
                  </h3>
                  <p className="mt-1">{a.description}</p>
                  <p className="text-xs mt-2 opacity-70">
                    Announced by {a.announcedBy} on{" "}
                    {new Date(a.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {role === "admin" && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleEdit(a)}
                      className="flex items-center gap-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(a._id)}
                      className="flex items-center gap-1 text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-base-100 text-base-content rounded-xl p-6 w-full max-w-5xl shadow-xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaBullhorn />
              {editingId ? "Edit Announcement" : "New Announcement"}
            </h3>
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
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                  }}
                  className="btn bg-gray-400 text-white hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-gray-400 text-white hover:bg-gray-500"
                  disabled={saveMutation.isLoading}
                >
                  {saveMutation.isLoading
                    ? "Saving..."
                    : editingId
                    ? "Update"
                    : "Share"}
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
