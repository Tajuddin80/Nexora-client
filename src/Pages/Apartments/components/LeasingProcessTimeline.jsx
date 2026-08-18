import React from "react";
import { FaFileAlt, FaUserCheck, FaCreditCard, FaKey } from "react-icons/fa";

const steps = [
  {
    step: "Step 01",
    title: "Select & View Specifications",
    desc: "Browse unit photos, verified floor plans, and square footage measurements.",
    icon: FaFileAlt,
  },
  {
    step: "Step 02",
    title: "Digital Agreement Submission",
    desc: "Accept lease conditions and submit your agreement request for Admin review.",
    icon: FaUserCheck,
  },
  {
    step: "Step 03",
    title: "Admin Verification & Approval",
    desc: "Application is reviewed by management. Status updates live on your dashboard.",
    icon: FaUserCheck,
  },
  {
    step: "Step 04",
    title: "Online Stripe Rent Payment",
    desc: "Complete rent payment securely online to activate resident dashboard access.",
    icon: FaCreditCard,
  },
];

const LeasingProcessTimeline = () => {
  return (
    <div className="my-10 p-6 md:p-10 bg-base-100 text-base-content border border-base-content/25 shadow-xs w-full">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-base-content/60 block mb-1">
          Guaranteed Transparency
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-base-content uppercase tracking-wide">
          4-Step Digital Leasing Timeline
        </h2>
        <p className="text-sm text-base-content/75 mt-2 leading-relaxed font-medium">
          From application submission to keyless entry, our rental process is 100% paperless and real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-6 bg-base-100 border border-base-content/20 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-base-content/10 text-base-content border border-base-content/20 flex items-center justify-center text-base">
                    <Icon />
                  </div>
                  <span className="text-xs font-black text-base-content/30 uppercase tracking-widest">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-base-content uppercase tracking-wide mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-base-content/75 leading-relaxed font-medium">
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

export default LeasingProcessTimeline;
