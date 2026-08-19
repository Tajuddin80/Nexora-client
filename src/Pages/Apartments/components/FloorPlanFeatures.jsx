import React from "react";
import { FaCheckCircle, FaRuler, FaLayerGroup, FaDoorOpen } from "react-icons/fa";

const featureGroups = [
  {
    icon: FaRuler,
    category: "Space & Layout",
    items: [
      "Open-concept living room area",
      "High 10ft ceiling clearance",
      "Private balcony skyline view",
      "Walk-in master closet",
    ],
  },
  {
    icon: FaLayerGroup,
    category: "Building Tech",
    items: [
      "Keyless biometric door lock",
      "Integrated solar backup grid",
      "Acoustic soundproof walls",
      "High-speed fiber connection",
    ],
  },
  {
    icon: FaDoorOpen,
    category: "Kitchen & Interior",
    items: [
      "Custom granite countertops",
      "Built-in oven & hood extractor",
      "Modern ceramic bathroom tiles",
      "In-unit washer/dryer hookup",
    ],
  },
];

const FloorPlanFeatures = () => {
  return (
    <div className="my-10 p-6 md:p-10 bg-base-100 text-base-content border border-base-content/25 shadow-xs w-full">
      <div className="text-center w-full mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-base-content/60 block mb-1">
          Standard Specifications
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-base-content uppercase tracking-wide">
          Included Residence Standards
        </h2>
        <p className="text-sm text-base-content/75 mt-2 leading-relaxed font-medium">
          Every apartment unit in NEXORA is crafted with high-grade materials and premium interior finishes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {featureGroups.map((group, idx) => {
          const Icon = group.icon;
          return (
            <div key={idx} className="p-6 bg-base-100 border border-base-content/20 shadow-xs">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-base-content/20">
                <div className="w-10 h-10 bg-base-content/10 text-base-content border border-base-content/20 flex items-center justify-center text-base">
                  <Icon />
                </div>
                <h3 className="text-base font-bold text-base-content uppercase tracking-wide">
                  {group.category}
                </h3>
              </div>

              <ul className="space-y-3">
                {group.items.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2.5 text-xs font-bold text-base-content/90">
                    <FaCheckCircle className="text-base-content/70 text-sm shrink-0 mt-0.5" />
                    <span className="leading-snug">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FloorPlanFeatures;
