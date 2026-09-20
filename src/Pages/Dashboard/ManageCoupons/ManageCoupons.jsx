import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import showToast from "../../../lib/toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaEdit, FaTrash, FaCalendarAlt, FaPlus, FaTimes, FaGift, FaExclamationTriangle } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loader from "../../../Shared/component/Loader/Loader";

const ManageCoupons = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const [editCouponId, setEditCouponId] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    description: "",
    expiryDate: null,
    available: true,
  });

  // Fetch coupons
  const {
    data: coupons = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      const res = await axiosSecure.get("/coupons");
      return res.data;
    },
  });

  // Add or update coupon
  const saveCouponMutation = useMutation({
    mutationFn: async (coupon) => {
      if (editCouponId) {
        const res = await axiosSecure.put(`/coupons/${editCouponId}`, coupon);
        return res.data;
      } else {
        const res = await axiosSecure.post("/coupons", coupon);
        return res.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["coupons"]);
      queryClient.invalidateQueries(["all-coupons"]);
      showToast.success(editCouponId ? "Coupon updated successfully!" : "Coupon created successfully!");
      resetForm();
    },
    onError: (err) => {
      showToast.error(err?.response?.data?.message || "Failed to save coupon.");
    },
  });

  // Delete coupon
  const deleteCouponMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/coupons/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["coupons"]);
      queryClient.invalidateQueries(["all-coupons"]);
      showToast.success("Coupon deleted successfully!");
    },
    onError: (err) => {
      showToast.error(err?.response?.data?.message || "Failed to delete coupon.");
    },
  });

  const resetForm = () => {
    setShowModal(false);
    setEditCouponId(null);
    setFormData({
      code: "",
      discount: "",
      description: "",
      expiryDate: null,
      available: true,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { code, discount, description, expiryDate, available } = formData;
    if (!code || !discount || !description || !expiryDate) {
      showToast.warning("Please fill out all fields, including expiry date.");
      return;
    }
    saveCouponMutation.mutate({
      code,
      discount: Number(discount),
      description,
      expiryDate,
      available,
      createdAt: editCouponId ? undefined : new Date(),
    });
  };

  const handleEdit = (coupon) => {
    setEditCouponId(coupon._id);
    setFormData({
      code: coupon.code,
      discount: coupon.discount,
      description: coupon.description,
      expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate) : null,
      available: coupon.available ?? true,
    });
    setShowModal(true);
  };

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const handleDelete = (id) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      deleteCouponMutation.mutate(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  if (isLoading) return <Loader />;
  if (isError)
    return <div className="p-4 text-error font-bold">Error: {error.message}</div>;

  return (
    <div className="p-6 md:p-10 bg-base-100 text-base-content border border-base-content/25 shadow-xs space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-base-content/15">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-base-content/10 text-base-content border border-base-content/20 flex items-center justify-center text-lg shrink-0">
            <FaGift />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wide text-base-content">
              Manage Coupons
            </h2>
            <p className="text-xs text-base-content/70 font-bold">
              Create, modify, and monitor promotional discount vouchers.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn bg-base-content text-base-100 hover:bg-base-content/80 rounded-none font-bold uppercase text-xs tracking-wider flex items-center gap-2 px-5 py-2.5 border-none shrink-0"
        >
          <FaPlus /> Add Coupon
        </button>
      </div>

      {/* Table Section */}
      {coupons.length === 0 ? (
        <p className="text-center text-base-content/70 font-medium py-8">No coupons found.</p>
      ) : (
        <div className="overflow-x-auto border border-base-content/20 shadow-xs">
          <table className="table w-full text-base-content">
            <thead className="bg-base-content/10 text-base-content border-b border-base-content/20 font-black uppercase text-xs tracking-wider">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-content/10">
              {coupons.map((coupon) => (
                <tr
                  key={coupon._id}
                  className="bg-base-100 hover:bg-base-content/5 transition-colors text-xs font-bold"
                >
                  <td className="font-mono font-black text-sm text-base-content py-4 px-4">
                    {coupon.code}
                  </td>
                  <td className="py-4 px-4 font-black text-sm">
                    {coupon.discount}% OFF
                  </td>
                  <td className="py-4 px-4 text-base-content/85 max-w-xs font-medium">
                    {coupon.description}
                  </td>
                  <td className="py-4 px-4">
                    {coupon.expiryDate
                      ? new Date(coupon.expiryDate).toLocaleDateString()
                      : "Lifetime"}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                        coupon.available
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                          : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      {coupon.available ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="btn btn-sm border border-base-content/30 bg-transparent text-base-content hover:bg-base-content/10 rounded-none font-bold text-xs"
                        title="Edit Coupon"
                      >
                        <FaEdit /> <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(coupon._id)}
                        className="btn btn-sm border border-rose-500/40 bg-transparent text-rose-500 hover:bg-rose-500 hover:text-white rounded-none font-bold text-xs"
                        title="Delete Coupon"
                      >
                        <FaTrash /> <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs">
          <div className="bg-base-100 rounded-none border border-base-content/30 shadow-2xl w-full max-w-lg p-6 relative">
            <div className="flex justify-between items-center pb-4 mb-5 border-b border-base-content/15">
              <h3 className="text-xl font-black uppercase tracking-wider text-base-content">
                {editCouponId ? "Edit Coupon" : "Add New Coupon"}
              </h3>
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-square btn-sm bg-transparent text-base-content border-none hover:bg-base-content/10 rounded-none font-bold"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-base-content uppercase tracking-wider mb-1 block">
                  Coupon Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. WELCOME2026"
                  className="input input-bordered rounded-none border border-base-content/20 bg-base-100 text-base-content w-full focus:outline-none focus:border-base-content font-mono font-bold uppercase"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                />
              </div>

              <div>
                <label className="text-xs font-bold text-base-content uppercase tracking-wider mb-1 block">
                  Discount Percentage (%)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 20"
                  className="input input-bordered rounded-none border border-base-content/20 bg-base-100 text-base-content w-full focus:outline-none focus:border-base-content font-bold"
                  value={formData.discount}
                  onChange={(e) =>
                    setFormData({ ...formData, discount: e.target.value })
                  }
                  min={0}
                  max={100}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-base-content uppercase tracking-wider mb-1 block">
                  Coupon Description
                </label>
                <textarea
                  placeholder="e.g. Exclusive 20% discount on first month rent"
                  className="textarea textarea-bordered rounded-none border border-base-content/20 bg-base-100 text-base-content w-full focus:outline-none focus:border-base-content font-medium h-24"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              {/* Calendar Picker */}
              <div>
                <label className="text-xs font-bold text-base-content uppercase tracking-wider mb-1 block">
                  Expiry Date
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute top-3.5 left-3.5 text-base-content/60 text-sm pointer-events-none" />
                  <DatePicker
                    selected={formData.expiryDate}
                    onChange={(date) =>
                      setFormData({ ...formData, expiryDate: date })
                    }
                    className="input input-bordered rounded-none border border-base-content/20 bg-base-100 text-base-content w-full pl-10 focus:outline-none focus:border-base-content font-bold"
                    placeholderText="Select expiry date"
                    minDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                    showPopperArrow={false}
                  />
                </div>
              </div>

              {/* Availability toggle */}
              <label className="flex items-center gap-3 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) =>
                    setFormData({ ...formData, available: e.target.checked })
                  }
                  className="checkbox rounded-none checkbox-sm border-base-content shrink-0"
                />
                <span className="text-xs font-bold text-base-content uppercase tracking-wider">
                  Active & Available for Users
                </span>
              </label>

              <div className="flex justify-end gap-3 pt-4 border-t border-base-content/15">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-ghost rounded-none font-bold uppercase text-xs tracking-wider text-base-content hover:bg-base-content/10"
                  disabled={saveCouponMutation.isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveCouponMutation.isLoading}
                  className="btn bg-base-content text-base-100 hover:bg-base-content/80 rounded-none font-bold uppercase text-xs tracking-wider border-none px-6"
                >
                  {saveCouponMutation.isLoading ? "Saving..." : editCouponId ? "Update Coupon" : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-base-100 border border-base-content/30 shadow-2xl p-6 max-w-md w-full text-base-content rounded-none space-y-5">
            <div className="flex items-center gap-3 border-b border-base-content/15 pb-3">
              <div className="w-9 h-9 bg-base-content/10 text-base-content border border-base-content/20 flex items-center justify-center text-sm">
                <FaExclamationTriangle />
              </div>
              <h3 className="text-lg font-black uppercase tracking-wide text-base-content">
                Confirm Deletion
              </h3>
            </div>
            <p className="text-sm text-base-content/85 font-medium leading-relaxed">
              Are you sure you want to delete this promotional coupon? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="btn btn-ghost rounded-none font-bold uppercase text-xs tracking-wider text-base-content hover:bg-base-content/10 border border-base-content/20"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="btn bg-base-content text-base-100 hover:bg-base-content/80 rounded-none font-bold uppercase text-xs tracking-wider border-none px-6"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCoupons;
