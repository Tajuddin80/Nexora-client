import React from "react";
import { useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useAuth from "../../../hooks/useAuth";

const GoogleSignButton = () => {
  const { signInWithGoogle, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const from = location.state?.from || "/";

  const handleGoogleSignIn = async () => {
    if (loading) return;
    try {
      const result = await signInWithGoogle();

      // Ensure user info is saved to your backend /users MongoDB endpoint
      if (result?.data?.user || result?.user) {
        const loggedUser = result?.data?.user || result?.user;
        const userInfo = {
          email: loggedUser.email,
          role: "user",
          last_log_in: new Date().toISOString(),
          created_at: new Date().toISOString(),
        };

        try {
          const userRes = await axiosPublic.post("/users", userInfo);
          let title = "Welcome back!";
          if (userRes.data.inserted) {
            title = "Welcome to NEXORA!";
          }

          Swal.fire({
            icon: "success",
            title,
            showConfirmButton: false,
            timer: 1500,
            toast: true,
            position: "center",
          });
        } catch (dbErr) {
          console.error("Error posting to /users endpoint:", dbErr);
        }
      }

      setTimeout(() => {
        navigate(from || "/", { replace: true });
      }, 1600);
    } catch (error) {
      console.error("Google sign-in error:", error);
      Swal.fire({
        icon: "error",
        title: "Google Sign-in Failed",
        text: error?.message || "Could not connect to Google authentication.",
      });
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      type="button"
      disabled={loading}
      className="w-full flex btn btn-primary cursor-pointer items-center justify-center border rounded-md py-2 mb-4 hover:shadow"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="w-5 h-5 mr-2 fill-current"
      >
        <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z"></path>
      </svg>
      Continue with Google
    </button>
  );
};

export default GoogleSignButton;
