import React from "react";
import {
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import { BiBriefcase } from "react-icons/bi";
import { Link } from "react-router";
import Logo from "../Logo/Logo";

const Footer = () => {
  return (
    <footer className="w-full px-6 md:px-10 rounded-none border-t border-base-content/20 bg-base-100 text-base-content divide-y divide-base-content/10">
      <div className="w-full flex flex-col justify-between py-12 space-y-8 lg:flex-row lg:space-y-0">
        {/* Logo & Info */}
        <div className="space-y-4 max-w-sm">
          <Logo />
          <p className="text-sm text-base-content/75 leading-relaxed font-medium">
            NEXORA Building Management Platform. Smart digital leasing, keyless security, and seamless resident operations.
          </p>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 text-xs font-semibold uppercase tracking-wider gap-x-6 gap-y-8 lg:w-2/3 sm:grid-cols-4">
          <div className="space-y-3">
            <h3 className="font-black text-base-content text-sm">Residences</h3>
            <ul className="space-y-2 text-base-content/70 font-bold">
              <li>
                <Link className="hover:text-base-content hover:underline" to="/apartments">
                  Apartments
                </Link>
              </li>
              <li>
                <Link className="hover:text-base-content hover:underline" to="/about">
                  Building Specs
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-black text-base-content text-sm">Company</h3>
            <ul className="space-y-2 text-base-content/70 font-bold">
              <li>
                <Link className="hover:text-base-content hover:underline" to="/about">
                  About Us
                </Link>
              </li>
              <li>
                <a className="hover:text-base-content hover:underline" href="#">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a className="hover:text-base-content hover:underline" href="#">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-black text-base-content text-sm">Support</h3>
            <ul className="space-y-2 text-base-content/70 font-bold">
              <li>
                <Link className="hover:text-base-content hover:underline" to="/dashboard/chat">
                  Resident Portal
                </Link>
              </li>
              <li>
                <a className="hover:text-base-content hover:underline" href="#">
                  Maintenance Help
                </a>
              </li>
              <li>
                <a className="hover:text-base-content hover:underline" href="#">
                  Contact Office
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-black text-base-content text-sm">Connect</h3>
            <div className="flex justify-start space-x-2">
              <a
                href="https://www.linkedin.com/in/tajuddin80/"
                title="LinkedinIn"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-base-content text-base-100 flex items-center justify-center hover:bg-base-content/80 transition-colors"
              >
                <FaLinkedinIn className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/TajuddinCSE"
                title="Twitter"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-base-content text-base-100 flex items-center justify-center hover:bg-base-content/80 transition-colors"
              >
                <FaTwitter className="w-4 h-4" />
              </a>
              <a
                href="https://portfolio-tajuddin.netlify.app/"
                target="_blank"
                rel="noreferrer"
                title="Portfolio"
                className="w-9 h-9 bg-base-content text-base-100 flex items-center justify-center hover:bg-base-content/80 transition-colors"
              >
                <BiBriefcase className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="py-6 text-xs font-bold uppercase tracking-widest text-center text-base-content/60">
        © {new Date().getFullYear()} NEXORA Building Management System. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
