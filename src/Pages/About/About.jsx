import React from "react";
import { Link } from "react-router";
import {
  FaBuilding,
  FaUsers,
  FaTools,
  FaCreditCard,
  FaShieldAlt,
  FaLeaf,
  FaArrowRight,
  FaCheck,
} from "react-icons/fa";

import building3Img from "../../assets/building-3.jpg";
import building4Img from "../../assets/building-4.jpg";
import building5Img from "../../assets/building-5.jpg";
import building6Img from "../../assets/building-6.jpg";

const stats = [
  { value: "50+", label: "Luxury Units Managed" },
  { value: "99.8%", label: "Tenant Satisfaction" },
  { value: "24/7", label: "Security Operations" },
  { value: "100%", label: "Digital Paperless" },
];

const galleryImages = [
  {
    src: building6Img,
    title: "High-Rise Glass Facade",
    subtitle: "Modern structural engineering with double-glazed insulation",
  },
  {
    src: building5Img,
    title: "Eco Solar Deck & Sky Lounge",
    subtitle: "Rooftop landscaping and renewable energy infrastructure",
  },
  {
    src: building4Img,
    title: "Executive Resident Living",
    subtitle: "Spacious open-concept floor plans with premium finishing",
  },
  {
    src: building3Img,
    title: "Penthouse Suite Views",
    subtitle: "Keyless biometric access and panoramic city skylines",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-base-100 text-base-content py-8 px-4 md:px-8 lg:px-12 w-full">
      <div className="w-full space-y-10">
        {/* 1. Header Banner & Hero Section */}
        <div className="p-8 md:p-12 bg-base-100 border border-base-content/25 shadow-xs">
          <div className="text-center max-w-4xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-base-content/60 block mb-2">
              Architectural Landmark Platform
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-base-content uppercase tracking-widest mb-4">
              ABOUT NEXORA
            </h1>
            <p className="text-sm md:text-base text-base-content/80 font-medium leading-relaxed">
              NEXORA is a premier building management platform combining state-of-the-art 
              architectural engineering with a seamless digital resident experience. We empower 
              tenants and owners with keyless access, 100% paperless agreements, and 24/7 security.
            </p>
          </div>

          {/* Hero Dual Image Feature View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center w-full">
            <div className="lg:col-span-8 relative border border-base-content/30 overflow-hidden h-[360px] sm:h-[440px] md:h-[520px] shadow-xs group">
              <img
                src={building6Img}
                alt="NEXORA Main Architecture Tower"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-base-content/85 text-base-100 px-3.5 py-1.5 text-xs font-black uppercase tracking-widest border border-base-content/20">
                NEXORA Main Tower • Est. 2026
              </div>
            </div>

            <div className="lg:col-span-4 relative border border-base-content/30 overflow-hidden h-[360px] sm:h-[440px] md:h-[520px] shadow-xs group">
              <img
                src={building4Img}
                alt="NEXORA Executive Interior"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-4 left-4 bg-base-content/85 text-base-100 px-3.5 py-1.5 text-xs font-black uppercase tracking-widest border border-base-content/20">
                Executive Living Design
              </div>
            </div>
          </div>
        </div>

        {/* 2. Stats Bar Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className="p-8 bg-base-100 border border-base-content/20 shadow-xs text-center hover:border-base-content/60 transition-all"
            >
              <h3 className="text-4xl md:text-5xl font-black text-base-content mb-1">
                {item.value}
              </h3>
              <p className="text-xs font-bold uppercase tracking-widest text-base-content/70">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* 3. Our Mission & Architectural Excellence (2-Column Grid) */}
        <div className="p-8 md:p-12 bg-base-100 border border-base-content/25 shadow-xs w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center w-full">
            {/* Left Narrative Column */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-base-content/60 block">
                Our Core Philosophy
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-base-content uppercase tracking-wide leading-tight">
                Designed for Comfort, Security & Modern Efficiency
              </h2>
              <p className="text-sm md:text-base text-base-content/80 font-medium leading-relaxed">
                At NEXORA, we believe apartment living should be effortless. From the moment 
                you apply for an agreement to your daily resident experience, every touchpoint 
                is optimized for security, digital convenience, and architectural quality.
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-4 border border-base-content/20 bg-base-100 flex items-center gap-3">
                  <div className="w-7 h-7 bg-base-content/10 text-base-content border border-base-content/20 flex items-center justify-center text-xs font-bold shrink-0">
                    <FaCheck />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-base-content uppercase tracking-wide">
                    100% Digital Paperless Agreement & Instant Tracking
                  </span>
                </div>
                <div className="p-4 border border-base-content/20 bg-base-100 flex items-center gap-3">
                  <div className="w-7 h-7 bg-base-content/10 text-base-content border border-base-content/20 flex items-center justify-center text-xs font-bold shrink-0">
                    <FaCheck />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-base-content uppercase tracking-wide">
                    Stripe-Integrated Automated Rent & Deposit Payments
                  </span>
                </div>
                <div className="p-4 border border-base-content/20 bg-base-100 flex items-center gap-3">
                  <div className="w-7 h-7 bg-base-content/10 text-base-content border border-base-content/20 flex items-center justify-center text-xs font-bold shrink-0">
                    <FaCheck />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-base-content uppercase tracking-wide">
                    24/7 Concierge Ticketing & On-Demand Maintenance
                  </span>
                </div>
              </div>
            </div>

            {/* Right Image Feature Column */}
            <div className="lg:col-span-5 relative border border-base-content/30 overflow-hidden h-[380px] md:h-[480px] shadow-xs group">
              <img
                src={building5Img}
                alt="NEXORA Structural Engineering"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-base-content/85 text-base-100 p-4 border border-base-content/20">
                <h4 className="text-sm font-black uppercase tracking-wide mb-1">
                  Eco-Friendly Infrastructure
                </h4>
                <p className="text-xs text-base-100/90 font-medium">
                  Rooftop solar decks, EV charging slots, and rainwater harvesting built standard.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Core Platform Capabilities */}
        <div className="p-8 md:p-12 bg-base-100 border border-base-content/25 shadow-xs space-y-8 w-full">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-base-content/60 block mb-1">
              Integrated Capabilities
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-base-content uppercase tracking-wide">
              What Sets NEXORA Apart
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 w-full">
            <div className="p-8 border border-base-content/20 bg-base-100 shadow-xs hover:border-base-content/60 transition-all">
              <div className="w-11 h-11 bg-base-content/10 text-base-content border border-base-content/20 flex items-center justify-center text-lg mb-4">
                <FaBuilding />
              </div>
              <h3 className="text-lg font-extrabold text-base-content uppercase tracking-wide mb-2">
                Modern Management
              </h3>
              <p className="text-sm text-base-content/75 leading-relaxed font-medium">
                Manage apartment listings, leases, and resident requests in a unified, streamlined digital portal.
              </p>
            </div>

            <div className="p-8 border border-base-content/20 bg-base-100 shadow-xs hover:border-base-content/60 transition-all">
              <div className="w-11 h-11 bg-base-content/10 text-base-content border border-base-content/20 flex items-center justify-center text-lg mb-4">
                <FaUsers />
              </div>
              <h3 className="text-lg font-extrabold text-base-content uppercase tracking-wide mb-2">
                Community Focused
              </h3>
              <p className="text-sm text-base-content/75 leading-relaxed font-medium">
                Direct live chat connecting residents with administration for seamless communication.
              </p>
            </div>

            <div className="p-8 border border-base-content/20 bg-base-100 shadow-xs hover:border-base-content/60 transition-all">
              <div className="w-11 h-11 bg-base-content/10 text-base-content border border-base-content/20 flex items-center justify-center text-lg mb-4">
                <FaTools />
              </div>
              <h3 className="text-lg font-extrabold text-base-content uppercase tracking-wide mb-2">
                Maintenance Simplified
              </h3>
              <p className="text-sm text-base-content/75 leading-relaxed font-medium">
                Submit maintenance tickets instantly and track technician resolution in real-time.
              </p>
            </div>

            <div className="p-8 border border-base-content/20 bg-base-100 shadow-xs hover:border-base-content/60 transition-all">
              <div className="w-11 h-11 bg-base-content/10 text-base-content border border-base-content/20 flex items-center justify-center text-lg mb-4">
                <FaCreditCard />
              </div>
              <h3 className="text-lg font-extrabold text-base-content uppercase tracking-wide mb-2">
                Stripe Payments
              </h3>
              <p className="text-sm text-base-content/75 leading-relaxed font-medium">
                Pay rent safely online via Stripe checkout and access full receipt history on your portal.
              </p>
            </div>

            <div className="p-8 border border-base-content/20 bg-base-100 shadow-xs hover:border-base-content/60 transition-all">
              <div className="w-11 h-11 bg-base-content/10 text-base-content border border-base-content/20 flex items-center justify-center text-lg mb-4">
                <FaShieldAlt />
              </div>
              <h3 className="text-lg font-extrabold text-base-content uppercase tracking-wide mb-2">
                Keyless Smart Access
              </h3>
              <p className="text-sm text-base-content/75 leading-relaxed font-medium">
                24/7 CCTV surveillance, biometric entrance sensors, and keyless mobile passcode access.
              </p>
            </div>

            <div className="p-8 border border-base-content/20 bg-base-100 shadow-xs hover:border-base-content/60 transition-all">
              <div className="w-11 h-11 bg-base-content/10 text-base-content border border-base-content/20 flex items-center justify-center text-lg mb-4">
                <FaLeaf />
              </div>
              <h3 className="text-lg font-extrabold text-base-content uppercase tracking-wide mb-2">
                Eco-Friendly Living
              </h3>
              <p className="text-sm text-base-content/75 leading-relaxed font-medium">
                Solar roof grids, dedicated EV charging bays, and energy-efficient building insulation.
              </p>
            </div>
          </div>
        </div>

        {/* 5. Architectural Showcase Gallery Grid */}
        <div className="p-8 md:p-12 bg-base-100 border border-base-content/25 shadow-xs space-y-8 w-full">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-base-content/15 pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-base-content/60 block mb-1">
                Visual Showcase
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-base-content uppercase tracking-wide">
                Building Photo Gallery
              </h2>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest px-4 py-2 bg-base-content text-base-100 border border-base-content">
              Verified Residence Photos
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {galleryImages.map((img, idx) => (
              <div
                key={idx}
                className="border border-base-content/20 bg-base-100 overflow-hidden shadow-xs hover:border-base-content/60 transition-all group flex flex-col justify-between"
              >
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={img.src}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-base-content/85 text-base-100 text-[10px] font-black uppercase tracking-wider px-2 py-0.5">
                    0{idx + 1}
                  </div>
                </div>

                <div className="p-4 border-t border-base-content/15">
                  <h4 className="text-base font-black text-base-content uppercase tracking-wide mb-1">
                    {img.title}
                  </h4>
                  <p className="text-xs text-base-content/75 font-medium leading-relaxed">
                    {img.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. CTA Footer Box - Theme-aware non-glaring banner */}
        <div className="p-8 md:p-12 bg-base-100 text-base-content border border-base-content/30 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6 w-full">
          <div>
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-wide text-base-content mb-1">
              Ready to Join NEXORA Community?
            </h3>
            <p className="text-sm md:text-base text-base-content/80 font-medium">
              Explore available apartment units or connect with our admin team today.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 flex-wrap">
            <Link
              to="/apartments"
              className="btn bg-base-content text-base-100 hover:bg-base-content/80 rounded-none text-xs font-black uppercase tracking-wider px-8 py-3.5 border-none flex items-center gap-2"
            >
              View Apartments <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
