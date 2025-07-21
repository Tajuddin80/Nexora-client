import { Outlet } from "react-router";
import Lottie from "lottie-react";
import logo from "../../assets/login.json";
import Logo from "../../Shared/Logo/Logo";

const AuthLayout = () => {
  return (
    <>
      <div className="mt-5 flex justify-center">
        <Logo />
      </div>
      <div className="flex min-h-[70vh] flex-col-reverse lg:flex-row p-6 gap-6 lg:gap-12">
        <div className="flex-1 flex items-center justify-center bg-base-100 text-base-content rounded-lg p-6 ">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-48 sm:w-72 md:w-80 lg:w-96 max-w-full">
            <Lottie
              animationData={logo}
              loop={true}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
