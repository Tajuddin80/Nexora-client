import { Outlet } from "react-router";
import Lottie from "lottie-react";

import logo from "../../assets/login.json";
const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
   
      <div className="flex-1 flex items-center justify-center text-white p-6">
   
        <Lottie animationData={logo} loop={true} />
      </div>

  
      <div className="flex-1 flex items-center justify-center p-6 bg-base-100">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
