import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { FaEye, FaEyeSlash, FaLock, FaEnvelope } from "react-icons/fa";
import showToast from "../../../lib/toast";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useAuth from "../../../hooks/useAuth";
import GoogleSignButton from "../GoogleSignButton/GoogleSignButton";

const Login = () => {
  const { signIn, setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const from = location.state?.from || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      // 1. Authenticate user via backend login endpoint
      const loginRes = await axiosPublic.post("/users/login", { email, password });

      // 2. Also authenticate with Better Auth client session
      try {
        await signIn(email, password);
      } catch (err) {
        // Fallback if better-auth session uses custom response
        const userObj = {
          email,
          role: loginRes.data.user?.role || "user",
          accessToken: loginRes.data.token || "",
        };
        setUser(userObj);
      }

      showToast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      showToast.error(error.response?.data?.message || error.message || "Invalid email or password");
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-base-content/15">
        <span className="text-xs font-black uppercase tracking-widest text-base-content/60 block mb-1">
          Resident & Staff Portal
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-base-content uppercase tracking-wide">
          Account Login
        </h2>
      </div>

      <form className="space-y-4" onSubmit={handleLogin}>
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-bold uppercase tracking-wider text-base-content mb-1"
          >
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              className="input input-bordered rounded-none border border-base-content/20 bg-base-100 text-base-content w-full focus:outline-none focus:border-base-content font-medium"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label
              htmlFor="password"
              className="block text-xs font-bold uppercase tracking-wider text-base-content"
            >
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-bold text-base-content/75 hover:text-base-content hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="••••••••"
              className="input input-bordered rounded-none border border-base-content/20 bg-base-100 text-base-content w-full pr-10 focus:outline-none focus:border-base-content font-medium"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60 hover:text-base-content cursor-pointer p-1"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn bg-base-content text-base-100 hover:bg-base-content/80 rounded-none w-full font-bold uppercase text-xs tracking-wider border-none py-3 mt-2"
        >
          Sign In to Portal
        </button>

        {/* Register Link */}
        <div className="pt-2 text-center text-xs font-bold text-base-content/80">
          Don’t have an account?{" "}
          <Link to="/register" className="text-base-content font-black hover:underline uppercase tracking-wider">
            Register Here
          </Link>
        </div>
      </form>

      {/* Divider */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-base-content/15"></div>
        </div>
        <div className="relative flex justify-center text-xs font-bold uppercase tracking-widest">
          <span className="bg-base-100 px-3 text-base-content/60">OR</span>
        </div>
      </div>

      {/* Google Sign In */}
      <GoogleSignButton />
    </div>
  );
};

export default Login;
