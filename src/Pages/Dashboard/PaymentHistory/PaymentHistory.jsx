import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../../Shared/component/Loader/Loader";
import { FaListAlt } from "react-icons/fa";

const PaymentHistory = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  //  Fetch paid rents
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
    enabled: !!user?.email,
  });

  if (isLoading) {
    return <Loader />;
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
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-primary">
        <FaListAlt className="text-primary" size={24} />
        Payment History
      </h2>

      {paidRents.length === 0 ? (
        <p className="text-gray-600 font-medium">
          No payments have been recorded yet.
        </p>
      ) : (
        <div className="overflow-x-auto border rounded-xl shadow-sm">
          <table className="table w-full">
            <thead className="bg-base-100">
              <tr>
                <th>#</th>
                <th>Month</th>
                <th>Amount (Tk)</th>
                <th>Paid At</th>
                <th>Transaction ID</th>
              </tr>
            </thead>
            <tbody>
              {paidRents.map((rent, index) => (
                <tr key={rent._id} className="hover:bg-base-100">
                  <td>{index + 1}</td>
                  <td>{rent.month}</td>
                  <td className="font-semibold text-green-700">
                    {rent.amount}
                  </td>
                  <td>
                    {rent.paidAt
                      ? new Date(rent.paidAt).toLocaleString()
                      : "—"}
                  </td>
                  <td className="text-sm text-gray-700 break-all">
                    {rent.transactionId ? rent.transactionId : "—"}
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
