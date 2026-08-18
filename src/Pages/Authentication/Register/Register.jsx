import React, { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import showToast from "../../../lib/toast";
import { useForm } from "react-hook-form";
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
    <div className="min-h-screen flex items-center justify-center bg-base-100 p-4">
      <div className="w-full bg-base-100 rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-start">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Image Upload */}
          <div>
            <h4 className="text-base font-medium mb-2">Profile Image</h4>
            <ImageUpload ref={imageUploadRef} />
          </div>

          {/* Name */}
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium">
              Name
            </label>
            <input
              {...register("displayName", { required: "Name is required" })}
              id="displayName"
              type="text"
              placeholder="Your full name"
              className="input input-bordered w-full mt-1"
            />
            {errors.displayName && (
              <p className="text-error text-sm mt-1">
                {errors.displayName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              {...register("email", { required: "Email is required" })}
              id="email"
              type="email"
              placeholder="you@example.com"
              className="input input-bordered w-full mt-1"
            />
            {errors.email && (
              <p className="text-error text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
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
                placeholder="••••••"
                className="input input-bordered w-full pr-10 mt-1"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 z-10"
                tabIndex={-1}
              >
                {showPassword ? (
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
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
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
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95M6.347 6.347A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.96 9.96 0 01-4.21 5.568M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3l18 18"
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-error text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Login Link */}
          <p className="text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Login here
            </Link>
          </p>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-full">
            Register
          </button>
        </form>

        {/* Divider */}
        <div className="divider">OR</div>

        {/* Google Sign In */}
        <GoogleSignButton />
      </div>
    </div>
  );
};

export default Register;
