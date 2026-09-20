import Navbar from "../../Shared/Navbar/Navbar";
import Footer from "../../Shared/Footer/Footer";
import { Outlet } from "react-router";
import SmoothScroll from "../../Shared/SmoothScroll/SmoothScroll";
import { Toaster } from "react-hot-toast";

const HomeLayout = () => {
  return (
    <SmoothScroll>
      <div className="min-h-screen w-full flex flex-col overflow-x-hidden">
        <Toaster position="top-right" reverseOrder={false} />
        <Navbar />

        <main className="flex-grow w-full">
          <Outlet />
        </main>

        <Footer />
      </div>
    </SmoothScroll>
  );
};

export default HomeLayout;
