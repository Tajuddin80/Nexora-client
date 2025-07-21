
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loader from "../../../Shared/component/Loader/Loader";

const AgreementRequests = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  //  Fetch pending agreement requests
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

  //  Mutation for accept/reject
  const mutation = useMutation({
    mutationFn: async ({ id, userEmail, action }) => {
      const res = await axiosSecure.patch(`/agreements/${id}`, {
        action,
        userEmail,
      });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["agreements"]);
      Swal.fire({
        icon: "success",
        title: `Agreement ${
          variables.action === "accept" ? "Accepted" : "Rejected"
        }`,
        timer: 1500,
        showConfirmButton: false,
      });
    },
    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: "Operation failed",
        text: err?.response?.data?.message || err.message,
      });
    },
  });

  const handleAction = (id, userEmail, action) => {
    //  Show a confirm modal with blur background
    Swal.fire({
      title: `Are you sure to ${action}?`,
      text: `This request will be marked as ${action}.`,
      icon: action === "accept" ? "info" : "warning",
      showCancelButton: true,
      confirmButtonColor: action === "accept" ? "#16a34a" : "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${action}`,
      background: "#fff",
      backdrop: `
        rgba(0,0,0,0.4)
        blur(5px)
      `,
    }).then((result) => {
      if (result.isConfirmed) {
        mutation.mutate({ id, userEmail, action });
      }
    });
  };

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <div className="p-4 text-red-500">Error: {error?.message || "Error"}</div>
    );

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4">Agreement Requests</h2>

      {requests.length === 0 ? (
        <p>No pending requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full border">
            <thead className="bg-primary text-white">
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
                  <td>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() =>
                          handleAction(req._id, req.userEmail, "accept")
                        }
                        className="btn btn-sm bg-green-500 text-white hover:bg-green-600"
                        disabled={mutation.isLoading}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleAction(req._id, req.userEmail, "reject")
                        }
                        className="btn btn-sm bg-red-500 text-white hover:bg-red-600"
                        disabled={mutation.isLoading}
                      >
                        Reject
                      </button>
                    </div>
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
