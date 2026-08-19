import React from "react";
import { Outlet, Link } from "react-router";
import Logo from "../../Shared/Logo/Logo";
import Toggle from "../../Shared/component/Toggle/Toggle";
import { FaShieldAlt, FaBuilding, FaCheckCircle, FaLock } from "react-icons/fa";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-base-100 text-base-content flex flex-col justify-between p-4 md:p-8">
      {/* Auth Navbar Header */}
      <header className="flex items-center justify-between pb-6 border-b border-base-content/15 w-full">
        <Logo />
        <div className="flex items-center gap-4">
          <Toggle />
          <Link
            to="/apartments"
            className="text-xs font-black uppercase tracking-widest text-base-content/75 hover:text-base-content hidden sm:block"
          >
            Explore Residences
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center py-8 my-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-center">
          {/* Left / Form Column */}
          <div className="lg:col-span-6 flex justify-center w-full">
            <div className="w-full bg-base-100 border border-base-content/25 shadow-xs p-6 md:p-8">
              <Outlet />
            </div>
          </div>

          {/* Right / Architectural Showcase Panel */}
          <div className="lg:col-span-6 hidden lg:block w-full">
            <div className="p-8 md:p-10 bg-base-100 border border-base-content/25 shadow-xs space-y-6 w-full">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-base-content/10 text-base-content text-[10px] font-black uppercase tracking-widest border border-base-content/20 flex items-center gap-1.5">
                  <FaShieldAlt className="text-xs text-base-content" /> Secure Portal Access
                </span>
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-widest text-base-content/60 block mb-1">
                  NEXORA RESIDENTIAL COMPLEX
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-base-content uppercase tracking-wide leading-tight">
                  Modern Living • Unrivaled Architecture
                </h2>
              </div>

              <p className="text-sm text-base-content/75 font-medium leading-relaxed">
                Log in to manage your digital apartment agreement, process monthly rent payments, connect with property management, and access resident privileges.
              </p>

              {/* Architectural Specs List */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-base-content/15 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-base-content text-sm shrink-0" />
                  <span>LEED Gold Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-base-content text-sm shrink-0" />
                  <span>24/7 Concierge & Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-base-content text-sm shrink-0" />
                  <span>Smart Keyless Entry</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-base-content text-sm shrink-0" />
                  <span>High-Speed Metro Transit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="pt-6 border-t border-base-content/15 text-center text-xs font-bold text-base-content/60 w-full">
        © {new Date().getFullYear()} NEXORA Residential Management Systems. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthLayout;
