import React from "react";
import { Link } from "react-router";

const EmptyState = ({
  icon = "🔍",
  title = "No Data Found",
  message = "There is currently no information available to display.",
  actionText,
  actionLink,
  onAction,
}) => {
  return (
    <div className="w-full py-16 px-4 flex flex-col items-center justify-center text-center bg-base-100/50 rounded-2xl border border-base-300 shadow-sm my-6">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-4xl shadow-inner">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-base-content mb-2">{title}</h3>
      <p className="text-base-content/70 max-w-md mb-6">{message}</p>
      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="btn btn-primary px-6 shadow-md hover:shadow-lg transition"
        >
          {actionText}
        </Link>
      )}
      {actionText && onAction && !actionLink && (
        <button
          onClick={onAction}
          className="btn btn-primary px-6 shadow-md hover:shadow-lg transition"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
