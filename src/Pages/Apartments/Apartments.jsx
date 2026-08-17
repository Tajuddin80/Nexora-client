import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  FaStar,
  FaBath,
  FaUtensils,
  FaRulerCombined,
  FaComments,
  FaFileContract,
  FaCheckCircle,
  FaBuilding,
  FaLayerGroup,
  FaInfoCircle,
  FaShieldAlt,
  FaTimes,
  FaSearch,
} from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useUserRole from "../../hooks/useUserRole";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import EmptyState from "../../Shared/component/EmptyState/EmptyState";

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
  const location = useLocation();
  const { user } = useAuth();
  const { role } = useUserRole();

  const [page, setPage] = useState(1);
  const [minRentInput, setMinRentInput] = useState(0);
  const [maxRentInput, setMaxRentInput] = useState(100000);
  const [minRent, setMinRent] = useState(0);
  const [maxRent, setMaxRent] = useState(9999999);
  const [sortBy, setSortBy] = useState("rent");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedApt, setSelectedApt] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
    placeholderData: (prev) => prev,
  });

  const { data: userAgreements = [] } = useQuery({
    queryKey: ["userAgreements", user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/agreements/user/${user.email}`);
      return response.data;
    },
    enabled: !!user?.email,
  });

  const handleOpenDetails = (apt) => {
    setSelectedApt(apt);
    setTermsAccepted(false);
    const modal = document.getElementById("apt_details_modal");
    if (modal) {
      modal.showModal();
    }
  };

  const handleChatWithOwner = () => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname }, replace: true });
      return;
    }
    const modal = document.getElementById("apt_details_modal");
    if (modal) modal.close();
    navigate("/dashboard/chat");
  };

  const handleFulfillAgreement = async (apt) => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname }, replace: true });
      return;
    }

    if (!apt.available) {
      Swal.fire({
        icon: "error",
        title: "Apartment Unavailable",
        text: "Sorry, this apartment is no longer available for booking.",
      });
      return;
    }

    if (!termsAccepted) {
      Swal.fire({
        icon: "warning",
        title: "Agreement Terms Required",
        text: "Please read and accept the agreement terms checklist before fulfilling the application.",
      });
      return;
    }

    const activeAgreements = (userAgreements || []).filter(
      (a) => a.status === "pending" || a.status === "accepted"
    );

    if (activeAgreements.length > 0) {
      Swal.fire({
        icon: "info",
        title: "Pending / Active Application Exists",
        text: "You already have a pending or checked agreement request.",
      });
      return;
    }

    setSubmitting(true);
    try {
      await axiosSecure.post("/agreements", {
        userName: user.displayName || user.email.split("@")[0],
        userEmail: user.email,
        floorNo: apt.floorNo || apt.floor || 1,
        blockName: apt.blockName || apt.block || "Block A",
        apartmentNo: apt.apartmentNo,
        rent: apt.rent,
        status: "pending",
        apartmentId: apt._id,
        availability: apt.available,
      });

      const modal = document.getElementById("apt_details_modal");
      if (modal) modal.close();

      Swal.fire({
        icon: "success",
        title: "Agreement Request Submitted!",
        text: `Your agreement application for Apartment ${apt.apartmentNo} has been submitted for Admin review. You can chat directly with the admin anytime!`,
      });
    } catch (err) {
      console.error("Submit agreement error:", err);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: err?.response?.data?.message || "Failed to submit agreement request.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full px-4 md:px-10 py-8">
        <h1 className="text-3xl font-black mb-6 text-primary tracking-wider uppercase border-b border-base-200 pb-3">
          Discover Premium Apartments
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="rounded-none border border-base-200 shadow-sm animate-pulse p-4 bg-base-200">
              <div className="w-full h-52 bg-base-300 rounded-none mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-base-300 rounded-none w-3/4"></div>
                <div className="h-4 bg-base-300 rounded-none w-1/2"></div>
                <div className="h-10 bg-base-300 rounded-none mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        icon="⚠️"
        title="Unable to Load Apartments"
        message="There was an error connecting to the server. Please verify your connection or try again."
        actionText="Try Again"
        onAction={() => window.location.reload()}
      />
    );
  }

  const apartmentsList = data?.apartments || [];

  return (
    <div className="w-full px-4 md:px-10 py-8">
      {/* Subtle Boxed Architectural Header */}
      <div className="mb-8 p-6 bg-base-100 border border-base-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-base-content uppercase tracking-widest">
            Apartment Listings
          </h1>
          <p className="text-base-content/70 mt-1 text-sm md:text-base font-medium">
            Clean architectural layout • Full apartment specifications & direct pre-booking chat.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-4 py-2 bg-primary text-primary-content text-xs font-black uppercase tracking-widest border border-primary">
            {data?.total || apartmentsList.length} Total Residences
          </span>
        </div>
      </div>

      {/* Filter & Search Bar - Elegant 1px Border Design */}
      <div className="bg-base-100 p-6 border border-base-200 mb-8 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-bold text-base-content/70 uppercase tracking-wider mb-2 block">Min Rent ($)</label>
            <input
              type="number"
              value={minRentInput}
              onChange={(e) => setMinRentInput(e.target.value)}
              className="input input-bordered rounded-none border border-base-200 w-full focus:outline-none focus:border-primary font-bold"
              placeholder="e.g. 500"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-base-content/70 uppercase tracking-wider mb-2 block">Max Rent ($)</label>
            <input
              type="number"
              value={maxRentInput}
              onChange={(e) => setMaxRentInput(e.target.value)}
              className="input input-bordered rounded-none border border-base-200 w-full focus:outline-none focus:border-primary font-bold"
              placeholder="e.g. 5000"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-base-content/70 uppercase tracking-wider mb-2 block">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="select select-bordered rounded-none border border-base-200 w-full focus:outline-none focus:border-primary font-bold"
            >
              <option value="rent">Rent Price</option>
              <option value="floorNo">Floor Level</option>
              <option value="apartmentNo">Apartment Number</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-base-content/70 uppercase tracking-wider mb-2 block">Order</label>
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setPage(1);
              }}
              className="select select-bordered rounded-none border border-base-200 w-full focus:outline-none focus:border-primary font-bold"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => {
              setMinRent(Number(minRentInput) || 0);
              setMaxRent(Number(maxRentInput) || 9999999);
              setPage(1);
            }}
            className="btn btn-primary rounded-none font-bold uppercase tracking-wider gap-2 w-full md:w-auto px-8"
          >
            <FaSearch /> Apply Filter
          </button>
        </div>
      </div>

      {/* Apartments Grid - Architectural Clean Cards */}
      {apartmentsList.length === 0 ? (
        <EmptyState
          icon="🏢"
          title="No Apartments Available"
          message="No apartments match your current criteria. Try resetting filters."
          actionText="Reset Filters"
          onAction={() => {
            setMinRent(0);
            setMaxRent(9999999);
            setMinRentInput(0);
            setMaxRentInput(100000);
            setPage(1);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {apartmentsList.map((apt) => (
            <div
              key={apt._id}
              className="bg-base-100 border border-base-200 shadow-sm hover:shadow-md hover:border-primary/60 transition-all duration-200 flex flex-col justify-between"
            >
              {/* Image Banner */}
              <div className="relative overflow-hidden h-56 border-b border-base-200">
                <img
                  src={apt.image || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"}
                  alt={`Apartment ${apt.apartmentNo}`}
                  className="w-full h-full object-cover rounded-none hover:scale-105 transition-transform duration-300"
                />

                {/* Status Badge */}
                <div className="absolute top-0 left-0">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-white ${
                      apt.available ? "bg-emerald-600" : "bg-rose-600"
                    }`}
                  >
                    {apt.available ? "Available" : "Occupied"}
                  </span>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-0 right-0 bg-black/70 text-yellow-400 text-xs font-bold px-2.5 py-1 flex items-center gap-1">
                  <FaStar />
                  <span className="text-white">4.9</span>
                </div>

                {/* Price Banner */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/85 text-white px-4 py-2 flex justify-between items-center backdrop-blur-xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Monthly Rent</span>
                  <span className="text-xl font-black text-emerald-400">${apt.rent}</span>
                </div>
              </div>

              {/* Box Card Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2 pb-2 border-b border-base-200">
                    <h3 className="text-xl font-extrabold text-base-content uppercase tracking-wide">
                      Apt {apt.apartmentNo}
                    </h3>
                    <span className="text-xs font-bold text-base-content/80 px-2 py-0.5 uppercase tracking-wider">
                      {apt.blockName || apt.block || "Block A"}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-base-content/70 flex items-center gap-2 mb-3">
                    <FaLayerGroup className="text-primary" /> Floor {apt.floorNo || apt.floor || 1}
                  </p>

                  {/* Clean Spec Box */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold text-base-content/80 bg-base-200/30 p-2.5 border border-base-200">
                    <div>
                      <FaBath className="mx-auto text-primary mb-1 text-sm" />
                      <span>{apt.washroomCount || 2} Baths</span>
                    </div>
                    <div>
                      <FaUtensils className="mx-auto text-primary mb-1 text-sm" />
                      <span>{apt.kitchenCount || 1} Kitchen</span>
                    </div>
                    <div>
                      <FaRulerCombined className="mx-auto text-primary mb-1 text-sm" />
                      <span>{apt.squareFeet || 1200} sqft</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons - Chat with Owner hidden for Admin */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => handleOpenDetails(apt)}
                    className="btn btn-primary rounded-none w-full gap-2 text-white font-bold uppercase text-xs tracking-wider"
                  >
                    <FaFileContract /> View Details & Agreement
                  </button>

                  {role !== "admin" && (
                    <button
                      onClick={handleChatWithOwner}
                      className="btn btn-outline btn-primary rounded-none btn-sm w-full font-bold uppercase text-xs tracking-wider"
                    >
                      <FaComments /> Chat with Owner
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Architectural Box Modal */}
      <dialog id="apt_details_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-w-4xl p-0 rounded-none bg-base-100 border border-base-300 shadow-2xl">
          {selectedApt && (
            <div>
              {/* Modal Banner */}
              <div className="relative h-64 md:h-80 bg-base-300 border-b border-base-200">
                <img
                  src={selectedApt.image || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"}
                  alt={`Apartment ${selectedApt.apartmentNo}`}
                  className="w-full h-full object-cover rounded-none"
                />

                <form method="dialog" className="absolute top-3 right-3">
                  <button className="btn btn-square btn-sm bg-black text-white border-none rounded-none hover:bg-red-600 font-bold">
                    <FaTimes />
                  </button>
                </form>

                <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-4 border-t border-white/10 text-white flex justify-between items-end">
                  <div>
                    <span className={`inline-block px-3 py-0.5 text-xs font-bold uppercase tracking-wider mb-1 ${selectedApt.available ? "bg-emerald-600" : "bg-rose-600"}`}>
                      {selectedApt.available ? "Available for Lease" : "Occupied"}
                    </span>
                    <h2 className="text-2xl md:text-4xl font-extrabold uppercase tracking-wide">
                      Apartment {selectedApt.apartmentNo}
                    </h2>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-300 mt-0.5">
                      {selectedApt.blockName || selectedApt.block || "Block A"} • Floor {selectedApt.floorNo || selectedApt.floor || 1}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-emerald-400">${selectedApt.rent}</div>
                    <div className="text-xs font-bold uppercase tracking-wider text-gray-300">per month</div>
                  </div>
                </div>
              </div>

              {/* Modal Content Body */}
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                {/* Specifications Grid Box */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-base-200/40 border border-base-200 text-center">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-base-content/60">Square Feet</div>
                    <div className="text-base font-bold text-base-content mt-1">{selectedApt.squareFeet || 1200} sqft</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-base-content/60">Washrooms</div>
                    <div className="text-base font-bold text-base-content mt-1">{selectedApt.washroomCount || 2} Bathrooms</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-base-content/60">Kitchen</div>
                    <div className="text-base font-bold text-base-content mt-1">{selectedApt.kitchenCount || 1} Kitchen</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-base-content/60">Min Term</div>
                    <div className="text-base font-bold text-base-content mt-1">12 Months</div>
                  </div>
                </div>

                {/* Video Tour Section */}
                {selectedApt.video && (
                  <div className="p-4 bg-primary/10 border border-primary/40 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold uppercase tracking-wider text-sm text-primary">Video Tour Link</h4>
                      <p className="text-xs text-base-content/70 font-medium">Watch the video walk-through before proceeding.</p>
                    </div>
                    <a
                      href={selectedApt.video}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary rounded-none btn-sm font-bold uppercase tracking-wider gap-2 text-white"
                    >
                      🎬 Watch Tour
                    </a>
                  </div>
                )}

                {/* Description */}
                <div className="border-l-4 border-primary pl-4 py-1">
                  <h4 className="font-bold text-base uppercase tracking-wider text-base-content mb-1 flex items-center gap-2">
                    <FaInfoCircle className="text-primary" /> Apartment Description
                  </h4>
                  <p className="text-xs md:text-sm text-base-content/80 leading-relaxed font-medium">
                    {selectedApt.details || selectedApt.description || "This premium residence features luxury finishes, optimal architectural layout, high-speed elevator access, 24/7 building security, and dedicated maintenance support."}
                  </p>
                </div>

                {/* Pre-Booking Direct Chat Box (Only for non-admin users) */}
                {role !== "admin" && (
                  <div className="p-4 bg-base-200/50 border border-base-200 flex items-center justify-between">
                    <div>
                      <h5 className="font-bold uppercase text-xs tracking-wider text-base-content">Need pre-booking clarifications?</h5>
                      <p className="text-xs text-base-content/70 font-medium">Chat directly with the Admin or Owner to discuss terms.</p>
                    </div>
                    <button
                      onClick={handleChatWithOwner}
                      className="btn btn-outline btn-primary rounded-none btn-sm font-bold uppercase tracking-wider gap-2"
                    >
                      <FaComments /> Direct Chat
                    </button>
                  </div>
                )}

                {/* Agreement Terms Checklist Box */}
                <div className="p-5 bg-base-100 border border-base-200 space-y-3">
                  <h4 className="font-bold uppercase text-sm tracking-wider text-base-content flex items-center gap-2">
                    <FaShieldAlt className="text-primary" /> Agreement Fulfillment Checklist
                  </h4>
                  <p className="text-xs text-base-content/70 font-medium">
                    Verify applicant information and accept lease conditions to submit your application.
                  </p>

                  <div className="space-y-2 text-xs font-bold bg-base-200/40 p-3 border border-base-200">
                    <div className="flex justify-between">
                      <span className="uppercase text-base-content/60">Applicant Name:</span>
                      <span className="text-base-content">{user?.displayName || user?.email || "Guest"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="uppercase text-base-content/60">Applicant Email:</span>
                      <span className="text-base-content">{user?.email || "Not Signed In"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="uppercase text-base-content/60">Monthly Rent:</span>
                      <span className="font-black text-primary">${selectedApt.rent} / month</span>
                    </div>
                  </div>

                  {role !== "admin" && (
                    <label className="flex items-start gap-3 cursor-pointer pt-2">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="checkbox checkbox-primary rounded-none checkbox-sm mt-0.5"
                      />
                      <span className="text-xs text-base-content font-bold">
                        I confirm that I have reviewed the apartment details and agree to fulfill this rental agreement application for Admin review.
                      </span>
                    </label>
                  )}
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="p-4 bg-base-200/60 border-t border-base-200 flex flex-col sm:flex-row justify-between gap-3">
                <form method="dialog">
                  <button className="btn btn-ghost rounded-none font-bold uppercase text-xs tracking-wider w-full sm:w-auto">Cancel</button>
                </form>

                <div className="flex gap-2">
                  {role !== "admin" && (
                    <>
                      <button
                        onClick={handleChatWithOwner}
                        className="btn btn-outline btn-primary rounded-none font-bold uppercase text-xs tracking-wider flex-1 sm:flex-none gap-2"
                      >
                        <FaComments /> Ask Question
                      </button>
                      <button
                        onClick={() => handleFulfillAgreement(selectedApt)}
                        disabled={submitting || !selectedApt.available}
                        className="btn btn-primary rounded-none font-bold uppercase text-xs tracking-wider flex-1 sm:flex-none gap-2 text-white"
                      >
                        <FaCheckCircle /> Fulfill & Submit Agreement
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </dialog>

      {/* Pagination */}
      {apartmentsList.length === 0 && data?.pages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
          <button
            onClick={() => setPage((old) => Math.max(old - 1, 1))}
            disabled={page === 1}
            className="btn btn-sm btn-outline rounded-none font-bold uppercase"
          >
            Prev
          </button>
          {generatePageNumbers(page, data.pages).map((p, idx) =>
            p === "..." ? (
              <span key={idx} className="px-2 py-1 select-none text-base-content/40 font-bold">
                ...
              </span>
            ) : (
              <button
                key={idx}
                onClick={() => setPage(p)}
                className={`btn btn-sm rounded-none font-bold ${p === page ? "btn-primary" : "btn-ghost"}`}
              >
                {p}
              </button>
            )
          )}
          <button
            onClick={() => setPage((old) => (old < data.pages ? old + 1 : old))}
            disabled={page === data.pages}
            className="btn btn-sm btn-outline rounded-none font-bold uppercase"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Apartments;
