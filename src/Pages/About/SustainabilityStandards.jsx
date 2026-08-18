import React from "react";
import { FaLeaf, FaSun, FaRecycle, FaPlug } from "react-icons/fa";

const ESGMetrics = [
  {
    icon: FaSun,
    value: "450 kW",
    title: "Rooftop Solar Output",
    desc: "Clean energy powering all common building area lighting and elevator systems.",
  },
  {
    icon: FaRecycle,
    value: "85%",
    title: "Waste Diversion Rate",
    desc: "Comprehensive on-site sorting, composting, and recycling infrastructure.",
  },
  {
    icon: FaPlug,
    value: "100%",
    title: "EV Ready Parking",
    desc: "High-speed Level 2 charging slots available across all resident parking levels.",
  },
  {
    icon: FaLeaf,
    value: "LEED Gold",
    title: "Green Building Standard",
    desc: "Certified energy-efficient insulation, rainwater harvesting, and HVAC filtration.",
  },
];

const SustainabilityStandards = () => {
  return (
    <div className="p-8 md:p-12 bg-base-100 border border-base-content/25 shadow-xs space-y-8 w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-base-content/15 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-base-content/60 block mb-1">
            Environmental Responsibility
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-base-content uppercase tracking-wide">
            Sustainability & Green Architecture
          </h2>
        </div>
        <span className="text-xs font-bold uppercase tracking-widest px-4 py-2 bg-base-content/10 text-base-content border border-base-content/20 flex items-center gap-2">
          <FaLeaf className="text-base-content" /> ESG Certified 2026
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {ESGMetrics.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-6 bg-base-100 border border-base-content/20 shadow-xs hover:border-base-content/60 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 bg-base-content/10 text-base-content border border-base-content/20 flex items-center justify-center text-lg mb-4">
                  <Icon />
                </div>
                <p className="text-3xl font-black text-base-content mb-1">
                  {item.value}
                </p>
                <h3 className="text-sm font-extrabold text-base-content uppercase tracking-wide mb-2">
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

export default SustainabilityStandards;
