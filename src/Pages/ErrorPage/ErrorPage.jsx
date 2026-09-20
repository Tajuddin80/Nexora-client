import React from "react";
import { Link, useNavigate, useRouteError, isRouteErrorResponse } from "react-router";
import { FaHome, FaArrowLeft, FaCompass, FaExclamationTriangle } from "react-icons/fa";

const ErrorPage = () => {
  const navigate = useNavigate();
  const error = useRouteError();

  if (error) {
    console.error("Route Error:", error);
  }

  const is404 = isRouteErrorResponse(error) ? error.status === 404 : !error;
  const statusCode = isRouteErrorResponse(error) ? error.status : (error ? 500 : 404);
  const statusTitle = isRouteErrorResponse(error)
    ? error.statusText || "Page Not Found"
    : (error ? "Application Exception" : "Page Not Found");
  const message = isRouteErrorResponse(error)
    ? error.data?.message || "The page or resource you are looking for does not exist, has been relocated, or is temporarily unavailable."
    : (error?.message || "The page or resource you are looking for does not exist, has been relocated, or is temporarily unavailable.");

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-base-100 text-base-content w-full">
      <div className="max-w-xl w-full p-8 md:p-12 bg-base-100 border border-base-content/25 shadow-lg rounded-2xl text-center space-y-6">
        {/* Top Badge & Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-base-content/10 text-base-content border border-base-content/20 rounded-2xl flex items-center justify-center text-2xl">
            {is404 ? <FaCompass className="animate-spin-slow" /> : <FaExclamationTriangle className="text-error" />}
          </div>
        </div>

        {/* Headline */}
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-base-content/60 block mb-1">
            Error Code {statusCode}
          </span>
          <h1 className="text-6xl md:text-7xl font-black text-base-content tracking-tighter uppercase">
            {statusCode}
          </h1>
          <h2 className="text-xl md:text-2xl font-black text-base-content uppercase tracking-wide mt-2">
            {statusTitle}
          </h2>
        </div>

        <p className="text-sm text-base-content/75 font-medium leading-relaxed">
          {message}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-base-content/15">
          <Link
            to="/"
            className="btn btn-primary text-xs font-bold uppercase tracking-wider px-6 py-3 w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <FaHome /> Go to Homepage
          </Link>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-outline text-xs font-bold uppercase tracking-wider px-6 py-3 w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
