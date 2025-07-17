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
import Apartments from "../Pages/Home/Apartments/Apartments";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout></HomeLayout>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        index: true,
        element: <Home></Home>,
      },
         {
        path: 'apartments',
        element: <Apartments></Apartments>
      },
      {
        path: 'forbidden',
        element: <Forbidden></Forbidden>
      }
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
    path: 'dashboard',
    element: <DashboardLayout></DashboardLayout>,
    errorElement: <ErrorPage></ErrorPage>
  }
]);
