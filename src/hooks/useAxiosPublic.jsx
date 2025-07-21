import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "https://nexora-server-nine.vercel.app",
});
const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
