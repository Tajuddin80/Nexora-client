import React from "react";
import { NavLink, Outlet, Link } from "react-router";
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
  FaComments,
  FaBuilding,
  FaSignOutAlt,
} from "react-icons/fa";
import useUserRole from "../../hooks/useUserRole";
import useAuth from "../../hooks/useAuth";
import Logo from "../../Shared/Logo/Logo";
import Toggle from "../../Shared/component/Toggle/Toggle";
import Loader from "../../Shared/component/Loader/Loader";
import { Toaster } from "react-hot-toast";

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-3.5 px-4 py-3 rounded-none transition-all duration-200 text-xs font-bold uppercase tracking-widest border-l-4 ${
    isActive
      ? "bg-base-content text-base-100 border-base-content font-black shadow-xs"
      : "text-base-content/80 hover:bg-base-content/10 hover:text-base-content border-transparent"
  }`;

const DashboardLayout = () => {
  const { role, roleLoading } = useUserRole();
  const { user, logOut } = useAuth();

  if (roleLoading) {
    return <Loader />;
  }

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-base-100 text-base-content">
      <Toaster position="top-right" reverseOrder={false} />
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main Content Area */}
      <div className="drawer-content flex flex-col bg-base-100 text-base-content min-h-screen w-full">
        {/* Mobile Top Navigation Header */}
        <div className="w-full navbar bg-base-100 lg:hidden border-b border-base-content/20 px-4">
          <div className="flex-none">
            <label
              htmlFor="dashboard-drawer"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost text-base-content p-2"
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
          <div className="flex-1 px-2 mx-2">
            <Logo />
          </div>
          <div className="flex-none">
            <Toggle />
          </div>
        </div>

        {/* Dynamic Page Outlet */}
        <div className="p-4 md:p-8 flex-1 w-full">
          <Outlet />
        </div>
      </div>

      {/* Sidebar Drawer Container */}
      <div className="drawer-side z-[99]">
        <label
          htmlFor="dashboard-drawer"
          className="drawer-overlay lg:hidden"
        ></label>

        <aside className="w-72 sm:w-80 min-h-screen bg-base-100 text-base-content border-r border-base-content/20 flex flex-col justify-between p-5">
          <div className="space-y-6">
            {/* Top Branding Header */}
            <div className="pb-4 border-b border-base-content/20 flex flex-col items-start gap-2">
              <Logo />
              <div className="flex items-center justify-between w-full mt-1">
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-base-content text-base-100">
                  {role === "admin" ? "Admin Portal" : role === "member" ? "Member Portal" : "Resident Portal"}
                </span>
                <Toggle />
              </div>
            </div>

            {/* Menu Links */}
            <nav className="space-y-1">
              <NavLink to="/" className={navLinkClass}>
                <FaHome className="text-sm shrink-0" /> Back To Site
              </NavLink>

              {/* ============ User Dashboard Links ============ */}
              {role === "user" && (
                <>
                  <NavLink to="/dashboard/my-profile" className={navLinkClass}>
                    <FaUser className="text-sm shrink-0" /> My Profile
                  </NavLink>
                  <NavLink to="/dashboard/announcements" className={navLinkClass}>
                    <FaBullhorn className="text-sm shrink-0" /> Announcements
                  </NavLink>
                  <NavLink to="/dashboard/chat" className={navLinkClass}>
                    <FaComments className="text-sm shrink-0" /> Admin Support Chat
                  </NavLink>
                </>
              )}

              {/* ============ Member Dashboard Links ============ */}
              {role === "member" && (
                <>
                  <NavLink to="/dashboard/my-profile" className={navLinkClass}>
                    <FaUser className="text-sm shrink-0" /> My Profile
                  </NavLink>
                  <NavLink to="/dashboard/makepayment" className={navLinkClass}>
                    <FaMoneyCheckAlt className="text-sm shrink-0" /> Make Payment
                  </NavLink>
                  <NavLink to="/dashboard/payment-history" className={navLinkClass}>
                    <FaClipboardList className="text-sm shrink-0" /> Payment History
                  </NavLink>
                  <NavLink to="/dashboard/announcements" className={navLinkClass}>
                    <FaBullhorn className="text-sm shrink-0" /> Announcements
                  </NavLink>
                  <NavLink to="/dashboard/chat" className={navLinkClass}>
                    <FaComments className="text-sm shrink-0" /> Admin Chat
                  </NavLink>
                </>
              )}

              {/* ============ Admin Dashboard Links ============ */}
              {role === "admin" && (
                <>
                  <NavLink to="/dashboard/admin-profile" className={navLinkClass}>
                    <FaUserShield className="text-sm shrink-0" /> Admin Profile
                  </NavLink>
                  <NavLink to="/dashboard/add-apartment" className={navLinkClass}>
                    <FaBuilding className="text-sm shrink-0" /> Add Apartment
                  </NavLink>
                  <NavLink to="/dashboard/manage-members" className={navLinkClass}>
                    <FaUsersCog className="text-sm shrink-0" /> Manage Members
                  </NavLink>
                  <NavLink to="/dashboard/announcements" className={navLinkClass}>
                    <FaBullhorn className="text-sm shrink-0" /> Make Announcement
                  </NavLink>
                  <NavLink to="/dashboard/agreement-requests" className={navLinkClass}>
                    <FaTasks className="text-sm shrink-0" /> Agreement Requests
                  </NavLink>
                  <NavLink to="/dashboard/manage-coupons" className={navLinkClass}>
                    <FaPlus className="text-sm shrink-0" /> Manage Coupons
                  </NavLink>
                  <NavLink to="/dashboard/chat" className={navLinkClass}>
                    <FaComments className="text-sm shrink-0" /> Member Messages
                  </NavLink>
                </>
              )}
            </nav>
          </div>

          {/* Bottom User Card Profile Info */}
          <div className="pt-4 border-t border-base-content/20 space-y-3 mt-6">
            <div className="flex items-center gap-3 p-3 bg-base-100 border border-base-content/20">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-base-content shrink-0">
                <img
                  src={user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                  }}
                  alt={user?.displayName || "User"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="truncate flex-1">
                <div className="text-xs font-black uppercase tracking-wider text-base-content truncate">
                  {user?.displayName || user?.email?.split("@")[0] || "User"}
                </div>
                <div className="text-[10px] text-base-content/70 font-mono truncate">
                  {user?.email}
                </div>
              </div>
            </div>

            <button
              onClick={() => logOut().catch(console.error)}
              className="w-full btn bg-base-content text-base-100 hover:bg-base-content/80 rounded-none text-xs font-black uppercase tracking-wider border-none flex items-center justify-center gap-2"
            >
              <FaSignOutAlt className="text-xs" /> Logout
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DashboardLayout;
