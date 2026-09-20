import React from "react";
import { FaBuilding, FaCheckCircle, FaShieldAlt, FaLeaf } from "react-icons/fa";

import building4Img from "../../../assets/building-4.webp";
import building5Img from "../../../assets/building-5.webp";

const BuildingDetails = () => {
  return (
    <section className="w-full py-12 md:py-20 bg-base-100 text-base-content border-b border-base-content/15">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-base-content/10">
          <FaBuilding className="text-3xl text-base-content" />
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-base-content/60 block mb-0.5">
              Architectural Excellence
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-base-content uppercase tracking-wide">
              About NEXORA Building
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-sm md:text-base leading-relaxed text-base-content/80 mb-6 font-medium">
              Our building is a masterpiece of modern architecture, designed to bring
              you comfort, security, and luxury living. Enjoy spacious apartments,
              high-speed elevators, 24/7 surveillance, and eco-friendly energy
              systems. Residents can also relax in rooftop gardens, work out in a
              fully equipped gym, and spend quality time in our community spaces.
            </p>

            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm font-bold text-base-content p-3.5 border border-base-content/15 bg-base-100 shadow-xs">
                <FaShieldAlt className="text-base-content text-lg flex-shrink-0" /> 
                <span>24/7 Security Patrol & Integrated CCTV</span>
              </li>
              <li className="flex items-center gap-3 text-sm font-bold text-base-content p-3.5 border border-base-content/15 bg-base-100 shadow-xs">
                <FaCheckCircle className="text-base-content text-lg flex-shrink-0" /> 
                <span>High-Speed Express Elevators & Access Cards</span>
              </li>
              <li className="flex items-center gap-3 text-sm font-bold text-base-content p-3.5 border border-base-content/15 bg-base-100 shadow-xs">
                <FaLeaf className="text-base-content text-lg flex-shrink-0" /> 
                <span>Rooftop Solar Deck & Landscaping</span>
              </li>
            </ul>
          </div>

          {/* Building Image Showcase Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-base-content/20 overflow-hidden shadow-xs h-64 md:h-80 group">
              <img
                src={building4Img}
                alt="NEXORA Exterior View"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="border border-base-content/20 overflow-hidden shadow-xs h-64 md:h-80 group">
              <img
                src={building5Img}
                alt="NEXORA Architectural Living"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuildingDetails;
