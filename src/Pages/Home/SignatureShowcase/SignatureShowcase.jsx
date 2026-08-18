import React from "react";
import { Link } from "react-router";
import { FaArrowRight, FaCheck } from "react-icons/fa";

import bigBuildingImg from "../../../assets/building-6.jpg";
import smallBuildingImg from "../../../assets/building-3.jpg";

const SignatureShowcase = () => {
  return (
    <section className="my-12 p-6 sm:p-10 md:p-12 bg-base-100 text-base-content border border-base-content/25 shadow-xs">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 items-center">
        {/* Left Side: Big & Small Dual Image View Layout */}
        <div className="lg:col-span-7 relative">
          {/* Main Big Image */}
          <div className="relative w-full h-[320px] sm:h-[420px] md:h-[480px] border border-base-content/40 overflow-hidden shadow-xs group">
            <img
              src={bigBuildingImg}
              alt="NEXORA Architectural Tower - Main View"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Subtle Overlay Badge */}
            <div className="absolute top-4 left-4 bg-base-content/85 text-base-100 px-3 py-1 text-xs font-black uppercase tracking-widest border border-base-content/20">
              Primary Facade
            </div>
          </div>

          {/* Secondary Small Overlapping Inset Image */}
          <div className="absolute -bottom-6 -right-2 sm:-bottom-8 sm:-right-4 md:-bottom-10 md:right-4 w-44 sm:w-60 md:w-72 h-32 sm:h-44 md:h-52 border-4 border-base-100 shadow-2xl overflow-hidden group">
            <img
              src={smallBuildingImg}
              alt="NEXORA Interior Detail"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute bottom-2 left-2 bg-base-content/85 text-base-100 px-2 py-0.5 text-[10px] sm:text-xs font-black uppercase tracking-wider">
              Interior Detail
            </div>
          </div>
        </div>

        {/* Right Side: High Contrast Content & Specs */}
        <div className="lg:col-span-5 pt-6 lg:pt-0">
          <span className="text-xs font-bold uppercase tracking-widest text-base-content/60 block mb-2">
            Signature Design & Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-base-content uppercase tracking-wide leading-tight mb-6">
            Architectural Landmark View
          </h2>
          <p className="text-sm md:text-base text-base-content/80 font-medium leading-relaxed mb-6">
            NEXORA combines modern high-density structural engineering with 
            minimalist aesthetic principles. Designed for residents seeking high-end 
            security, thermal efficiency, and timeless architectural elegance.
          </p>

          {/* Spec Highlights */}
          <div className="space-y-3 mb-8">
            <div className="p-3.5 border border-base-content/20 bg-base-100 flex items-center gap-3">
              <div className="w-7 h-7 bg-base-content/10 text-base-content border border-base-content/20 flex items-center justify-center text-xs font-bold shrink-0">
                <FaCheck />
              </div>
              <span className="text-xs sm:text-sm font-bold text-base-content uppercase tracking-wide">
                Acoustic Double-Glazed Soundproof Glass
              </span>
            </div>
            <div className="p-3.5 border border-base-content/20 bg-base-100 flex items-center gap-3">
              <div className="w-7 h-7 bg-base-content/10 text-base-content border border-base-content/20 flex items-center justify-center text-xs font-bold shrink-0">
                <FaCheck />
              </div>
              <span className="text-xs sm:text-sm font-bold text-base-content uppercase tracking-wide">
                Structural Steel & Reinforced Concrete Core
              </span>
            </div>
            <div className="p-3.5 border border-base-content/20 bg-base-100 flex items-center gap-3">
              <div className="w-7 h-7 bg-base-content/10 text-base-content border border-base-content/20 flex items-center justify-center text-xs font-bold shrink-0">
                <FaCheck />
              </div>
              <span className="text-xs sm:text-sm font-bold text-base-content uppercase tracking-wide">
                Rooftop Solar Deck & Rainwater Harvesting
              </span>
            </div>
          </div>

          <Link
            to="/apartments"
            className="btn bg-base-content text-base-100 hover:bg-base-content/80 rounded-none px-8 py-3.5 text-xs font-black uppercase tracking-widest border-none inline-flex items-center gap-3"
          >
            Explore All Residences <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SignatureShowcase;
