import React, { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import showToast from "../../../lib/toast";
import useAuth from "../../../hooks/useAuth";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import ImageUpload from "../ImageUpload/ImageUpload";
import { imageUpload } from "../../../api/utils";
import GoogleSignButton from "../GoogleSignButton/GoogleSignButton";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const imageUploadRef = useRef();
  const { createUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (
      !imageUploadRef.current ||
      !imageUploadRef.current.isValidImageUploaded()
    ) {
      showToast.warning("Please select a profile image to complete registration.");
      return;
    }

    const imageFile = imageUploadRef.current.getFile();

    try {
      const imageUrl = await imageUpload(imageFile);
      if (!imageUrl) {
        showToast.error("Image upload failed. Please try again.");
        return;
      }

      await createUser(data.email, data.password, data.displayName, imageUrl);

      const userInfo = {
        email: data.email,
        password: data.password,
        role: "user",
        last_log_in: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
      const userRes = await axiosPublic.post("/users", userInfo);

      showToast.success(userRes.data.inserted ? "Welcome to NEXORA!" : "Welcome back!");
      navigate(from, { replace: true });
    } catch (error) {
      showToast.error(error.message || "Registration failed.");
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-base-content/15">
        <span className="text-xs font-black uppercase tracking-widest text-base-content/60 block mb-1">
          New Resident Registration
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-base-content uppercase tracking-wide">
          Create Account
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Image Upload */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-base-content mb-1">
            Profile Avatar Image
          </label>
          <ImageUpload ref={imageUploadRef} />
        </div>

        {/* Name */}
        <div>
          <label htmlFor="displayName" className="block text-xs font-bold uppercase tracking-wider text-base-content mb-1">
            Full Name
          </label>
          <input
            {...register("displayName", { required: "Name is required" })}
            id="displayName"
            type="text"
            placeholder="e.g. John Doe"
            className="input input-bordered rounded-none border border-base-content/20 bg-base-100 text-base-content w-full focus:outline-none focus:border-base-content font-medium"
          />
          {errors.displayName && (
            <p className="text-rose-500 font-bold text-xs mt-1">
              {errors.displayName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-base-content mb-1">
            Email Address
          </label>
          <input
            {...register("email", { required: "Email is required" })}
            id="email"
            type="email"
            placeholder="you@example.com"
            className="input input-bordered rounded-none border border-base-content/20 bg-base-100 text-base-content w-full focus:outline-none focus:border-base-content font-medium"
          />
          {errors.email && (
            <p className="text-rose-500 font-bold text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-base-content mb-1">
            Account Password
          </label>
          <div className="relative">
            <input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                pattern: {
                  value: /[!@#$%^&*(),.?":{}|<>]/,
                  message: "Include at least one special character",
                },
              })}
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="input input-bordered rounded-none border border-base-content/20 bg-base-100 text-base-content w-full pr-10 focus:outline-none focus:border-base-content font-medium"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60 hover:text-base-content cursor-pointer p-1"
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-rose-500 font-bold text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn bg-base-content text-base-100 hover:bg-base-content/80 rounded-none w-full font-bold uppercase text-xs tracking-wider border-none py-3 mt-2"
        >
          Create Resident Account
        </button>

        {/* Login Link */}
        <div className="pt-2 text-center text-xs font-bold text-base-content/80">
          Already have an account?{" "}
          <Link to="/login" className="text-base-content font-black hover:underline uppercase tracking-wider">
            Sign In Here
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

export default Register;
