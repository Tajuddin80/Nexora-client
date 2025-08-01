import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";
import Loader from "../../../../Shared/component/Loader/Loader";

const MakePayment = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  // Fetch active agreement for the logged-in user
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

  // Fetch unpaid rent payments for the user
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

  const unpaidMonths = unpaidRents.map((rent) => rent.month);

  // Apply coupon code and set discount percent
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      Swal.fire({ icon: "warning", title: "Please enter a coupon code" });
      return;
    }
    try {
      const res = await axiosSecure.post("/coupons/validate", {
        code: couponCode.trim(),
      });
      if (res.data.valid) {
        setDiscountPercent(res.data.discountPercent);
        Swal.fire({
          icon: "success",
          title: "Coupon Applied!",
          text: `-${res.data.discountPercent}% discount applied.`,
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        setDiscountPercent(0);
        Swal.fire({
          icon: "error",
          title: "Coupon Not Valid",
          text: res.data.message || "Invalid coupon code",
        });
      }
    } catch (err) {
      setDiscountPercent(0);
      Swal.fire({
        icon: "error",
        title: "Coupon Validation Failed",
        text: err?.response?.data?.message || "Please try again later",
      });
    }
  };

  const onSubmit = async (data) => {
    if (!agreement) {
      Swal.fire({ icon: "error", title: "No active agreement found." });
      return;
    }
    if (!stripe || !elements) return;

    // Calculate final amount with discount
    const finalAmount = Math.round(
      agreement.rent - (agreement.rent * discountPercent) / 100
    );

    Swal.fire({
      title: "Confirm Payment",
      html: `<p>Month: <b>${data.month}</b></p><p>Amount: <b>${finalAmount} Tk</b></p>`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Yes, Pay Now",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      setIsProcessing(true);
      setMessage(null);
      setIsError(false);

      const card = elements.getElement(CardElement);
      if (!card) {
        setIsProcessing(false);
        return;
      }

      try {
        // Create payment method
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: "card",
          card,
        });
        if (error) {
          setIsError(true);
          setMessage(error.message);
          setIsProcessing(false);
          return;
        }

        // Create payment intent on backend with coupon and discount info
        const { data: intentRes } = await axiosSecure.post(
          "/create-payment-intent",
          {
            userEmail: user.email,
            apartmentNo: agreement.apartmentNo,
            fullName: user.displayName || "",
            couponCode: couponCode.trim() || null,
            discountPercent,
          }
        );

        const clientSecret = intentRes.clientSecret;

        // Confirm card payment
        const confirmRes = await stripe.confirmCardPayment(clientSecret, {
          payment_method: paymentMethod.id,
        });

        if (confirmRes.error) {
          setIsError(true);
          setMessage(confirmRes.error.message);
          setIsProcessing(false);
          return;
        }

        if (confirmRes.paymentIntent.status === "succeeded") {
          // Mark rent as paid on backend
          const rentRecord = unpaidRents.find((r) => r.month === data.month);
          if (rentRecord) {
            await axiosSecure.patch(`/rent-payments/${rentRecord._id}`, {
              status: "paid",
              transactionId: confirmRes.paymentIntent.id,
              apartmentId: agreement.apartmentNo,
            });
          }

          setIsError(false);
          setMessage("Payment succeeded!");
          Swal.fire({
            title: "Rent Paid Successfully",
            html: `<p class="text-lg">Transaction ID:<br/><strong>${confirmRes.paymentIntent.id}</strong></p>`,
            icon: "success",
            showConfirmButton: true,
          });
          navigate("/dashboard/payment-history");
        }
      } catch (err) {
        console.error("Payment error:", err);
        const errMsg =
          err?.response?.data?.message ||
          err?.message ||
          "Unexpected error occurred.";
        setIsError(true);
        setMessage(errMsg);
      } finally {
        setIsProcessing(false);
      }
    });
  };

  if (agreementLoading) return <Loader />;

  if (!agreement)
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Make Payment</h2>
        <p className="text-red-500">No active agreement found.</p>
      </div>
    );

  const discountedRent = Math.round(
    agreement.rent - (agreement.rent * discountPercent) / 100
  );

  return (
    <div className="p-6 mx-auto bg-base-100 rounded-xl shadow-md ">
      <h2 className="text-3xl font-bold mb-6 text-primary">Make Payment</h2>

      {message && (
        <div
          className={`alert mb-4 ${
            isError ? "alert-error" : "alert-success"
          } shadow-md`}
        >
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-500">
            Member Email
          </label>
          <input
            type="text"
            value={user.email}
            readOnly
            className="input input-bordered w-full"
          />
        </div>

        {/* Floor / Block / Apt */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Floor
            </label>
            <input
              type="text"
              value={agreement.floor}
              readOnly
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Block
            </label>
            <input
              type="text"
              value={agreement.block}
              readOnly
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Apartment No
            </label>
            <input
              type="text"
              value={agreement.apartmentNo}
              readOnly
              className="input input-bordered w-full"
            />
          </div>
        </div>

        {/* Rent */}
        <div>
          <label className="block text-sm font-medium text-gray-500">
            Rent (Tk)
          </label>
          <input
            type="text"
            value={agreement.rent}
            readOnly
            className="input input-bordered w-full"
          />
        </div>

        {/* Month */}
        <div>
          <label className="block text-sm font-medium text-gray-500">
            Month
          </label>
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
            <label className="block text-sm font-medium text-gray-500">
              Coupon Code
            </label>
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
            className="btn bg-primary text-white"
          >
            Apply
          </button>
        </div>

        {/* Card Input */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-500">
            Card Details
          </label>
          <div className="border border-gray-300 rounded-lg p-4 shadow-sm">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "green", // Light gray/white text (visible in dark mode)
                    "::placeholder": {
                      color: "#D1D5DB", // Neutral placeholder
                    },
                    iconColor: "#D1D5DB",
                  },
                  invalid: {
                    color: "#EF4444", // red-500
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Final Rent */}
        <div className="mt-4 p-3 border rounded-lg bg-gray-50">
          <p className="text-sm text-gray-600">Final Rent to Pay</p>
          <p className="text-xl font-bold text-primary">
            {discountedRent.toLocaleString()} Tk
          </p>
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
          disabled={
            isProcessing || unpaidMonths.length === 0 || !stripe || !elements
          }
        >
          {isProcessing
            ? "Processing..."
            : `Pay Now${watch("month") ? ` for ${watch("month")}` : ""}`}
        </button>
      </form>
    </div>
  );
};

export default MakePayment;
