import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FaGift, FaCopy, FaCheckCircle, FaInfinity } from "react-icons/fa";
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
      <section className="my-10 p-6 md:p-10 bg-base-100 text-base-content border border-base-content/25 shadow-xs">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-base-content/15">
          <div className="w-10 h-10 bg-base-content/10 text-base-content border border-base-content/20 flex items-center justify-center text-lg">
            <FaGift />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-base-content/60 block mb-0.5">
              Exclusive Savings
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-base-content uppercase tracking-wide">
              Special Discount Coupons
            </h2>
          </div>
        </div>
        <p className="text-center text-base-content/75 font-medium py-4">
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
    <section className="my-10 p-6 md:p-10 bg-base-100 text-base-content border border-base-content/25 shadow-xs w-full">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-4 border-b border-base-content/15">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 bg-base-content/10 text-base-content border border-base-content/20 flex items-center justify-center text-xl shrink-0">
            <FaGift />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-base-content/60 block mb-0.5">
              Exclusive Tenant Offers
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-base-content uppercase tracking-wide">
              Special Discount Coupons
            </h2>
          </div>
        </div>
        <span className="px-4 py-2 bg-base-content/10 text-base-content text-xs font-black uppercase tracking-widest border border-base-content/20 shrink-0">
          {availableCoupons.length} Active Offers
        </span>
      </div>

      {availableCoupons.length === 0 ? (
        <p className="text-center text-base-content/75 font-medium py-8">
          No active discount coupons available right now.
        </p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
          {availableCoupons.map((c) => {
            const isLifetime =
              !c.expiryDate ||
              new Date(c.expiryDate).getFullYear() >= 2090 ||
              c.description.toLowerCase().includes("lifetime");

            return (
              <div
                key={c._id}
                className="p-6 bg-base-100 border border-base-content/20 shadow-xs hover:border-base-content/60 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Badge Strip */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-base-content/15">
                    <span className="text-2xl font-black text-base-content tracking-tight">
                      {c.discount}% OFF
                    </span>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 bg-base-content/10 text-base-content border border-base-content/20 flex items-center gap-1">
                      {isLifetime ? (
                        <>
                          <FaInfinity className="text-xs text-base-content" /> Lifetime Limit
                        </>
                      ) : (
                        <>
                          <FaCheckCircle className="text-xs text-base-content" /> Verified
                        </>
                      )}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-base-content/85 font-medium leading-relaxed mb-4">
                    {c.description}
                  </p>

                  {/* Validity Info */}
                  <p className="text-xs text-base-content/60 font-bold uppercase tracking-wider mb-6">
                    Validity:{" "}
                    {isLifetime ? (
                      <span className="text-base-content font-black">Lifetime Unlimited</span>
                    ) : (
                      <span>Expires {new Date(c.expiryDate).toLocaleDateString()}</span>
                    )}
                  </p>
                </div>

                {/* Copy Button */}
                <button
                  onClick={() => handleCopy(c.code)}
                  className="w-full py-3 px-4 border border-dashed border-base-content/50 bg-base-content/5 hover:bg-base-content hover:text-base-100 transition-all cursor-pointer font-mono font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 text-base-content rounded-none"
                  title="Click to Copy Code"
                >
                  <FaCopy className="text-xs" /> {c.code}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default CouponsSection;
