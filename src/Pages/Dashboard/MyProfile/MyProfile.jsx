import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import RentStatusMonitor from "./RentStatusMonitor";
import Loader from "../../../Shared/component/Loader/Loader";

const MyProfile = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  //  fetch accepted agreement
  const { data: acceptedAgreement, isLoading } = useQuery({
    queryKey: ["accepted-agreement", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/agreements/user/${user.email}?status=accepted`
      );
      //  never return undefined
      return res.data.length > 0 ? res.data[0] : null;
    },
    enabled: !!user?.email,
  });

  //  fetch role
  const { data: roleData } = useQuery({
    queryKey: ["user-role", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}/role`);
      return res.data?.role ?? "user"; // fallback to "user"
    },
    enabled: !!user?.email,
  });

  if (!user) {
    return <p className="p-4">Please log in to see your profile.</p>;
  }
  if (isLoading) {
    return <Loader></Loader>;
  }

  // Show apartment details only if there is an accepted agreement
  const floor = acceptedAgreement ? acceptedAgreement.floor : "None";
  const block = acceptedAgreement ? acceptedAgreement.block : "None";
  const apartmentNo = acceptedAgreement
    ? acceptedAgreement.apartmentNo
    : "None";
  const rent = acceptedAgreement ? acceptedAgreement.rent : "None";
  const acceptDate = acceptedAgreement
    ? new Date(
        acceptedAgreement.decisionAt || acceptedAgreement.createdAt
      ).toLocaleDateString()
    : "None";

  return (
    <div className="p-6 mx-auto bg-base-100 rounded-xl shadow-md">
      {/* <RentStatusMonitor /> */}

      <h2 className="text-3xl font-bold mb-6">My Profile</h2>

      {/*  User Info */}
      <div className="flex items-center gap-6 mb-8">
        <img
          src={user.photoURL || "https://via.placeholder.com/100"}
          alt={user.displayName || "User"}
          className="w-24 h-24 rounded-full object-cover border-2 border-primary"
        />
        <div>
          <p className="text-xl font-semibold">
            {user.displayName || "Anonymous User"}
          </p>
          <p className="text-base text-gray-500">{user.email}</p>
        </div>
      </div>

      {/*  Apartment Info */}
      <h3 className="text-2xl font-semibold mb-4">Apartment Details</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-3 border rounded-lg">
          <p className="text-sm text-gray-500">Floor</p>
          <p className="font-medium">{floor}</p>
        </div>
        <div className="p-3 border rounded-lg">
          <p className="text-sm text-gray-500">Block</p>
          <p className="font-medium">{block}</p>
        </div>
        <div className="p-3 border rounded-lg">
          <p className="text-sm text-gray-500">Room No</p>
          <p className="font-medium">{apartmentNo}</p>
        </div>
        <div className="p-3 border rounded-lg">
          <p className="text-sm text-gray-500">Rent</p>
          <p className="font-medium">{rent}</p>
        </div>
        <div className="p-3 border rounded-lg col-span-2 md:col-span-1">
          <p className="text-sm text-gray-500">Agreement Accepted On</p>
          <p className="font-medium">{acceptDate}</p>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
