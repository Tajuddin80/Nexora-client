import React from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaGift } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loader from "../../../Shared/component/Loader/Loader";

const CouponsSection = () => {
  const axiosSecure = useAxiosSecure();

  //  Fetch coupons
  const {
    data: coupons = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["all-coupons"],
    queryFn: async () => {
      const res = await axiosSecure.get("/coupons");
      return res.data;
    },
  });

  //  Loader state
  if (isLoading) {
    return <Loader />;
  }

  //  Error state
  if (isError) {
    return (
      <section className="my-12 p-6 md:p-10 rounded-2xl shadow-xl bg-base-100">
        <p className="text-red-500">Failed to load coupons: {error.message}</p>
      </section>
    );
  }

  //  Only show available coupons
  const availableCoupons = coupons.filter((c) => c.available === true);

  //  Handle copy
  const handleCopy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: `Coupon "${code}" copied!`,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        background: "#fff",
      });
    } catch (err) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Failed to copy coupon",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        background: "#fff",
      });
    }
  };

  return (
    <section
      className="my-12 p-6 md:p-10 rounded-2xl shadow-xl 
        bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--color-base-100)_90%)]
        text-[color:var(--color-base-content)]
        border-r border-[rgba(0,0,0,0.1)]"
    >
      <div className="flex items-center gap-3 mb-6">
        <FaGift className="text-4xl text-secondary" />
        <h2 className="text-3xl text-secondary md:text-4xl font-bold">
          Special Coupons
        </h2>
      </div>

      {availableCoupons.length === 0 ? (
        <p className="text-center text-base-content">
          No coupons available right now.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {availableCoupons.map((c) => (
            <div
              key={c._id}
              className="
                p-5 rounded-xl shadow-md hover:shadow-2xl transition-transform transform hover:-translate-y-1
                  bg-[color:var(--color-base-100)] text-base-content
              "
            >
              <h3 className="text-xl font-bold">{c.discount}% OFF</h3>
              <p className="text-sm mt-1 opacity-90">{c.description}</p>
              <p className="text-xs mt-1 text-base-content">
                Expiry:{" "}
                {c.expiryDate
                  ? new Date(c.expiryDate).toLocaleDateString()
                  : "N/A"}
              </p>
              <button
                onClick={() => handleCopy(c.code)}
                className="
                  mt-4 w-full p-2 border-dashed border-2 rounded-md font-mono font-semibold
                  transition-all cursor-pointer
                  bg-primary-content/10 hover:bg-primary-content/20 text-base-content
                  border-primary
                "
              >
                {c.code}
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CouponsSection;
