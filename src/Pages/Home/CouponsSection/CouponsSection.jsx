
import React from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaGift } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loader from "../../../Shared/component/Loader/Loader";

const CouponsSection = () => {
  const axiosSecure = useAxiosSecure();
  // ✅ Fetch coupons from backend
  const { data: coupons = [], isLoading, isError, error } = useQuery({
    queryKey: ["all-coupons"],
    queryFn: async () => {
      const res = await axiosSecure.get("/coupons");
      return res.data;
    },
  });

if (isLoading) {
  return <Loader></Loader>
}
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

  if (isLoading) {
    return (
      <section className="my-12 p-6 md:p-10 rounded-2xl shadow-xl bg-base-100">
        <p>Loading coupons...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="my-12 p-6 md:p-10 rounded-2xl shadow-xl bg-base-100">
        <p className="text-red-500">Failed to load coupons: {error.message}</p>
      </section>
    );
  }

  return (
    <section
      className="my-12 p-6 md:p-10 rounded-2xl shadow-xl 
        bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--color-base-100)_90%)]
        text-[color:var(--color-base-content)]
        border-r border-[rgba(0,0,0,0.1)]"
    >
      <div className="flex items-center gap-3 mb-6">
        <FaGift className="text-4xl" />
        <h2 className="text-3xl md:text-4xl font-bold"> Special Coupons</h2>
      </div>

      {coupons.length === 0 ? (
        <p>No coupons available right now.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {coupons.map((c) => (
            <div
              key={c._id}
              className="p-5 rounded-xl bg-white text-secondary shadow-md hover:shadow-2xl transition-transform transform hover:-translate-y-1"
            >
              <h3 className="text-xl font-bold text-primary">
                {c.discount}% OFF
              </h3>
              <p className="text-sm mt-1">{c.description}</p>
              <button
                onClick={() => handleCopy(c.code)}
                className="mt-4 w-full p-2 border-dashed cursor-copy border-2 border-primary rounded-md text-center font-mono font-semibold text-primary bg-primary/5 hover:bg-primary/10 transition-all"
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
