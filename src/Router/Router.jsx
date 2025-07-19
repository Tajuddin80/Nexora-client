import React from "react";
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
import MakePayment from "../Pages/Dashboard/MakePayment/MakePayment";
import PaymentHistory from "../Pages/Dashboard/PaymentHistory/PaymentHistory";
import AdminProfile from "../Pages/Dashboard/AdminProfile/AdminProfile";
import ManageMembers from "../Pages/Dashboard/ManageMembers/ManageMembers";
// import MakeAnnouncement from "../Pages/Dashboard/MakeAnnouncement/MakeAnnouncement";
import AgreementRequests from "../Pages/Dashboard/AgreementRequests/AgreementRequests";
import ManageCoupons from "../Pages/Dashboard/ManageCoupons/ManageCoupons";
import MyProfile from "../Pages/Dashboard/MyProfile/MyProfile";
import Apartments from "../Pages/Apartments/Apartments";
import About from "../Pages/About/About";
import DashboardHome from "../Pages/Dashboard/DashboardHome/DashboardHome";

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
    element: <DashboardLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <DashboardHome></DashboardHome> },
      // USER & MEMBER common
      { path: "my-profile", element: <MyProfile /> },
      { path: "announcements", element: <Announcements /> },

      // MEMBER extra
      { path: "makepayment", element: <MakePayment /> },
      { path: "payment-history", element: <PaymentHistory /> },

      // ADMIN extra
      { path: "admin-profile", element: <AdminProfile /> },
      { path: "manage-members", element: <ManageMembers /> },
      { path: "agreement-requests", element: <AgreementRequests /> },
      { path: "manage-coupons", element: <ManageCoupons /> },
    ],
  },
]);
