import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loader from "../../../Shared/component/Loader/Loader";

export default function ManageMembars() {
  const queryClient = useQueryClient();
  const [selectedDue, setSelectedDue] = useState([]);
  const axiosSecure = useAxiosSecure();
  const { data: members = [], isLoading } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const res = await axiosSecure.get("/members");
      return res.data;
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (email) => {
      await axiosSecure.patch(`/members/${email}/remove`);
    },
    onSuccess: () => {
      Swal.fire("Removed!", "Member role changed to user.", "success");
      queryClient.invalidateQueries(["members"]);
    },
  });

  const handleRemove = (email) => {
    Swal.fire({
      title: "Are you sure?",
      text: "They will lose member access.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove!",
    }).then((result) => {
      if (result.isConfirmed) {
        removeMutation.mutate(email);
      }
    });
  };

  const handleShowDue = async (email) => {
    const res = await axiosSecure.get(`/members/${email}/due-months`);
    setSelectedDue(res.data);
    Swal.fire({
      title: `Due months for ${email}`,
      html: res.data.length
        ? `<ul>${res.data
            .map((m) => `<li>${m.month} (${m.amount}৳)</li>`)
            .join("")}</ul>`
        : "No dues",
      confirmButtonText: "OK",
    });
  };

  if (isLoading) return <Loader></Loader>;

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4">Manage Members</h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-primary">
            <th className="border p-2 text-white">Name</th>
            <th className="border p-2 text-white">Email</th>
            <th className="border p-2 text-white">Room No</th>
            <th className="border p-2 text-white">Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m._id}>
              <td className="border p-2">{m.userName || "(no name)"}</td>
              <td className="border p-2">{m.email}</td>
              <td className="border p-2">{m.apartmentNo}</td>

              <td className="border p-2 text-center space-x-2">
                <button
                  onClick={() => handleShowDue(m.email)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  View Dues
                </button>
                <button
                  onClick={() => handleRemove(m.email)}
                  className="bg-red-500 text-white  px-2 py-1 rounded"
                >
                  Remove Member
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
