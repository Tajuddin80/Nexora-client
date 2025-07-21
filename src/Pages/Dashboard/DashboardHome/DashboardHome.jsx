import useUserRole from "../../../hooks/useUserRole";
import Loader from "../../../Shared/component/Loader/Loader";
import AdminDashboard from "./AdminDashboard";
import MemberDashboard from "./MemberDashboard";
import UserDashboard from "./UserDashboard";

const DashboardHome = () => {
  const { role, roleLoading, isRoleError } = useUserRole();

  if (roleLoading) return <Loader />;
  if (isRoleError)
    return <p className="text-center text-red-500">Error fetching role</p>;

  if (role === "admin") return <AdminDashboard />;
  if (role === "member") return <MemberDashboard />;
  if (role === "user") return <UserDashboard />;

  return <Forbidden />;
};

export default DashboardHome;
