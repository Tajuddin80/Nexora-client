import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FaGift, FaCopy } from "react-icons/fa";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import Loader from "../../../Shared/component/Loader/Loader";
import showToast from "../../../lib/toast";

const CouponsSection = () => {
  const axiosPublic = useAxiosPublic();

  // Fetch coupons
  const {
    data: coupons = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["all-coupons"],
    queryFn: async () => {
      const res = await axiosPublic.get("/coupons");
      return res.data;
    },
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <section className="my-10 p-6 md:p-10 bg-base-100 text-base-content border border-base-content/20 shadow-xs">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-base-content/10">
          <FaGift className="text-3xl text-base-content" />
          <h2 className="text-2xl md:text-3xl font-black text-base-content uppercase tracking-wide">
            Special Discounts & Coupons
          </h2>
        </div>
        <p className="text-center text-base-content/75 font-medium">
          No coupons available right now. Check back later!
        </p>
      </section>
    );
  }

  const availableCoupons = coupons.filter((c) => c.available === true);

  const handleCopy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      showToast.success(`Coupon code "${code}" copied to clipboard!`);
    } catch (err) {
      showToast.error("Failed to copy coupon code.");
    }
  };

  return (
    <section className="my-10 p-6 md:p-10 bg-base-100 text-base-content border border-base-content/20 shadow-xs">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-4 border-b border-base-content/10">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-base-content/60 block mb-1">
            Exclusive Savings
          </span>
          <div className="flex items-center gap-3">
            <FaGift className="text-3xl text-base-content" />
            <h2 className="text-2xl md:text-3xl font-black text-base-content uppercase tracking-wide">
              Special Discount Coupons
            </h2>
          </div>
        </div>
        <span className="px-3 py-1 bg-base-content text-base-100 text-xs font-bold uppercase tracking-widest">
          {availableCoupons.length} Active Offers
        </span>
      </div>

      {availableCoupons.length === 0 ? (
        <p className="text-center text-base-content/75 font-medium py-4">
          No active discount coupons available right now.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {availableCoupons.map((c) => (
            <div
              key={c._id}
              className="p-6 bg-base-100 border border-base-content/20 shadow-xs hover:border-base-content transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-black text-base-content uppercase">
                    {c.discount}% OFF
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-base-content text-base-100">
                    Verified
                  </span>
                </div>
                <p className="text-sm text-base-content/80 font-medium leading-relaxed mb-2">
                  {c.description}
                </p>
                <p className="text-xs text-base-content/60 font-semibold mb-4">
                  Expires:{" "}
                  {c.expiryDate
                    ? new Date(c.expiryDate).toLocaleDateString()
                    : "Limited Time"}
                </p>
              </div>

              <button
                onClick={() => handleCopy(c.code)}
                className="w-full py-2.5 px-4 border-2 border-dashed border-base-content bg-base-content/5 hover:bg-base-content hover:text-base-100 transition-all cursor-pointer font-mono font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 text-base-content"
                title="Click to Copy Code"
              >
                <FaCopy className="text-xs" /> {c.code}
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CouponsSection;
