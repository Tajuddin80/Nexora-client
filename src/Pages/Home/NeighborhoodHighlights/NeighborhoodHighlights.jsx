import React from "react";
import {
  FaSubway,
  FaShoppingBag,
  FaPlane,
  FaGraduationCap,
  FaCoffee,
  FaTree,
  FaMapMarkerAlt,
} from "react-icons/fa";

const places = [
  {
    icon: FaSubway,
    category: "Transit Hub",
    title: "Central Metro Station",
    distance: "3 Mins Walk (250m)",
    desc: "Direct rapid access to financial district & international tech corridor.",
  },
  {
    icon: FaShoppingBag,
    category: "Retail & Dining",
    title: "NEXORA Galleria Plaza",
    distance: "Adjacent (1 Min)",
    desc: "Organic grocery markets, artisanal cafes, fine dining, and boutique retail.",
  },
  {
    icon: FaTree,
    category: "Recreation",
    title: "Metropolitan Central Park",
    distance: "5 Mins Walk (400m)",
    desc: "150 acres of urban parkland, running trails, and botanical gardens.",
  },
  {
    icon: FaCoffee,
    category: "Co-Working & Cafes",
    title: "Innovators Hub & Roastery",
    distance: "2 Mins Walk (150m)",
    desc: "High-speed workspace cafes for remote executives and digital nomads.",
  },
  {
    icon: FaGraduationCap,
    category: "Education",
    title: "University Quarter",
    distance: "8 Mins Transit",
    desc: "Leading medical research institute and postgraduate academic centers.",
  },
  {
    icon: FaPlane,
    category: "Airport Transit",
    title: "International Express Terminal",
    distance: "20 Mins Drive",
    desc: "Direct highway access bypass avoiding city traffic congestions.",
  },
];

const NeighborhoodHighlights = () => {
  return (
    <section className="my-12 p-6 sm:p-10 bg-base-100 text-base-content border border-base-content/25 shadow-xs">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10 pb-4 border-b border-base-content/15">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-base-content/60 block mb-1">
            Prime Downtown Location
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-base-content uppercase tracking-wide">
            Neighborhood & Accessibility
          </h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-base-content/10 text-base-content text-xs font-black uppercase tracking-wider border border-base-content/20">
          <FaMapMarkerAlt className="text-sm text-base-content" /> Walk Score: 98/100
        </div>
      </div>

      {/* Neighborhood Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {places.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-6 bg-base-100 border border-base-content/20 shadow-xs hover:border-base-content/60 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-base-content/10 text-base-content border border-base-content/20 flex items-center justify-center text-lg">
                    <Icon />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-base-content/10 text-base-content border border-base-content/20">
                    {item.category}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-base-content uppercase tracking-wide mb-1">
                  {item.title}
                </h3>
                <p className="text-xs font-black text-base-content/90 uppercase tracking-wider mb-2">
                  {item.distance}
                </p>
                <p className="text-xs text-base-content/75 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default NeighborhoodHighlights;
