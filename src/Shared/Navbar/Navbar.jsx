import { Link, NavLink } from "react-router";
import useAuth from "../../hooks/useAuth";
import Toggle from "../component/Toggle/Toggle";
import Logo from "../Logo/Logo";
const Navbar = () => {
  const { user, logOut } = useAuth();

  const links = (
    <>
      <li className="mr-3">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "btn btn-md btn-primary"
              : "btn btn-md btn-ghost hover:text-white"
          }
        >
          Home
        </NavLink>
      </li>

      <li className="mr-3">
        <NavLink
          to="apartments"
          className={({ isActive }) =>
            isActive
              ? "btn btn-md btn-primary"
              : "btn btn-md btn-ghost hover:text-white"
          }
        >
          Apartment
        </NavLink>
      </li>

      {user && (
        <li className="mr-3">
          <NavLink
            to="dashboard"
            className={({ isActive }) =>
              isActive
                ? "btn btn-md btn-primary"
                : "btn btn-md btn-ghost hover:text-white"
            }
          >
            Dashboard
          </NavLink>
        </li>
      )}

      <li className="mr-3">
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive
              ? "btn btn-md btn-primary"
              : "btn btn-md btn-ghost hover:text-white"
          }
        >
          About Us
        </NavLink>
      </li>
    </>
  );

  return (
    <div
      className="navbar   sticky top-0 z-[70] shadow-2xl  rounded-xl   bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--color-base-100)_90%)]
    text-[color:var(--color-base-content)]
    border-r border-[rgba(0,0,0,0.1)]"
    >
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
            <Link to="/login" className="btn btn-primary btn-sm mr-2">
              Sign In
            </Link>
          </>
        ) : (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img src={user?.photoURL} alt="User Avatar" />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-md dropdown-content z-[99] bg-base-100 rounded-box mt-3 w-52 p-2 shadow"
            >
              <li className="text-lg text-center font-bold text-secondary">
                <span>{user?.displayName}</span>
              </li>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <button
                  onClick={() => logOut().catch(console.error)}
                  className="text-white bg-primary"
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
