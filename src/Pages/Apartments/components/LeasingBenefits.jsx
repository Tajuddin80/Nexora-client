import React from "react";
import {
  FaDollarSign,
  FaShieldAlt,
  FaFileContract,
  FaClock,
  FaBolt,
} from "react-icons/fa";

const benefits = [
  {
    icon: FaDollarSign,
    title: "100% Transparent Rent",
    desc: "Zero hidden fees or administrative surprises. Clear monthly rental breakdown with instant digital invoicing.",
  },
  {
    icon: FaShieldAlt,
    title: "Verified Specifications",
    desc: "Every listing includes verified floor plan measurements, photo galleries, and video tour previews.",
  },
  {
    icon: FaFileContract,
    title: "Digital Agreement & Sign",
    desc: "Apply online in minutes. Receive real-time admin approval updates directly on your dashboard.",
  },
  {
    icon: FaClock,
    title: "24/7 Concierge & Repairs",
    desc: "Submit emergency maintenance tickets 24/7 with rapid on-site technician response.",
  },
];

const LeasingBenefits = () => {
  return (
    <div className="my-10 p-6 md:p-10 bg-base-100 text-base-content border border-base-content/25 shadow-xs w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-4 border-b border-base-content/20">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-base-content/60 block mb-1">
            Exclusive Tenant Perks
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-base-content uppercase tracking-wide">
            Why Lease With NEXORA?
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-base-content/80">
          <FaBolt className="text-base-content" /> Instant Digital Application
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {benefits.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-6 bg-base-100 border border-base-content/20 shadow-xs hover:border-base-content/60 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-11 h-11 bg-base-content/10 text-base-content border border-base-content/20 flex items-center justify-center text-lg mb-4">
                  <Icon />
                </div>

                <h3 className="text-base font-extrabold text-base-content uppercase tracking-wide mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-base-content/75 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeasingBenefits;
