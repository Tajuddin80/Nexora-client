import React from "react";
import { Link } from "react-router";
import { FaSearch } from "react-icons/fa";

const EmptyState = ({
  icon,
  title = "No Data Found",
  message = "There is currently no information available to display.",
  actionText,
  actionLink,
  onAction,
}) => {
  return (
    <div className="w-full py-16 px-4 flex flex-col items-center justify-center text-center bg-base-100 rounded-none border border-base-300 shadow-sm my-6">
      <div className="w-16 h-16 bg-primary/10 rounded-none flex items-center justify-center mb-4 text-2xl text-primary border border-primary/30">
        {icon || <FaSearch className="text-3xl text-primary" />}
      </div>
      <h3 className="text-2xl font-extrabold text-base-content uppercase tracking-wider mb-2">{title}</h3>
      <p className="text-base-content/70 max-w-md mb-6 font-medium text-sm">{message}</p>
      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="btn btn-primary rounded-none px-6 font-bold uppercase text-xs tracking-wider"
        >
          {actionText}
        </Link>
      )}
      {actionText && onAction && !actionLink && (
        <button
          onClick={onAction}
          className="btn btn-primary rounded-none px-6 font-bold uppercase text-xs tracking-wider"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
