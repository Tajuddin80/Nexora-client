import React from "react";
import { Link } from "react-router";
import {
  FaSearch,
  FaFileContract,
  FaKey,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

const steps = [
  {
    step: "01",
    icon: FaSearch,
    title: "Browse Apartments",
    description:
      "Explore available units by rent, floor, and room count. Apply exclusive promotional coupon codes to save on rent.",
    highlights: ["Filter by rent & space", "Valid coupon discounts", "Verified unit specs"],
  },
  {
    step: "02",
    icon: FaFileContract,
    title: "Submit Online Request",
    description:
      "Fill out the seamless digital agreement form directly from your dashboard without paperwork hassle.",
    highlights: ["100% Paperless process", "Instant tracking status", "Secure data privacy"],
  },
  {
    step: "03",
    icon: FaKey,
    title: "Get Key & Move In",
    description:
      "Once approved by admin, pay rent online via Stripe and receive instant access to your apartment dashboard.",
    highlights: ["Stripe secure checkout", "Digital keyless access", "Full resident portal"],
  },
];

const HowItWorks = () => {
  return (
    <section className="my-12 p-6 md:p-10 bg-base-100 text-base-content border border-base-content/25 shadow-xs">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-base-content/60 block mb-1">
          Simple Digital Process
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-base-content uppercase tracking-wide mb-3">
          How Living at NEXORA Works
        </h2>
        <p className="text-sm text-base-content/75 leading-relaxed font-medium">
          Renting your dream apartment is simple, quick, and completely digital. 
          Follow three easy steps to join our vibrant resident community.
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {steps.map((item, index) => {
          const IconComp = item.icon;
          return (
            <div
              key={index}
              className="p-6 bg-base-100 border border-base-content/20 shadow-xs hover:border-base-content/60 transition-all flex flex-col justify-between"
            >
              {/* Step Number Tag */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 bg-base-content/10 text-base-content border border-base-content/20 flex items-center justify-center text-lg">
                  <IconComp />
                </div>
                <span className="text-3xl font-black text-base-content/20">
                  {item.step}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-base-content uppercase tracking-wide mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-base-content/75 leading-relaxed mb-6 font-medium">
                  {item.description}
                </p>

                {/* Highlights List */}
                <ul className="space-y-2.5 mb-4">
                  {item.highlights.map((point, pIdx) => (
                    <li
                      key={pIdx}
                      className="flex items-center gap-2 text-xs font-bold text-base-content/80"
                    >
                      <FaCheckCircle className="text-base-content/70 text-sm flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Footer - Theme-aware non-glaring banner */}
      <div className="p-6 md:p-8 bg-base-100 text-base-content border border-base-content/30 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-lg md:text-xl font-bold text-base-content uppercase tracking-wide">
            Ready to find your next home?
          </h4>
          <p className="text-sm text-base-content/80 mt-1 font-medium">
            Browse our available apartment units and claim limited-time coupon discounts today.
          </p>
        </div>
        <Link
          to="/apartments"
          className="btn bg-base-content text-base-100 hover:bg-base-content/80 rounded-none text-xs font-bold uppercase tracking-wider px-6 py-3 border-none shrink-0 flex items-center gap-2"
        >
          Explore Apartments <FaArrowRight className="text-xs" />
        </Link>
      </div>
    </section>
  );
};

export default HowItWorks;
