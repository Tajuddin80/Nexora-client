import React from "react";
import { Link } from "react-router";
import { FaBan } from "react-icons/fa";

const Forbidden = () => {
  return (
    <section className="flex flex-col items-center justify-center h-[110vh] text-center px-4">
      <FaBan className="text-red-500 text-7xl mb-6" />
      <h1 className="text-4xl font-bold text-red-500 mb-2">403 - Forbidden</h1>
      <p className="text-secondary mb-6">
        You don’t have permission to access this page.
      </p>
      <Link to="/" className="btn btn-primary ">
        Back to Home
      </Link>
    </section>
  );
};

export default Forbidden;
