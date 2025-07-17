import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AgreementRequests = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // ✅ Fetch pending agreements
  const {
    data: requests = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["agreements"],
    queryFn: async () => {
      const res = await axiosSecure.get("/agreements?status=pending");
      return res.data;
    },
  });

  // ✅ Mutation for accept/reject
  const mutation = useMutation({
    mutationFn: async ({ id, userEmail, action }) => {
      const res = await axiosSecure.patch(`/agreements/${id}`, { action, userEmail });
      return res.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch agreements
      queryClient.invalidateQueries(["agreements"]);
      Swal.fire({
        icon: "success",
        title: `Agreement ${variables.action === "accept" ? "Accepted" : "Rejected"}!`,
        timer: 1500,
        showConfirmButton: false,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Operation failed",
        text: error?.message || "Something went wrong",
      });
    },
  });

  const handleAction = (id, userEmail, action) => {
    mutation.mutate({ id, userEmail, action });
  };

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (isError) return <div className="p-4 text-red-500">Error: {error.message}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4"> Agreement Requests</h2>
      {requests.length === 0 ? (
        <p>No pending requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>User Name</th>
                <th>User Email</th>
                <th>Floor</th>
                <th>Block</th>
                <th>Room</th>
                <th>Rent</th>
                <th>Request Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id}>
                  <td>{req.userName}</td>
                  <td>{req.userEmail}</td>
                  <td>{req.floor}</td>
                  <td>{req.block}</td>
                  <td>{req.apartmentNo}</td>
                  <td>{req.rent}</td>
                  <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                  <td className="flex gap-2">
                    <button
                      onClick={() => handleAction(req._id, req.userEmail, "accept")}
                      className="btn btn-sm bg-green-500 text-white hover:bg-green-600"
                      disabled={mutation.isLoading}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleAction(req._id, req.userEmail, "reject")}
                      className="btn btn-sm bg-red-500 text-white hover:bg-red-600"
                      disabled={mutation.isLoading}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AgreementRequests;
