import React from "react";
import {
  FaKey,
  FaSun,
  FaDumbbell,
  FaChargingStation,
  FaWifi,
  FaUserShield,
  FaGem,
  FaChartLine,
} from "react-icons/fa";

const stats = [
  { label: "Modern Apartments", value: "50+", icon: FaGem },
  { label: "Smart Security", value: "24/7", icon: FaUserShield },
  { label: "Satisfaction Rate", value: "99.8%", icon: FaChartLine },
  { label: "Solar Energy Grid", value: "100%", icon: FaSun },
];

const amenities = [
  {
    icon: FaKey,
    title: "Smart Keyless Access",
    tag: "Security",
    description:
      "Unlock your door effortlessly via mobile app, temporary guest codes, or biometric sensors.",
  },
  {
    icon: FaSun,
    title: "Rooftop Lounge & Deck",
    tag: "Lifestyle",
    description:
      "Relax with breathtaking panoramic city skyline views, lush green seating, and BBQ zone.",
  },
  {
    icon: FaDumbbell,
    title: "Fitness & Wellness Hub",
    tag: "Health",
    description:
      "Fully equipped modern gym, cardio zones, yoga studio space, and private lockers.",
  },
  {
    icon: FaChargingStation,
    title: "EV Charging Bays",
    tag: "Eco-Friendly",
    description:
      "Dedicated high-speed electric vehicle charging slots available for all building residents.",
  },
  {
    icon: FaWifi,
    title: "Ultra-Fast Fiber Internet",
    tag: "Connectivity",
    description:
      "Gigabit speed optical fiber network integrated throughout apartments and shared spaces.",
  },
  {
    icon: FaUserShield,
    title: "On-Demand Concierge",
    tag: "Service",
    description:
      "24/7 maintenance ticketing system with rapid response staff right at your fingertips.",
  },
];

const AmenitiesSection = () => {
  return (
    <section className="w-full py-12 md:py-20 bg-base-100 text-base-content border-b border-base-content/15">
      <div className="w-full px-4 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10 pb-4 border-b border-base-content/15">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FaGem className="text-3xl text-base-content" />
              <h2 className="text-2xl md:text-3xl font-black text-base-content uppercase tracking-wide">
                Smart Living & Premium Amenities
              </h2>
            </div>
            <p className="text-sm text-base-content/75 w-full leading-relaxed font-medium">
              Experience next-generation apartment living with state-of-the-art facilities, 
              smart home integrations, and eco-friendly infrastructure.
            </p>
          </div>
        </div>

        {/* Stats Counter Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="p-5 bg-base-100 border border-base-content/20 shadow-xs flex items-center gap-4 hover:border-base-content/60 transition-all"
              >
                <div className="w-10 h-10 bg-base-content/10 text-base-content border border-base-content/20 flex items-center justify-center text-lg shrink-0">
                  <Icon />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-black text-base-content">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-base-content/70 font-bold uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Amenities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {amenities.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className="p-6 bg-base-100 border border-base-content/20 shadow-xs hover:border-base-content/60 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-base-content/10 text-base-content border border-base-content/20 flex items-center justify-center text-lg">
                      <IconComponent />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 bg-base-content/10 text-base-content border border-base-content/20">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-base-content uppercase tracking-wide mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-base-content/75 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AmenitiesSection;
