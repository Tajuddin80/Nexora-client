import React from "react";
import { Link, NavLink } from "react-router";
import useAuth from "../../hooks/useAuth";
import Toggle from "../component/Toggle/Toggle";
import Logo from "../Logo/Logo";
import NavbarNotificationBell from "./NavbarNotificationBell";

const Navbar = () => {
  const { user, logOut } = useAuth();

  const activeStyle = "text-base-content font-black text-xs uppercase tracking-widest px-3 py-2 border-b-2 border-base-content";
  const inactiveStyle = "text-base-content/75 hover:text-base-content font-bold text-xs uppercase tracking-widest px-3 py-2 border-b-2 border-transparent transition-colors";

  const links = (
    <>
      <li className="mr-2">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
        >
          Home
        </NavLink>
      </li>

      <li className="mr-2">
        <NavLink
          to="apartments"
          className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
        >
          Apartment
        </NavLink>
      </li>

      {user && (
        <li className="mr-2">
          <NavLink
            to="dashboard"
            className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
          >
            Dashboard
          </NavLink>
        </li>
      )}

      <li className="mr-2">
        <NavLink
          to="/about"
          className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
        >
          About Us
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="navbar sticky top-0 z-[70] shadow-xs rounded-none w-full px-4 md:px-10 border-b border-base-content/20 bg-base-100 text-base-content">
      {/* Left: mobile menu & text logo */}
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden rounded-none text-base-content p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 text-base-content border border-base-content/20 rounded-none mt-3 w-52 p-2 shadow-lg z-[99]"
          >
            {links}
          </ul>
        </div>
        <Logo />
      </div>

      {/* Center: desktop menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-1 items-center">{links}</ul>
      </div>

      {/* Right: auth buttons or avatar */}
      <div className="navbar-end gap-3">
        <Toggle />
        {user && <NavbarNotificationBell />}
        {!user ? (
          <Link
            to="/login"
            className="btn bg-base-content text-base-100 hover:bg-base-content/80 rounded-none text-xs font-bold uppercase tracking-wider px-5 py-2 border-none"
          >
            Sign In
          </Link>
        ) : (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar border border-base-content"
            >
              <div className="w-10 rounded-full overflow-hidden">
                <img
                  src={user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                  }}
                  alt="User Avatar"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-md dropdown-content z-[99] bg-base-100 text-base-content border border-base-content/20 rounded-none mt-3 w-56 p-3 shadow-lg"
            >
              <li className="text-center font-black uppercase tracking-wider text-base-content border-b border-base-content/10 pb-2 mb-2">
                <span>{user?.displayName || user?.email?.split("@")[0]}</span>
              </li>
              <li>
                <Link to="/dashboard" className="text-xs font-bold uppercase tracking-wider text-base-content">
                  Dashboard
                </Link>
              </li>
              <li>
                <button
                  onClick={() => logOut().catch(console.error)}
                  className="bg-base-content text-base-100 rounded-none text-xs font-bold uppercase tracking-wider mt-2 hover:bg-base-content/80"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
