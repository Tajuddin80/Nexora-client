import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
// import RentStatusMonitor from "../MyProfile/RentStatusMonitor";
import Loader from "../../../Shared/component/Loader/Loader";

const allMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MakePayment = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // ✅ Fetch the active agreement
  const { data: agreement, isLoading: agreementLoading } = useQuery({
    queryKey: ["accepted-agreement", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/agreements/user/${user.email}?status=accepted`
      );
      return res.data?.[0] || null;
    },
    enabled: !!user?.email,
  });

  // ✅ Fetch unpaid months for this user
  const { data: unpaidRents = [] } = useQuery({
    queryKey: ["unpaid-rents", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/rent-payments/${user.email}?status=unpaid`
      );
      return res.data || [];
    },
    enabled: !!user?.email,
  });

  // derive months that are unpaid
  const unpaidMonths = unpaidRents.map((rent) => rent.month);

  // ✅ Validate coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      Swal.fire({
        icon: "warning",
        title: "⚠️ Please enter a coupon code",
      });
      return;
    }
    try {
      const res = await axiosSecure.post("/coupons/validate", { code: couponCode });
      if (res.data.valid) {
        setDiscountPercent(res.data.discountPercent);
        Swal.fire({
          icon: "success",
          title: "✅ Coupon Applied!",
          text: `-${res.data.discountPercent}% discount applied.`,
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        setDiscountPercent(0);
        Swal.fire({
          icon: "error",
          title: "❌ Coupon Not Valid",
          text: res.data.message || "Invalid coupon code",
        });
      }
    } catch (err) {
      setDiscountPercent(0);
      Swal.fire({
        icon: "error",
        title: "❌ Coupon Validation Failed",
        text: err?.response?.data?.message || "Please try again later",
      });
    }
  };

  // ✅ Mutation for making payment
  const payMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await axiosSecure.post(`/rent-payments`, payload);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Payment Successful!",
        timer: 2000,
        showConfirmButton: false,
      });
      queryClient.invalidateQueries(["unpaid-rents"]);
    },
    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: err?.response?.data?.message || "Please try again later",
      });
    },
  });

  // ✅ On form submit
  const onSubmit = (data) => {
    if (!agreement) {
      Swal.fire({ icon: "error", title: "No active agreement found." });
      return;
    }

    const finalAmount = Math.round(
      agreement.rent - (agreement.rent * discountPercent) / 100
    );

    Swal.fire({
      title: "Confirm Payment",
      html: `<p>Month: <b>${data.month}</b></p><p>Amount: <b>${finalAmount} Tk</b></p>`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Yes, Pay Now",
    }).then((result) => {
      if (result.isConfirmed) {
        payMutation.mutate({
          userEmail: user.email,
          apartmentId: agreement._id,
          month: data.month,
          amount: finalAmount,
        });
      }
    });
  };

  if (agreementLoading) return <Loader></Loader>
  if (!agreement)
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Make Payment</h2>
        <p className="text-red-500"> No active agreement found.</p>
      </div>
    );

  const discountedRent = Math.round(
    agreement.rent - (agreement.rent * discountPercent) / 100
  );

  return (
    <div className="p-6  mx-auto bg-base-100 rounded-xl shadow-md">
      {/* <RentStatusMonitor /> */}
      <h2 className="text-3xl font-bold mb-6 text-primary"> Make Payment</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-500">Member Email</label>
          <input
            type="text"
            value={user.email}
            readOnly
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        {/* Floor, Block, Apartment */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Floor</label>
            <input
              type="text"
              value={agreement.floor}
              readOnly
              className="input input-bordered w-full bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Block</label>
            <input
              type="text"
              value={agreement.block}
              readOnly
              className="input input-bordered w-full bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Apartment No</label>
            <input
              type="text"
              value={agreement.apartmentNo}
              readOnly
              className="input input-bordered w-full bg-gray-100"
            />
          </div>
        </div>

        {/* Rent */}
        <div>
          <label className="block text-sm font-medium text-gray-500">Rent (Tk)</label>
          <input
            type="text"
            value={agreement.rent}
            readOnly
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        {/* Month */}
        <div>
          <label className="block text-sm font-medium text-gray-500">Month</label>
          <select
            {...register("month", { required: "Month is required" })}
            className="select select-bordered w-full"
          >
            <option value="">Select Month</option>
            {unpaidMonths.length > 0 ? (
              unpaidMonths.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))
            ) : (
              <option disabled>No unpaid months</option>
            )}
          </select>
          {errors.month && (
            <p className="text-red-500 text-sm">{errors.month.message}</p>
          )}
        </div>

        {/* Coupon */}
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-500">Coupon Code</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon"
            />
          </div>
          <button
            type="button"
            onClick={handleApplyCoupon}
            disabled={!agreement}
            className="btn bg-secondary hover:bg-secondary/80 text-white"
          >
            Apply
          </button>
        </div>

        {/* Final Rent */}
        <div className="mt-4 p-3 border rounded-lg bg-gray-50">
          <p className="text-sm text-gray-600">Final Rent to Pay</p>
          <p className="text-xl font-bold text-primary">{discountedRent} Tk</p>
          {discountPercent > 0 && (
            <p className="text-green-600 text-sm">
              Coupon applied: -{discountPercent}% off
            </p>
          )}
        </div>

        {/* Pay Button */}
        <button
          type="submit"
          className="btn btn-primary mt-6 w-full text-lg"
          disabled={payMutation.isLoading || unpaidMonths.length === 0}
        >
          {payMutation.isLoading ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
};

export default MakePayment;
