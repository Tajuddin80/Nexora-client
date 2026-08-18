import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import showToast from "../../../lib/toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaEdit, FaTrash, FaCalendarAlt, FaPlus } from "react-icons/fa";
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

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      deleteCouponMutation.mutate(id);
    }
  };

  if (isLoading) return <Loader></Loader>;
  if (isError)
    return <div className="p-4 text-error">Error: {error.message}</div>;

  return (
    <div className="p-6 bg-base-100 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold ">Manage Coupons</h2>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn btn-primary flex items-center gap-2 px-5 py-2 hover:scale-105 transition"
        >
          <FaPlus /> Add Coupon
        </button>
      </div>

      {coupons.length === 0 ? (
        <p className="text-center text-gray-500">No coupons found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-sm">
          <table className="table w-full border border-primary/40">
            <thead className="bg-primary text-white">
              <tr>
                <th>Code</th>
                <th>Discount (%)</th>
                <th>Description</th>
                <th>Expiry Date</th>
                <th>Available</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr
                  key={coupon._id}
                  className="bg-base-100 hover:bg-primary/10 transition-colors"
                >
                  <td className="font-semibold">{coupon.code}</td>
                  <td>{coupon.discount}</td>
                  <td>{coupon.description}</td>
                  <td>
                    {coupon.expiryDate
                      ? new Date(coupon.expiryDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td
                    className={`font-bold ${
                      coupon.available ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {coupon.available ? "Yes" : "No"}
                  </td>
                  <td className="flex justify-center gap-3">
                    <button
                      onClick={() => handleEdit(coupon)}
                      className="btn btn-sm btn-primary text-white flex items-center gap-1 hover:scale-105 transition"
                      title="Edit Coupon"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className="btn btn-sm btn-primary text-white flex items-center gap-1 hover:scale-105 transition"
                      title="Delete Coupon"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs">
          <div className="bg-base-100 rounded-none border border-base-300 shadow-2xl w-11/12 max-w-lg p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider mb-5 text-base-content border-b border-base-200 pb-3">
              {editCouponId ? "Edit Coupon" : "Add New Coupon"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                placeholder="Coupon Code"
                className="input input-bordered w-full"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Discount (%)"
                className="input input-bordered w-full"
                value={formData.discount}
                onChange={(e) =>
                  setFormData({ ...formData, discount: e.target.value })
                }
                min={0}
                max={100}
              />
              <textarea
                placeholder="Coupon Description"
                className="textarea textarea-bordered w-full"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

              {/* Calendar Picker */}
              <div className="relative">
                <FaCalendarAlt className="absolute top-3 left-3 text-primary text-lg pointer-events-none" />
                <DatePicker
                  selected={formData.expiryDate}
                  onChange={(date) =>
                    setFormData({ ...formData, expiryDate: date })
                  }
                  className="input input-bordered w-full pl-10"
                  placeholderText="Select expiry date"
                  minDate={new Date()}
                  dateFormat="dd/MM/yyyy"
                  showPopperArrow={false}
                />
              </div>

              {/*  Availability toggle */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) =>
                    setFormData({ ...formData, available: e.target.checked })
                  }
                  className="checkbox checkbox-primary"
                />
                <span className="label-text text-primary">Available</span>
              </label>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn  btn-primary hover:text-white"
                  disabled={saveCouponMutation.isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveCouponMutation.isLoading}
                  className={`btn btn-primary ${
                    saveCouponMutation.isLoading ? "loading" : ""
                  }`}
                >
                  {saveCouponMutation.isLoading ? "Saving..." : "Save Coupon"}
                </button>
              </div>
            </form>
            <button
              onClick={resetForm}
              className="absolute top-3 right-3 btn text-white"
              title="Close"
              aria-label="Close"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCoupons;
