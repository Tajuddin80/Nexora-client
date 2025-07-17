import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const MakePayment = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // ✅ Fetch unpaid rents for this user
  const {
    data: unpaidRents = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["unpaid-rents", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/rent-payments/${user.email}?status=unpaid`
      );
      return res.data;
    },
    enabled: !!user?.email, // only run when user is available
  });

  // ✅ Mutation to mark rent as paid
  const mutation = useMutation({
    mutationFn: async (rentId) => {
      const res = await axiosSecure.patch(`/rent-payments/${rentId}`, {
        status: "paid",
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["unpaid-rents"]);
      Swal.fire({
        icon: "success",
        title: "Rent Paid Successfully!",
        timer: 1500,
        showConfirmButton: false,
      });
    },
    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: err?.message || "Please try again later",
      });
    },
  });

  const handlePay = (rentId, month, amount) => {
    Swal.fire({
      title: `Pay rent for ${month}?`,
      text: `Amount: ${amount} Tk`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Yes, Pay Now",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        mutation.mutate(rentId);
      }
    });
  };

  if (isLoading) {
    return <p className="p-4">Loading payment info...</p>;
  }

  if (isError) {
    return (
      <p className="p-4 text-red-500">
        Error loading payments: {error.message}
      </p>
    );
  }

  return (
    <div className="p-6 mx-auto">
      <h2 className="text-2xl font-bold mb-6"> Make Payment</h2>

      {unpaidRents.length === 0 ? (
        <p className="text-green-600 font-medium">
          ✅ You have no pending rents. All payments are up to date!
        </p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="table w-full">
            <thead className="bg-base-100">
              <tr>
                <th>Month</th>
                <th>Amount (Tk)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {unpaidRents.map((rent) => (
                <tr key={rent._id}>
                  <td>{rent.month}</td>
                  <td>{rent.amount}</td>
                  <td>
                    <button
                      onClick={() =>
                        handlePay(rent._id, rent.month, rent.amount)
                      }
                      className="btn btn-sm bg-primary text-white hover:bg-primary/80"
                      disabled={mutation.isLoading}
                    >
                      Pay Now
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

export default MakePayment;
