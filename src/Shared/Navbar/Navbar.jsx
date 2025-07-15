import { Link, NavLink } from "react-router";
import useAuth from "../../hooks/useAuth";
import Toggle from "../component/Toggle/Toggle";
import Logo from "../Logo/Logo";
const Navbar = () => {
  const { user, logOut } = useAuth();

  const links = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "btn btn-sm btn-primary" : "btn btn-sm btn-ghost"
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/sendParcel"
          className={({ isActive }) =>
            isActive ? "btn btn-sm btn-primary" : "btn btn-sm btn-ghost"
          }
        >
          Send a Parcel
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/coverage"
          className={({ isActive }) =>
            isActive ? "btn btn-sm btn-primary" : "btn btn-sm btn-ghost"
          }
        >
          Coverage
        </NavLink>
      </li>
      {user && (
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "btn btn-sm btn-primary" : "btn btn-sm btn-ghost"
            }
          >
            Dashboard
          </NavLink>
        </li>
      )}
      <li>
        <NavLink
          to="/pricingCalculator"
          className={({ isActive }) =>
            isActive ? "btn btn-sm btn-primary" : "btn btn-sm btn-ghost"
          }
        >
          Pricing
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/be-a-rider"
          className={({ isActive }) =>
            isActive ? "btn btn-sm btn-primary" : "btn btn-sm btn-ghost"
          }
        >
          Be a Rider
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/aboutUs"
          className={({ isActive }) =>
            isActive ? "btn btn-sm btn-primary" : "btn btn-sm btn-ghost"
          }
        >
          About Us
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="navbar bg-base-100  sticky top-0 z-40 shadow-2xl border rounded-xl">
      {/* Left: mobile menu & logo */}
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
            className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow"
          >
            {links}
          </ul>
        </div>
      <Logo></Logo>
      </div>

      {/* Center: desktop menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{links}</ul>
      </div>

      {/* Right: auth buttons or avatar */}
      <div className="navbar-end">
        <Toggle></Toggle>
        {!user ? (
          <>
            <Link to="/signin" className="btn btn-primary btn-sm mr-2">
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Register
            </Link>
          </>
        ) : (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src={user?.photoURL} alt="User Avatar" />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/dashboard/updateProfile">Profile</Link>
              </li>
              <li>
                <button
                  onClick={() => logOut().catch(console.error)}
                  className="text-red-500"
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
