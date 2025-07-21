import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import Logo from "../Logo/Logo";
import { BiBriefcase } from "react-icons/bi";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer
      className="px-4 divide-y  shadow-2xl  rounded-xl     bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--color-base-100)_90%)]
    text-[color:var(--color-base-content)]
    border-r border-[rgba(0,0,0,0.1)]"
    >
      <div className="container flex flex-col justify-between py-10 mx-auto space-y-8 lg:flex-row lg:space-y-0">
        {/* Logo */}
        <Logo></Logo>

        {/* Links */}
        <div className="grid grid-cols-2 text-sm gap-x-3 gap-y-8 lg:w-2/3 sm:grid-cols-4">
          <div className="space-y-3">
            <h3 className="tracking-wide uppercase font-semibold">Product</h3>
            <ul className="space-y-1">
              <li>
                <a className="link link-hover" href="#">
                  Features
                </a>
              </li>

              <li>
                <Link className="link link-hover" to="apartments">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="tracking-wide uppercase font-semibold">Company</h3>
            <ul className="space-y-1">
              <li>
                <a className="link link-hover" href="#">
                  Privacy
                </a>
              </li>
              <li>
                <a className="link link-hover" href="#">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="uppercase font-semibold">Developers</h3>
            <ul className="space-y-1">
              <li>
                <a className="link link-hover" href="#">
                  Public API
                </a>
              </li>
              <li>
                <a className="link link-hover" href="#">
                  Documentation
                </a>
              </li>
              <li>
                <a className="link link-hover" href="#">
                  Guides
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <div className="uppercase font-semibold">Social media</div>
            <div className="flex justify-start space-x-3">
              <a
                href="https://www.linkedin.com/in/tajuddin80/"
                title="LinkedinIn"
                target="_blank"
                className="p-1 hover:text-primary transition-colors"
              >
                <FaLinkedinIn className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/TajuddinCSE"
                title="Twitter"
                target="_blank"
                className="p-1 hover:text-primary transition-colors"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a
                href="https://portfolio-tajuddin.netlify.app/"
                target="_blank"
                title="portfolio"
                className="p-1 hover:text-primary transition-colors"
              >
                <BiBriefcase size={20} className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="py-6 text-sm text-center opacity-70">
        © {new Date().getFullYear()} Company Co. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
