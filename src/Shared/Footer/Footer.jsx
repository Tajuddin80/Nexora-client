import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import Logo from "../Logo/Logo";

const Footer = () => {
  return (
    <footer className="px-4 divide-y bg-base-100 text-base-content shadow-2xl border rounded-xl">
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
                <a className="link link-hover" href="#">
                  Integrations
                </a>
              </li>
              <li>
                <a className="link link-hover" href="#">
                  Pricing
                </a>
              </li>
              <li>
                <a className="link link-hover" href="#">
                  FAQ
                </a>
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
                href="#"
                title="Facebook"
                className="p-1 hover:text-primary transition-colors"
              >
                <FaFacebookF className="w-5 h-5" />
              </a>
              <a
                href="#"
                title="Twitter"
                className="p-1 hover:text-primary transition-colors"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                title="Instagram"
                className="p-1 hover:text-primary transition-colors"
              >
                <FaInstagram className="w-5 h-5" />
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
