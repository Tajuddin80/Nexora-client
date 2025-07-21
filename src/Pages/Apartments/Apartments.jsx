import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { FaStar, FaBath, FaUtensils, FaRulerCombined } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAxiosSecure from "../../hooks/useAxiosSecure";

function generatePageNumbers(currentPage, totalPages) {
  const delta = 2;
  const range = [];
  const rangeWithDots = [];
  let l;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      range.push(i);
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
}

const Apartments = () => {
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [page, setPage] = useState(1);
  const [minRentInput, setMinRentInput] = useState(20000);
  const [maxRentInput, setMaxRentInput] = useState(50000);
  const [minRent, setMinRent] = useState(0);
  const [maxRent, setMaxRent] = useState(9999999);
  const [sortBy, setSortBy] = useState("rent");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedApt, setSelectedApt] = useState(null);

  const location = useLocation();

  const fetchApartments = async ({ queryKey }) => {
    const [_key, page, minRent, maxRent, sortBy, sortOrder] = queryKey;
    const { data } = await axiosPublic.get(
      `/apartments?page=${page}&limit=8&minRent=${minRent}&maxRent=${maxRent}&sortBy=${sortBy}&sortOrder=${sortOrder}`
    );
    return data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["apartments", page, minRent, maxRent, sortBy, sortOrder],
    queryFn: fetchApartments,
    placeholderData: (prev) => prev, // keeps previous data while fetching
  });

  //  Fetch user agreements
  const { data: userAgreements = [] } = useQuery({
    queryKey: ["userAgreements", user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/agreements/user/${user.email}`);
      return response.data;
    },
    enabled: !!user?.email,
  });

  //  Handle Agreement
  const handleAgreement = async (apt) => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname }, replace: true });
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: `You are about to send an agreement request for Apartment ${apt.apartmentNo} (Floor: ${apt.floor}, Block: ${apt.block})`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, proceed",
      cancelButtonText: "Cancel",
      background: "#fff",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      //  Check if user already has active or checked agreement
      const activeAgreements = (userAgreements || []).filter(
        (a) =>
          a.status === "pending" ||
          a.status === "accepted" ||
          a.status === "rejected"
      );

      if (activeAgreements.length > 0) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "info",
          title: "You already have an pending or checked agreement.",
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
          background: "#fff",
        });
        return;
      }

      try {
        await axiosSecure.post("/agreements", {
          userName: user.displayName,
          userEmail: user.email,
          floor: apt.floor,
          block: apt.block,
          apartmentNo: apt.apartmentNo,
          rent: apt.rent,
          status: "pending",
          apartmentId: apt._id,
        });

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Agreement request sent!",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          background: "#fff",
        });
      } catch (err) {
        const errorMessage =
          err?.response?.data?.message || "Something went wrong!";
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: errorMessage,
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          background: "#fff",
        });
      }
    });
  };

  const handleDetails = (apt) => {
    setSelectedApt(apt);
    const modal = document.getElementById("apt_details_modal");
    if (modal) {
      modal.showModal();
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-primary">Apartments</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="rounded-xl shadow-md animate-pulse p-2 bg-secondary/10"
            >
              <div className="w-full h-48 bg-secondary/20 rounded mb-2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-secondary/20 rounded"></div>
                <div className="h-4 bg-secondary/20 rounded"></div>
                <div className="h-4 bg-secondary/20 rounded"></div>
                <div className="h-4 bg-secondary/20 rounded"></div>
                <div className="h-8 bg-secondary/20 rounded mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-red-500">Error loading apartments.</p>
    );
  }

  return (
    <div className="p-4 my-10">
      <h1 className="text-3xl md:text-4xl mt-3 font-bold mb-4 text-secondary">
        Apartments
      </h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <input
          type="number"
          value={minRentInput}
          onChange={(e) => setMinRentInput(e.target.value)}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Min Rent"
        />
        <input
          type="number"
          value={maxRentInput}
          onChange={(e) => setMaxRentInput(e.target.value)}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Max Rent"
        />
        <button
          onClick={() => {
            setMinRent(Number(minRentInput));
            setMaxRent(Number(maxRentInput));
            setPage(1);
          }}
          className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded shadow-md w-full md:w-auto"
        >
          Search
        </button>
      </div>

      {/* Sorting */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="rent">Sort by Rent</option>
          <option value="floor">Sort by Floor</option>
          <option value="block">Sort by Block</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            setPage(1);
          }}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {/* Apartments */}
      <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.apartments.map((apt) => (
          <motion.div
            key={apt._id}
            whileHover={{ scale: 1.02 }}
            className="relative rounded-xl shadow-lg overflow-hidden bg-secondary/10"
          >
            <div className="relative overflow-hidden">
              <motion.img
                src={apt.image}
                alt={apt.apartmentNo}
                className="w-full h-48 object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
              <span
                className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full text-white"
                style={{
                  backgroundColor: apt.available
                    ? "var(--badge-available)"
                    : "var(--badge-unavailable)",
                }}
              >
                {apt.available ? "Available" : "Unavailable"}
              </span>
              <div className="absolute top-3 right-3 flex gap-0.5 bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
                {[...Array(5)].map((_, idx) => (
                  <FaStar key={idx} className="text-yellow-400 w-4 h-4" />
                ))}
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div className="text-sm text-secondary space-y-0.5">
                  <p className="font-medium">
                    Floor: <span className="font-semibold">{apt.floor}</span>
                  </p>
                  <p className="font-medium">
                    Block: <span className="font-semibold">{apt.block}</span>
                  </p>
                  <p className="font-medium">
                    Apartment:{" "}
                    <span className="font-semibold">{apt.apartmentNo}</span>
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 text-secondary text-sm">
                  <div className="flex items-center gap-1">
                    <FaBath className="text-lg sm:text-xl" />
                    <span className="font-medium">{apt.washroomCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaUtensils className="text-lg sm:text-xl" />
                    <span className="font-medium">{apt.kitchenCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaRulerCombined className="text-lg sm:text-xl" />
                    <span className="font-medium">{apt.squareFeet} sqft</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-gray-500 line-through text-sm">
                  {Math.round(apt.rent * 1.1)} tk
                </span>
                <span className="text-xl font-bold text-secondary">
                  {apt.rent} tk
                </span>
              </div>
              <button
                onClick={() => handleDetails(apt)}
                className="w-full mt-4 bg-primary hover:bg-primary/80 cursor-pointer text-white py-2 rounded-lg font-medium shadow-md transition-colors"
              >
                Check Now
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <dialog id="apt_details_modal" className="modal">
        <div className="modal-box max-w-2xl text-secondary p-6 rounded-2xl shadow-2xl">
          {selectedApt && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-2xl md:text-3xl text-secondary">
                  Apartment {selectedApt.apartmentNo}
                </h3>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    selectedApt.available
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {selectedApt.available ? "Available" : "Unavailable"}
                </span>
              </div>
              <div className="overflow-hidden rounded-xl shadow-md">
                <img
                  src={selectedApt.image}
                  alt={selectedApt.apartmentNo}
                  className="w-full h-56 md:h-72 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 md:gap-6 text-base md:text-lg">
                <p>
                  <span className="font-semibold">Floor:</span>{" "}
                  {selectedApt.floor}
                </p>
                <p>
                  <span className="font-semibold">Block:</span>{" "}
                  {selectedApt.block}
                </p>
                <p>
                  <span className="font-semibold">Rent:</span>{" "}
                  <span className="text-xl font-bold">
                    {selectedApt.rent} tk
                  </span>
                </p>

                <p className="flex items-center gap-1">
                  <FaBath className="text-primary" /> Washrooms:{" "}
                  {selectedApt.washroomCount}
                </p>
                <p className="flex items-center gap-1">
                  <FaUtensils className="text-primary" /> Kitchen:{" "}
                  {selectedApt.kitchenCount}
                </p>
                <p className="flex items-center gap-1">
                  <FaRulerCombined className="text-primary" />{" "}
                  {selectedApt.squareFeet} sqft
                </p>
              </div>
              <p className="leading-relaxed text-sm md:text-base border-t pt-3 border-secondary/20">
                {selectedApt.description}
              </p>
            </div>
          )}
          <div className="modal-action mt-6">
            <form method="dialog" className="w-full">
              <div className="flex justify-between w-full">
                <button
                  onClick={() => {
                    if (!user) {
                      navigate("/login");
                    }
                    if (user && !selectedApt.available) {
                      Swal.fire({
                        icon: "error",
                        title: "Apartment Unavailable",
                        text: "Sorry, this apartment is no longer available.",
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                      });
                    } else {
                      handleAgreement(selectedApt);
                    }
                  }}
                  className="btn bg-primary hover:bg-primary/80 text-white px-6"
                >
                  Agreement
                </button>
                <button className="btn bg-primary hover:bg-primary/80 text-white px-6">
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
        <button
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-secondary/30 rounded hover:bg-secondary/50"
        >
          Prev
        </button>
        {generatePageNumbers(page, data.pages).map((p, idx) =>
          p === "..." ? (
            <span key={idx} className="px-2 py-1 select-none text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={idx}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded hover:bg-primary/70 cursor-pointer ${
                p === page
                  ? "bg-primary text-white font-bold"
                  : "bg-secondary/30"
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => setPage((old) => (old < data.pages ? old + 1 : old))}
          disabled={page === data.pages}
          className="px-3 py-1 bg-secondary/30 rounded hover:bg-secondary/50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Apartments;
