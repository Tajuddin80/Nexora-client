import React, { useState, useEffect, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import showToast from "../../../../lib/toast";
import { useNavigate, Link } from "react-router";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";
import Loader from "../../../../Shared/component/Loader/Loader";
import { ThemeContext } from "../../../../AllContext/ThemeContext";
import {
  FaCreditCard,
  FaLock,
  FaBuilding,
  FaLayerGroup,
  FaThLarge,
  FaMoneyBillWave,
  FaEnvelope,
  FaTag,
  FaCalendarAlt,
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";

const MakePayment = ({ publishableKey }) => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const themeContext = useContext(ThemeContext);
  const isDark = themeContext?.theme === "mycustomdark" || themeContext?.theme === "mycustomdark2";

  const stripe = useStripe();
  const elements = useElements();

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const selectedMonth = watch("month");

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
  const { data: unpaidRents = [], isLoading: rentsLoading } = useQuery({
    queryKey: ["unpaid-rents", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/rent-payments/${user.email}?status=unpaid`
      );
      return res.data || [];
    },
    enabled: !!user?.email,
  });

  const currentMonth = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
  const unpaidMonths = unpaidRents.map((rent) => rent.month);
  const monthOptions = unpaidMonths.length > 0 ? unpaidMonths : [currentMonth];

  // Auto-select first unpaid month on load
  useEffect(() => {
    if (monthOptions.length > 0 && !selectedMonth) {
      setValue("month", monthOptions[0]);
    }
  }, [monthOptions, selectedMonth, setValue]);

  // Apply coupon code
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      showToast.warning("Please enter a coupon code.");
      return;
    }
    setIsValidatingCoupon(true);
    try {
      const res = await axiosSecure.post("/coupons/validate", {
        code: couponCode.trim(),
      });
      if (res.data?.valid) {
        setDiscountPercent(res.data.discountPercent || 0);
        setAppliedCoupon(couponCode.trim());
        showToast.success(
          `Coupon Applied! ${res.data.discountPercent}% discount activated.`
        );
      } else {
        setDiscountPercent(0);
        setAppliedCoupon("");
        showToast.error(res.data?.message || "Invalid coupon code.");
      }
    } catch (err) {
      setDiscountPercent(0);
      setAppliedCoupon("");
      showToast.error(
        err?.response?.data?.message || "Failed to validate coupon."
      );
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setAppliedCoupon("");
    setDiscountPercent(0);
    showToast.info?.("Coupon removed") || showToast.success("Coupon removed");
  };

  // Submit payment
  const onSubmit = async (data) => {
    if (!agreement) {
      showToast.error("No active apartment agreement found.");
      return;
    }
    if (!stripe || !elements) {
      showToast.error(
        "Payment gateway is not ready yet. Please ensure your Stripe publishable key is configured."
      );
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      showToast.error("Please enter your card details.");
      return;
    }

    setIsProcessing(true);
    setMessage(null);
    setIsError(false);

    try {
      // 1. Create payment method with CardElement
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card,
      });

      if (pmError) {
        setIsError(true);
        setMessage(pmError.message);
        showToast.error(pmError.message);
        setIsProcessing(false);
        return;
      }

      // 2. Request backend to create Stripe PaymentIntent
      const { data: intentRes } = await axiosSecure.post(
        "/create-payment-intent",
        {
          userEmail: user.email,
          apartmentNo: agreement.apartmentNo,
          fullName: user.displayName || user.name || "Resident Member",
          couponCode: appliedCoupon || null,
          discountPercent,
        }
      );

      const clientSecret = intentRes.clientSecret;
      if (!clientSecret) {
        throw new Error("Unable to retrieve payment client secret from server.");
      }

      // 3. Confirm card payment with Stripe
      const confirmRes = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmRes.error) {
        setIsError(true);
        setMessage(confirmRes.error.message);
        showToast.error(confirmRes.error.message);
        setIsProcessing(false);
        return;
      }

      if (confirmRes.paymentIntent?.status === "succeeded") {
        const transactionId = confirmRes.paymentIntent.id;

        // 4. Record or update rent payment in DB
        const existingRecord = unpaidRents.find((r) => r.month === data.month);
        if (existingRecord) {
          await axiosSecure.patch(`/rent-payments/${existingRecord._id}`, {
            status: "paid",
            transactionId,
            apartmentId: agreement.apartmentNo,
          });
        } else {
          await axiosSecure.post(`/rent-payments`, {
            userEmail: user.email,
            apartmentId: agreement.apartmentNo,
            month: data.month,
            transactionId,
            couponCode: appliedCoupon || null,
          });
        }

        // Invalidate queries so dashboards immediately refresh
        queryClient.invalidateQueries({ queryKey: ["unpaid-rents", user?.email] });
        queryClient.invalidateQueries({ queryKey: ["paid-rents", user?.email] });

        setIsError(false);
        setMessage("Payment processed successfully!");
        showToast.success(`Rent Paid! Transaction ID: ${transactionId}`);
        navigate("/dashboard/payment-history");
      }
    } catch (err) {
      console.error("Payment error:", err);
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        "An unexpected error occurred while processing payment.";
      setIsError(true);
      setMessage(errMsg);
      showToast.error(errMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  if (agreementLoading || rentsLoading) {
    return <Loader />;
  }

  // If resident has no active accepted agreement
  if (!agreement) {
    return (
      <div className="max-w-4xl mx-auto p-6 md:p-10">
        <div className="bg-base-100 border border-base-300 rounded-2xl shadow-xl p-8 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-warning/15 flex items-center justify-center text-warning text-4xl">
            <FaExclamationTriangle />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-base-content">
              No Active Agreement Found
            </h2>
            <p className="text-base-content/70 max-w-md mx-auto">
              You must have an approved apartment lease agreement with "accepted"
              status before you can make rent payments.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link to="/apartments" className="btn btn-primary">
              <FaBuilding /> Browse Available Apartments
            </Link>
            <Link to="/dashboard/my-profile" className="btn btn-outline">
              Check Application Status
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate pricing breakdown
  const baseRent = agreement.rent || 0;
  const discountAmount = Math.round((baseRent * discountPercent) / 100);
  const finalRent = Math.max(0, baseRent - discountAmount);

  // Values automatically filled from accepted agreement
  const floorVal = agreement.floorNo ?? agreement.floor ?? "N/A";
  const blockVal = agreement.blockName ?? agreement.block ?? "N/A";
  const aptNoVal = agreement.apartmentNo ?? "N/A";

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-base-300 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-base-content">
              Make Rent Payment
            </h1>
            <span className="badge badge-success badge-sm gap-1 font-semibold">
              <FaCheckCircle className="text-xs" /> Lease Active
            </span>
          </div>
          <p className="text-sm text-base-content/70 mt-1">
            Apartment details are automatically populated from your active lease
            agreement. Review the details, enter your card, and pay securely via
            Stripe.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-base-content/60 bg-base-200/80 px-3 py-2 rounded-lg self-start md:self-auto">
          <FaShieldAlt className="text-primary text-base" />
          <span>256-Bit SSL Encrypted Payment</span>
        </div>
      </div>

      {/* Alert banner for error or success */}
      {message && (
        <div
          className={`alert ${
            isError ? "alert-error text-white" : "alert-success text-white"
          } shadow-lg rounded-xl flex items-center gap-3`}
        >
          {isError ? <FaExclamationTriangle /> : <FaCheckCircle />}
          <span className="font-medium">{message}</span>
        </div>
      )}

      {/* Publishable key missing setup notice */}
      {!publishableKey && (
        <div className="alert alert-warning shadow-md rounded-xl text-warning-content">
          <FaInfoCircle className="text-xl shrink-0" />
          <div>
            <h4 className="font-bold">Stripe Publishable Key Required</h4>
            <p className="text-xs mt-0.5">
              To process live or test card payments, add{" "}
              <code className="bg-base-100 px-1 py-0.5 rounded text-base-content font-mono font-bold">
                VITE_PAYMENT_PUBLISH_KEY=pk_test_...
              </code>{" "}
              in your <code className="font-mono font-bold">Nexora-client/.env</code>{" "}
              file. The apartment details below are fully loaded and read-only.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Section 1: Read-Only Apartment & Member Information */}
        <div className="bg-base-100 border border-base-300 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-base-200 pb-4">
            <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
              <FaBuilding className="text-primary" /> Apartment & Lease
              Information
            </h3>
            <span className="badge badge-outline gap-1 text-xs text-base-content/70">
              <FaLock className="text-[10px]" /> Auto-Filled & Read-Only
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Member Email */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-base-content/70 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FaEnvelope className="text-primary" /> Member Email
                </span>
                <span className="text-[10px] text-base-content/50 flex items-center gap-1">
                  <FaLock className="text-[9px]" /> Read-Only
                </span>
              </label>
              <input
                type="email"
                value={user?.email || ""}
                readOnly
                aria-label="Member Email"
                className="input input-bordered w-full bg-base-200/70 border-base-300 text-base-content font-medium cursor-not-allowed select-none"
              />
            </div>

            {/* Floor */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-base-content/70 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FaLayerGroup className="text-primary" /> Floor No
                </span>
                <span className="text-[10px] text-base-content/50 flex items-center gap-1">
                  <FaLock className="text-[9px]" /> Read-Only
                </span>
              </label>
              <input
                type="text"
                value={floorVal}
                readOnly
                aria-label="Floor Number"
                className="input input-bordered w-full bg-base-200/70 border-base-300 text-base-content font-medium cursor-not-allowed select-none"
              />
            </div>

            {/* Block */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-base-content/70 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FaThLarge className="text-primary" /> Block
                </span>
                <span className="text-[10px] text-base-content/50 flex items-center gap-1">
                  <FaLock className="text-[9px]" /> Read-Only
                </span>
              </label>
              <input
                type="text"
                value={blockVal}
                readOnly
                aria-label="Block Name"
                className="input input-bordered w-full bg-base-200/70 border-base-300 text-base-content font-medium cursor-not-allowed select-none"
              />
            </div>

            {/* Apartment No */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-base-content/70 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FaBuilding className="text-primary" /> Apartment No
                </span>
                <span className="text-[10px] text-base-content/50 flex items-center gap-1">
                  <FaLock className="text-[9px]" /> Read-Only
                </span>
              </label>
              <input
                type="text"
                value={aptNoVal}
                readOnly
                aria-label="Apartment Number"
                className="input input-bordered w-full bg-base-200/70 border-base-300 text-base-content font-medium cursor-not-allowed select-none"
              />
            </div>

            {/* Monthly Rent (Tk) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-base-content/70 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FaMoneyBillWave className="text-primary" /> Monthly Base Rent
                </span>
                <span className="text-[10px] text-base-content/50 flex items-center gap-1">
                  <FaLock className="text-[9px]" /> Read-Only
                </span>
              </label>
              <input
                type="text"
                value={`${baseRent.toLocaleString()} Tk`}
                readOnly
                aria-label="Monthly Rent"
                className="input input-bordered w-full bg-base-200/70 border-base-300 text-base-content font-semibold cursor-not-allowed select-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Month & Coupon */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Month Selector */}
          <div className="bg-base-100 border border-base-300 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-base-content flex items-center gap-2">
              <FaCalendarAlt className="text-primary" /> Select Billing Month
            </h3>
            <div className="space-y-2">
              <label className="text-xs font-medium text-base-content/70">
                Choose the month you are paying for
              </label>
              <select
                {...register("month", { required: "Please select a billing month" })}
                className="select select-bordered w-full text-base font-medium focus:select-primary"
              >
                {monthOptions.map((month) => (
                  <option key={month} value={month}>
                    {month} {unpaidMonths.includes(month) ? "(Unpaid Bill)" : ""}
                  </option>
                ))}
              </select>
              {errors.month && (
                <p className="text-error text-xs font-medium">
                  {errors.month.message}
                </p>
              )}
            </div>
            {unpaidMonths.length > 0 && (
              <p className="text-xs text-warning flex items-center gap-1.5 pt-1">
                <FaInfoCircle /> You have {unpaidMonths.length} unpaid billing
                month{unpaidMonths.length > 1 ? "s" : ""}.
              </p>
            )}
          </div>

          {/* Coupon Code Section */}
          <div className="bg-base-100 border border-base-300 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-base-content flex items-center gap-2">
              <FaTag className="text-primary" /> Promotional Coupon
            </h3>
            <div className="space-y-2">
              <label className="text-xs font-medium text-base-content/70">
                Have a discount coupon? Enter it below:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. NEXORA10"
                  value={couponCode}
                  disabled={!!appliedCoupon}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="input input-bordered flex-1 uppercase font-semibold tracking-wider text-base focus:input-primary"
                />
                {appliedCoupon ? (
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="btn btn-outline btn-error"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={isValidatingCoupon || !couponCode.trim()}
                    className="btn btn-primary"
                  >
                    {isValidatingCoupon ? "Validating..." : "Apply"}
                  </button>
                )}
              </div>
            </div>

            {discountPercent > 0 && (
              <div className="p-3 bg-success/10 border border-success/20 rounded-xl flex items-center justify-between text-success text-sm font-medium">
                <span className="flex items-center gap-1.5">
                  <FaCheckCircle /> Coupon "{appliedCoupon}" Applied
                </span>
                <span className="badge badge-success text-white font-bold">
                  -{discountPercent}% OFF
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Cost Breakdown & Stripe Card Input */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Card Payment Input (7 cols) */}
          <div className="lg:col-span-7 bg-base-100 border border-base-300 rounded-2xl p-6 md:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-base-200 pb-4">
              <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
                <FaCreditCard className="text-primary" /> Payment Method
              </h3>
              <div className="flex items-center gap-1 text-xs text-base-content/60">
                <span className="font-semibold text-primary">Stripe</span>
                <span>Secure</span>
              </div>
            </div>

            <p className="text-xs text-base-content/70">
              Enter your credit or debit card number, expiration date, and CVC.
              Your card credentials never touch our servers.
            </p>

            {/* Stripe CardElement Container */}
            <div className="p-4 border-2 border-base-300 rounded-xl focus-within:border-primary transition-all bg-base-200/40">
              {publishableKey && stripe ? (
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        fontWeight: "500",
                        fontFamily: "'Inter', sans-serif",
                        color: isDark ? "#F3F4F6" : "#1F2937",
                        "::placeholder": {
                          color: isDark ? "#9CA3AF" : "#6B7280",
                        },
                        iconColor: isDark ? "#60A5FA" : "#2563EB",
                      },
                      invalid: {
                        color: "#EF4444",
                        iconColor: "#EF4444",
                      },
                    },
                  }}
                />
              ) : (
                <div className="py-2 text-center text-sm text-base-content/60">
                  <p className="font-medium text-warning flex items-center justify-center gap-2">
                    <FaExclamationTriangle /> Stripe Card Input Pending Configuration
                  </p>
                  <p className="text-xs text-base-content/50 mt-1">
                    Add your Stripe publishable key to enable the interactive card form.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-base-content/50 pt-2">
              <span className="flex items-center gap-1">
                <FaLock className="text-[10px]" /> End-to-end tokenized via Stripe
              </span>
              <span>Test cards supported (e.g. 4242...)</span>
            </div>
          </div>

          {/* Pricing Summary Card (5 cols) */}
          <div className="lg:col-span-5 bg-base-100 border border-base-300 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-lg font-bold text-base-content border-b border-base-200 pb-4 flex items-center gap-2">
                <FaMoneyBillWave className="text-primary" /> Payment Summary
              </h3>

              <div className="divide-y divide-base-200 text-sm mt-4">
                <div className="py-3 flex justify-between text-base-content/80">
                  <span>Apartment</span>
                  <span className="font-semibold text-base-content">
                    {aptNoVal} (Block {blockVal}, Fl {floorVal})
                  </span>
                </div>
                <div className="py-3 flex justify-between text-base-content/80">
                  <span>Billing Month</span>
                  <span className="font-semibold text-base-content">
                    {selectedMonth || monthOptions[0]}
                  </span>
                </div>
                <div className="py-3 flex justify-between text-base-content/80">
                  <span>Standard Monthly Rent</span>
                  <span className="font-medium text-base-content">
                    {baseRent.toLocaleString()} Tk
                  </span>
                </div>
                {discountPercent > 0 && (
                  <div className="py-3 flex justify-between text-success">
                    <span>Coupon Discount ({discountPercent}%)</span>
                    <span className="font-semibold">
                      -{discountAmount.toLocaleString()} Tk
                    </span>
                  </div>
                )}
                <div className="pt-4 flex justify-between items-baseline">
                  <span className="text-base font-bold text-base-content">
                    Total Payable
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-primary">
                      {finalRent.toLocaleString()} Tk
                    </span>
                    <p className="text-[10px] text-base-content/50">
                      Inclusive of all maintenance & utilities
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit / Pay Button */}
            <button
              type="submit"
              disabled={
                isProcessing ||
                !stripe ||
                !elements ||
                !publishableKey ||
                !agreement
              }
              className="btn btn-primary w-full text-base font-bold shadow-lg gap-2 mt-4"
            >
              {isProcessing ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Processing Payment...
                </>
              ) : (
                <>
                  <FaCreditCard />
                  Pay {finalRent.toLocaleString()} Tk Now
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MakePayment;
