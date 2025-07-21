import { Link } from "react-router";
import ErrorLottie from "../../assets/404.json";
import Lottie from "lottie-react";
const ErrorPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 md:p-10 rounded-3xl shadow-lg ">
      <div className="w-full max-w-md md:max-w-lg mx-auto my-5">
        <Lottie animationData={ErrorLottie} loop={true} />
      </div>
      <div>
        <Link
          to="/"
          className="btn bg-primary text-white rounded-lg px-6 py-3 text-lg font-semibold  transition"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
