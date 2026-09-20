import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL || "http://localhost:5000",
  withCredentials: true,
});

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { user, logOut } = useAuth();

  useEffect(() => {
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        const token = user?.accessToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        if (user?.email) {
          config.headers["x-user-email"] = user.email;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosSecure.interceptors.response.use(
      (res) => res,
      (error) => {
        const status = error?.response?.status;
        if (status === 403) {
          const url = error?.config?.url || "";
          const isPaymentAction =
            url.includes("/create-payment-intent") ||
            url.includes("/rent-payments") ||
            url.includes("/coupons/validate");

          if (!isPaymentAction && window.location.pathname !== "/forbidden") {
            navigate("/forbidden");
          }
        } else if (status === 401) {
          logOut()
            .then(() => navigate("/login"))
            .catch(console.log);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [user, navigate, logOut]);

  return axiosSecure;
};

export default useAxiosSecure;
