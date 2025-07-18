import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageCoupons = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    description: "",
  });

  // ✅ Fetch all coupons
  const { data: coupons = [], isLoading, isError, error } = useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      const res = await axiosSecure.get("/coupons");
      return res.data;
    },
  });

  // ✅ Mutation for adding coupon
  const addCouponMutation = useMutation({
    mutationFn: async (newCoupon) => {
      const res = await axiosSecure.post("/coupons", newCoupon);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["coupons"]);
      Swal.fire({
        icon: "success",
        title: "Coupon added successfully!",
        timer: 1500,
        showConfirmButton: false,
      });
      setShowModal(false);
      setFormData({ code: "", discount: "", description: "" });
    },
    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: "Failed to add coupon",
        text: err?.response?.data?.message || "Something went wrong",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.code || !formData.discount || !formData.description) {
      Swal.fire({
        icon: "warning",
        title: "All fields are required",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }
    addCouponMutation.mutate({
      code: formData.code,
      discount: Number(formData.discount),
      description: formData.description,
      createdAt: new Date(),
    });
  };

  if (isLoading) return <div className="p-4">Loading coupons...</div>;
  if (isError) return <div className="p-4 text-red-500">Error: {error.message}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Coupons</h2>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary px-4 py-2"
        >
          Add Coupon
        </button>
      </div>

      {/* ✅ Table for coupons */}
      {coupons.length === 0 ? (
        <p>No coupons found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Coupon Code</th>
                <th>Discount (%)</th>
                <th>Description</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon._id}>
                  <td>{coupon.code}</td>
                  <td>{coupon.discount}</td>
                  <td>{coupon.description}</td>
                  <td>{new Date(coupon.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ Modal */}
      {showModal && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Add New Coupon</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                />
                <textarea
                  placeholder="Coupon Description"
                  className="textarea textarea-bordered w-full"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                ></textarea>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={addCouponMutation.isLoading}
                  >
                    {addCouponMutation.isLoading ? "Saving..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageCoupons;
