import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="px-4 divide-y bg-base-100 text-base-content shadow-2xl border rounded-xl">
      <div className="container flex flex-col justify-between py-10 mx-auto space-y-8 lg:flex-row lg:space-y-0">
        {/* Logo */}
        <div className="lg:w-1/3">
          <a
            href="#"
            className="flex justify-center space-x-3 lg:justify-start"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-content">
              {/* sample logo */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M18.266 26.068l7.839-7.854 4.469 4.479c1.859 1.859 1.859 4.875 0 6.734l-1.104 1.104c-1.859 1.865-4.875 1.865-6.734 0zM30.563 2.531l-1.109-1.104c-1.859-1.859-4.875-1.859-6.734 0l-6.719 6.734-6.734-6.734c-1.859-1.859-4.875-1.859-6.734 0l-1.104 1.104c-1.859 1.859-1.859 4.875 0 6.734l6.734 6.734-6.734 6.734c-1.859 1.859-1.859 4.875 0 6.734l1.104 1.104c1.859 1.859 4.875 1.859 6.734 0l21.307-21.307c1.859-1.859 1.859-4.875 0-6.734z" />
              </svg>
            </div>
            <span className="self-center text-2xl font-bold">Brand Name</span>
          </a>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 text-sm gap-x-3 gap-y-8 lg:w-2/3 sm:grid-cols-4">
          <div className="space-y-3">
            <h3 className="tracking-wide uppercase font-semibold">Product</h3>
            <ul className="space-y-1">
              <li><a className="link link-hover" href="#">Features</a></li>
              <li><a className="link link-hover" href="#">Integrations</a></li>
              <li><a className="link link-hover" href="#">Pricing</a></li>
              <li><a className="link link-hover" href="#">FAQ</a></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="tracking-wide uppercase font-semibold">Company</h3>
            <ul className="space-y-1">
              <li><a className="link link-hover" href="#">Privacy</a></li>
              <li><a className="link link-hover" href="#">Terms of Service</a></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="uppercase font-semibold">Developers</h3>
            <ul className="space-y-1">
              <li><a className="link link-hover" href="#">Public API</a></li>
              <li><a className="link link-hover" href="#">Documentation</a></li>
              <li><a className="link link-hover" href="#">Guides</a></li>
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
        © 1968 Company Co. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
