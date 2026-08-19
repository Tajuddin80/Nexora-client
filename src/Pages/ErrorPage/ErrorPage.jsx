import React from "react";
import { Link, useNavigate } from "react-router";
import { FaHome, FaArrowLeft, FaCompass } from "react-icons/fa";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-base-100 text-base-content w-full">
      <div className="w-full p-8 md:p-12 bg-base-100 border border-base-content/25 shadow-xs text-center space-y-6">
        {/* Top Badge & Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-base-content/10 text-base-content border border-base-content/20 flex items-center justify-center text-2xl">
            <FaCompass className="animate-spin-slow" />
          </div>
        </div>

        {/* 404 Headline */}
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-base-content/60 block mb-1">
            Error Code 404
          </span>
          <h1 className="text-6xl md:text-8xl font-black text-base-content tracking-tighter uppercase">
            404
          </h1>
          <h2 className="text-xl md:text-2xl font-black text-base-content uppercase tracking-wide mt-2">
            Page Not Found
          </h2>
        </div>

        <p className="text-sm text-base-content/75 font-medium leading-relaxed w-full">
          The page or resource you are looking for does not exist, has been relocated, or is temporarily unavailable.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-base-content/15">
          <Link
            to="/"
            className="btn bg-base-content text-base-100 hover:bg-base-content/80 rounded-none text-xs font-bold uppercase tracking-wider px-6 py-3 border-none w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <FaHome /> Go to Homepage
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="btn border border-base-content bg-transparent text-base-content hover:bg-base-content/10 rounded-none text-xs font-bold uppercase tracking-wider px-6 py-3 w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
