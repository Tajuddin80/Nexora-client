import React from "react";
import {
  FaBuilding,
  FaUsers,
  FaTools,
  FaCheckCircle,
  FaHandHoldingUsd,
} from "react-icons/fa";

const About = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[color:var(--color-base-100)]">
      <div className="p-6 md:p-12 bg-base-100 text-base-content items-center max-w-7xl w-full">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            NEXORA
          </h1>
          <p className="max-w-2xl mx-auto text-base md:text-lg opacity-80">
            Welcome to <span className="font-semibold">NEXORA</span> – your
            all‑in‑one building management solution. We help you streamline
            apartment rents, maintenance, and communication with ease.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Feature Card */}
          <div
            className="p-6 rounded-xl shadow-md bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--color-base-100)_90%)]
        text-[color:var(--color-base-content)] hover:shadow-xl transition"
          >
            <FaBuilding className="text-4xl text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Modern Management</h3>
            <p className="opacity-80 text-sm md:text-base">
              Manage apartments, agreements, and payments in a modern, digital
              way that fits your building’s needs.
            </p>
          </div>

          <div
            className="p-6 rounded-xl shadow-md bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--color-base-100)_90%)]
        text-[color:var(--color-base-content)] hover:shadow-xl transition"
          >
            <FaUsers className="text-4xl text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Community Focused</h3>
            <p className="opacity-80 text-sm md:text-base">
              Build stronger connections between owners, tenants, and managers
              through announcements and updates.
            </p>
          </div>

          <div
            className="p-6 rounded-xl shadow-md bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--color-base-100)_90%)]
        text-[color:var(--color-base-content)] hover:shadow-xl transition"
          >
            <FaTools className="text-4xl text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Maintenance Simplified</h3>
            <p className="opacity-80 text-sm md:text-base">
              Track maintenance requests and keep your building running smoothly
              without the paperwork.
            </p>
          </div>

          <div
            className="p-6 rounded-xl shadow-md bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--color-base-100)_90%)]
        text-[color:var(--color-base-content)] hover:shadow-xl transition"
          >
            <FaHandHoldingUsd className="text-4xl text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Easy Payments</h3>
            <p className="opacity-80 text-sm md:text-base">
              Rent collection and payment history at your fingertips with secure
              online transactions.
            </p>
          </div>

          <div
            className="p-6 rounded-xl shadow-md bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--color-base-100)_90%)]
        text-[color:var(--color-base-content)] hover:shadow-xl transition"
          >
            <FaCheckCircle className="text-4xl text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Transparent & Trusted</h3>
            <p className="opacity-80 text-sm md:text-base">
              Every action is recorded and visible to keep both tenants and
              owners informed and confident.
            </p>
          </div>
          <div
            className="p-6 rounded-xl shadow-md bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--color-base-100)_90%)]
        text-[color:var(--color-base-content)] hover:shadow-xl transition"
          >
            <FaBuilding className="text-4xl text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Modern Living Spaces</h3>
            <p className="opacity-80 text-sm md:text-base">
              Designed for comfort and efficiency, NEXORA offers a seamless
              living experience with top-notch facilities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
