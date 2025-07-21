import { createBrowserRouter } from "react-router";
import HomeLayout from "../Layouts/HomeLayout/HomeLayout";
import Home from "../Pages/Home/Home";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import Register from "../Pages/Authentication/Register/Register";
import Login from "../Pages/Authentication/Login/Login";
import AuthLayout from "../Layouts/AuthLayout/AuthLayout";
import Forbidden from "../Pages/Forbidden/Forbidden";
import DashboardLayout from "../Layouts/DashboardLayout/DashboardLayout";

// Dashboard pages
import Announcements from "../Pages/Dashboard/Announcements/Announcements";
import PaymentHistory from "../Pages/Dashboard/PaymentHistory/PaymentHistory";
import AdminProfile from "../Pages/Dashboard/AdminProfile/AdminProfile";
import ManageMembars from "../Pages/Dashboard/ManageMembars/ManageMembars";
import AgreementRequests from "../Pages/Dashboard/AgreementRequests/AgreementRequests";
import ManageCoupons from "../Pages/Dashboard/ManageCoupons/ManageCoupons";
import MyProfile from "../Pages/Dashboard/MyProfile/MyProfile";
import Apartments from "../Pages/Apartments/Apartments";
import About from "../Pages/About/About";
import DashboardHome from "../Pages/Dashboard/DashboardHome/DashboardHome";
import Payment from "../Pages/Dashboard/Payment/Payment";
import AdminRoute from "../ProtectedRoutes/AdminRoute";
import MembarRoute from "../ProtectedRoutes/MembarRoute";
import PrivateRoute from "../ProtectedRoutes/PrivateRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout></HomeLayout>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        index: true,
        loader: () => fetch("/reviews.json"),
        element: <Home></Home>,
      },
      {
        path: "apartments",
        element: <Apartments></Apartments>,
      },
      {
        path: "about",
        element: <About></About>,
      },
      {
        path: "forbidden",
        element: <Forbidden></Forbidden>,
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout></AuthLayout>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "login",
        element: <Login></Login>,
      },
      {
        path: "register",
        element: <Register></Register>,
      },

      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <DashboardHome></DashboardHome> },
      // USER & MEMBER common
      {
        path: "my-profile",
        element: (
          <PrivateRoute>
            <MyProfile />
          </PrivateRoute>
        ),
      },
      {
        path: "announcements",
        element: (
          <PrivateRoute>
            <Announcements />
          </PrivateRoute>
        ),
      },

      // MEMBER extra
      {
        path: "makepayment",
        element: (
          <MembarRoute>
            <Payment></Payment>
          </MembarRoute>
        ),
      },
      {
        path: "payment-history",
        element: (
          <MembarRoute>
            <PaymentHistory />
          </MembarRoute>
        ),
      },

      // ADMIN extra
      {
        path: "admin-profile",
        element: (
          <AdminRoute>
            <AdminProfile />
          </AdminRoute>
        ),
      },
      {
        path: "manage-members",
        element: (
          <AdminRoute>
            <ManageMembars />
          </AdminRoute>
        ),
      },
      {
        path: "agreement-requests",
        element: (
          <AdminRoute>
            <AgreementRequests />
          </AdminRoute>
        ),
      },
      {
        path: "manage-coupons",
        element: (
          <AdminRoute>
            <ManageCoupons />
          </AdminRoute>
        ),
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
]);
