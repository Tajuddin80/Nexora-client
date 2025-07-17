import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const PaymentHistory = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // ✅ Fetch paid rents
  const {
    data: paidRents = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["paid-rents", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/rent-payments/${user.email}?status=paid`
      );
      return res.data;
    },
    enabled: !!user?.email, // only run if user is available
  });

  if (isLoading) {
    return <p className="p-4">Loading payment history...</p>;
  }

  if (isError) {
    return (
      <p className="p-4 text-red-500">
        Error loading history: {error.message}
      </p>
    );
  }

  return (
    <div className="p-6 mx-auto">
      <h2 className="text-2xl font-bold mb-6">Payment History</h2>

      {paidRents.length === 0 ? (
        <p className="text-gray-600 font-medium">
          ℹ️ No payments have been made yet.
        </p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="table w-full">
            <thead className="bg-base-100">
              <tr>
                <th>#</th>
                <th>Month</th>
                <th>Amount (Tk)</th>
                <th>Paid At</th>
              </tr>
            </thead>
            <tbody>
              {paidRents.map((rent, index) => (
                <tr key={rent._id}>
                  <td>{index + 1}</td>
                  <td>{rent.month}</td>
                  <td>{rent.amount}</td>
                  <td>
                    {rent.paidAt
                      ? new Date(rent.paidAt).toLocaleString()
                      : "—"}
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

export default PaymentHistory;
