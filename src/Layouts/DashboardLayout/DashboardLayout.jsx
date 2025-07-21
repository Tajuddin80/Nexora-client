import React from "react";
import { NavLink, Outlet } from "react-router";
import {
  FaHome,
  FaUser,
  FaBullhorn,
  FaMoneyCheckAlt,
  FaUserShield,
  FaTasks,
  FaClipboardList,
  FaUsersCog,
  FaPlus,
} from "react-icons/fa";
import useUserRole from "../../hooks/useUserRole";
import Logo from "../../Shared/Logo/Logo";
import Loader from "../../Shared/component/Loader/Loader";

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-300 
   ${
     isActive
       ? "bg-primary text-white"
       : " hover:text-white hover:bg-primary text-base-content"
   } text-base md:text-lg font-medium`;

const DashboardLayout = () => {
  const { role, roleLoading } = useUserRole();
  console.log(role);

  if (roleLoading) {
    return <Loader></Loader>;
  }

  return (
    <div className="drawer lg:drawer-open">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main content */}
      <div className="drawer-content flex flex-col bg-base-100 text-base-content">
        {/* Navbar on small screens */}
        <div className="w-full navbar bg-base-100 lg:hidden shadow-md">
          <div className="flex-none">
            <label
              htmlFor="dashboard-drawer"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="flex-1 px-2 mx-2 font-bold text-lg">Dashboard</div>
        </div>

        <div className="p-4">
          <Outlet />
        </div>
      </div>

      <div className="drawer-side">
        <label
          htmlFor="dashboard-drawer"
          className="drawer-overlay lg:hidden"
        ></label>

        <ul
          className="
    menu p-4 gap-3 w-80 min-h-screen shadow-lg
    bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--color-base-100)_90%)]
    text-[color:var(--color-base-content)]
    border-r border-[rgba(0,0,0,0.1)]
  "
        >
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Logo />
          </div>

          <li>
            <NavLink to="/" className={navLinkClass}>
              <FaHome /> Home
            </NavLink>
          </li>

          {/* ============ User Dashboard Links ============ */}
          {role === "user" && (
            <>
              <li>
                <NavLink to="/dashboard/my-profile" className={navLinkClass}>
                  <FaUser /> My Profile
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/announcements" className={navLinkClass}>
                  <FaBullhorn /> Announcements
                </NavLink>
              </li>
            </>
          )}

          {/* ============ Member Dashboard Links ============ */}
          {role === "member" && (
            <>
              <li>
                <NavLink to="/dashboard/my-profile" className={navLinkClass}>
                  <FaUser /> My Profile
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/makepayment" className={navLinkClass}>
                  <FaMoneyCheckAlt /> Make Payment
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/payment-history"
                  className={navLinkClass}
                >
                  <FaClipboardList /> Payment History
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/announcements" className={navLinkClass}>
                  <FaBullhorn /> Announcements
                </NavLink>
              </li>
            </>
          )}

          {/* ============ Admin Dashboard Links ============ */}
          {role === "admin" && (
            <>
              <li>
                <NavLink to="/dashboard/admin-profile" className={navLinkClass}>
                  <FaUserShield /> Admin Profile
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/manage-members"
                  className={navLinkClass}
                >
                  <FaUsersCog /> Manage Members
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/announcements" className={navLinkClass}>
                  <FaBullhorn /> Make Announcement
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/agreement-requests"
                  className={navLinkClass}
                >
                  <FaTasks /> Agreement Requests
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/manage-coupons"
                  className={navLinkClass}
                >
                  <FaPlus /> Manage Coupons
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
