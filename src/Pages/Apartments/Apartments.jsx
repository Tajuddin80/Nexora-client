import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router";
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
  FaChevronLeft,
  FaChevronRight,
  FaExclamationTriangle,
  FaVideo,
} from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useUserRole from "../../hooks/useUserRole";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import EmptyState from "../../Shared/component/EmptyState/EmptyState";
import showToast from "../../lib/toast";
import LeasingBenefits from "./components/LeasingBenefits";
import FloorPlanFeatures from "./components/FloorPlanFeatures";
import LeasingFAQCTA from "./components/LeasingFAQCTA";
import LeasingProcessTimeline from "./components/LeasingProcessTimeline";

import building3Img from "../../assets/building-3.jpg";
import building4Img from "../../assets/building-4.jpg";
import building5Img from "../../assets/building-5.jpg";
import building6Img from "../../assets/building-6.jpg";

const buildingFallbacks = [building6Img, building5Img, building4Img, building3Img];

const getApartmentCardImage = (apt, index) => {
  if (Array.isArray(apt.images) && apt.images.length > 0 && apt.images[0]) {
    return apt.images[0];
  }
  if (apt.image && typeof apt.image === "string" && apt.image.trim() !== "") {
    return apt.image;
  }
  return buildingFallbacks[index % buildingFallbacks.length];
};



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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const openFullViewModal = (index = null) => {
    if (index !== null) {
      setCurrentImageIndex(index);
    }
    const modal = document.getElementById("full_view_modal");
    if (modal) {
      modal.showModal();
    }
  };

  const closeFullViewModal = () => {
    const modal = document.getElementById("full_view_modal");
    if (modal) {
      modal.close();
    }
  };
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
    setCurrentImageIndex(0);
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
      showToast.error("Sorry, this apartment is no longer available for booking.");
      return;
    }

    if (!termsAccepted) {
      showToast.error("Please confirm and accept the agreement checklist terms before fulfilling application.");
      return;
    }

    const activeAgreements = (userAgreements || []).filter(
      (a) => a.status === "pending" || a.status === "accepted"
    );

    if (activeAgreements.length > 0) {
      showToast.info("You already have an active or pending agreement application.");
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

      showToast.success(`Agreement request for Apt ${apt.apartmentNo} submitted for Admin review!`);
    } catch (err) {
      console.error("Submit agreement error:", err);
      showToast.error(err?.response?.data?.message || "Failed to submit agreement request.");
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
        icon={<FaExclamationTriangle className="text-3xl text-error" />}
        title="Unable to Load Apartments"
        message="There was an error connecting to the server. Please verify your connection or try again."
        actionText="Try Again"
        onAction={() => window.location.reload()}
      />
    );
  }

  const apartmentsList = data?.apartments || [];

  return (
    <div className="w-full px-4 md:px-8 lg:px-12 py-8">
      {/* Subtle Boxed Architectural Header */}
      <div className="mb-8 p-6 bg-base-100 border border-base-content/25 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-base-content uppercase tracking-widest">
            Apartment Listings
          </h1>
          <p className="text-base-content/75 mt-1 text-sm md:text-base font-medium">
            Clean architectural layout • Full apartment specifications & direct pre-booking chat.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-4 py-2 bg-base-content/10 text-base-content text-xs font-black uppercase tracking-widest border border-base-content/20">
            {data?.total || apartmentsList.length} Total Residences
          </span>
        </div>
      </div>


      {/* Filter & Search Bar - Subtle Border Design */}
      <div className="bg-base-100 p-6 border border-base-content/25 mb-8 space-y-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-bold text-base-content uppercase tracking-wider mb-2 block">Min Rent ($)</label>
            <input
              type="number"
              value={minRentInput}
              onChange={(e) => setMinRentInput(e.target.value)}
              className="input input-bordered rounded-none border border-base-content/20 bg-base-100 text-base-content w-full focus:outline-none focus:border-base-content font-bold"
              placeholder="e.g. 500"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-base-content uppercase tracking-wider mb-2 block">Max Rent ($)</label>
            <input
              type="number"
              value={maxRentInput}
              onChange={(e) => setMaxRentInput(e.target.value)}
              className="input input-bordered rounded-none border border-base-content/20 bg-base-100 text-base-content w-full focus:outline-none focus:border-base-content font-bold"
              placeholder="e.g. 5000"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-base-content uppercase tracking-wider mb-2 block">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="select select-bordered rounded-none border border-base-content/20 bg-base-100 text-base-content w-full focus:outline-none focus:border-base-content font-bold"
            >
              <option value="rent">Rent Price</option>
              <option value="floorNo">Floor Level</option>
              <option value="apartmentNo">Apartment Number</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-base-content uppercase tracking-wider mb-2 block">Order</label>
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setPage(1);
              }}
              className="select select-bordered rounded-none border border-base-content/20 bg-base-100 text-base-content w-full focus:outline-none focus:border-base-content font-bold"
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
            className="btn bg-base-content text-base-100 hover:bg-base-content/80 rounded-none font-bold uppercase tracking-wider gap-2 w-full md:w-auto px-8 border-none"
          >
            <FaSearch /> Apply Filter
          </button>
        </div>
      </div>

      {/* Apartments Grid - Architectural Clean Cards */}
      {apartmentsList.length === 0 ? (
        <EmptyState
          icon={<FaBuilding className="text-3xl text-base-content" />}
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

          {apartmentsList.map((apt, index) => (
            <div
              key={apt._id}
              className="bg-base-100 border border-base-content/25 shadow-xs hover:border-base-content/70 transition-all duration-200 flex flex-col justify-between"
            >
              {/* Image Banner */}
              <div className="relative overflow-hidden h-56 border-b border-base-content/20">
                <img
                  src={getApartmentCardImage(apt, index)}
                  alt={`Apartment ${apt.apartmentNo}`}
                  className="w-full h-full object-cover rounded-none hover:scale-105 transition-transform duration-300"
                />

                {/* Status Badge */}
                <div className="absolute top-0 left-0">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-black uppercase tracking-wider text-base-100 ${
                      apt.available ? "bg-base-content" : "bg-base-content/60"
                    }`}
                  >
                    {apt.available ? "Available" : "Occupied"}
                  </span>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-0 right-0 bg-base-content text-base-100 text-xs font-bold px-2.5 py-1 flex items-center gap-1">
                  <FaStar className="text-base-100" />
                  <span className="text-base-100">4.9</span>
                </div>

                {/* Price Banner */}
                <div className="absolute bottom-0 left-0 right-0 bg-base-content text-base-100 px-4 py-2 flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-base-100/80">Monthly Rent</span>
                  <span className="text-xl font-black text-base-100">${apt.rent}</span>
                </div>
              </div>

              {/* Box Card Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2 pb-2 border-b border-base-content/15">
                    <h3 className="text-xl font-black text-base-content uppercase tracking-wide">
                      Apt {apt.apartmentNo}
                    </h3>
                    <span className="text-xs font-bold text-base-content border border-base-content/20 px-2 py-0.5 uppercase tracking-wider">
                      {apt.blockName || apt.block || "Block A"}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-base-content flex items-center gap-2 mb-3">
                    <FaLayerGroup className="text-base-content" /> Floor {apt.floorNo || apt.floor || 1}
                  </p>

                  {/* Clean Spec Box */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold text-base-content bg-base-content/5 p-2.5 border border-base-content/20 shadow-xs">
                    <div>
                      <FaBath className="mx-auto text-base-content mb-1 text-sm" />
                      <span>{apt.washroomCount || 2} Baths</span>
                    </div>
                    <div>
                      <FaUtensils className="mx-auto text-base-content mb-1 text-sm" />
                      <span>{apt.kitchenCount || 1} Kitchen</span>
                    </div>
                    <div>
                      <FaRulerCombined className="mx-auto text-base-content mb-1 text-sm" />
                      <span>{apt.squareFeet || 1200} sqft</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => handleOpenDetails(apt)}
                    className="btn bg-base-content text-base-100 hover:bg-base-content/80 rounded-none w-full gap-2 font-bold uppercase text-xs tracking-wider border-none"
                  >
                    <FaFileContract /> View Details & Agreement
                  </button>

                  {role === "admin" ? (
                    <button
                      onClick={() => navigate(`/dashboard/edit-apartment/${apt._id}`)}
                      className="btn border border-base-content bg-transparent text-base-content hover:opacity-80 rounded-none btn-sm w-full font-bold uppercase text-xs tracking-wider gap-2"
                    >
                      <FaBuilding /> Edit Specifications
                    </button>
                  ) : (
                    <button
                      onClick={handleChatWithOwner}
                      className="btn border border-base-content bg-transparent text-base-content hover:opacity-80 rounded-none btn-sm w-full font-bold uppercase text-xs tracking-wider"
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

      {/* Pagination */}
      {apartmentsList.length > 0 && data?.pages > 1 && (
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

      {/* Leasing Benefits Banner */}
      <LeasingBenefits />

      {/* 4-Step Digital Leasing Timeline */}
      <LeasingProcessTimeline />

      {/* Architectural Standard Features Section */}
      <FloorPlanFeatures />

      {/* FAQ & Support CTA Section */}
      <LeasingFAQCTA />


      {/* Architectural Box Modal - Center Aligned & Fully Responsive */}
      <dialog id="apt_details_modal" className="modal modal-middle p-2 sm:p-4">
        <div
          className="modal-box m-auto p-0 rounded-none bg-base-100 border border-base-content/30 shadow-2xl flex flex-col max-h-[95vh] w-[95vw] max-w-5xl md:max-w-6xl overflow-hidden"
        >
          {selectedApt && (() => {
            const galleryImages = (selectedApt.images && selectedApt.images.length > 0)
              ? selectedApt.images
              : (selectedApt.image ? [selectedApt.image] : [building6Img]);

            const activeImg = galleryImages[currentImageIndex] || selectedApt.image || building6Img;


            return (
              <div className="flex flex-col h-full overflow-hidden">
                {/* Modal Banner Viewport with Multi-Image Slider */}
                <div className="relative h-44 sm:h-56 md:h-64 lg:h-72 bg-black shrink-0 border-b border-base-content/20">
                  <img
                    src={activeImg}
                    alt={`Apartment ${selectedApt.apartmentNo} photo ${currentImageIndex + 1}`}
                    onClick={() => openFullViewModal()}
                    className="w-full h-full object-cover rounded-none transition-all duration-300 cursor-pointer hover:scale-105"
                    title="Click to open image in full screen view"
                  />

                  {galleryImages.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1))}
                        className="absolute left-3 top-1/2 -translate-y-1/2 btn btn-circle btn-sm bg-black/70 hover:bg-base-content text-base-100 border-none z-10"
                        title="Previous Image"
                      >
                        <FaChevronLeft />
                      </button>

                      <button
                        onClick={() => setCurrentImageIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-circle btn-sm bg-black/70 hover:bg-base-content text-base-100 border-none z-10"
                        title="Next Image"
                      >
                        <FaChevronRight />
                      </button>

                      <div className="absolute top-3 left-3 bg-black/80 text-white text-[11px] sm:text-xs font-bold px-2.5 py-1 border border-white/20 z-10">
                        Photo {currentImageIndex + 1} of {galleryImages.length}
                      </div>
                    </>
                  )}

                  <form method="dialog" className="absolute top-3 right-3 z-10">
                    <button className="btn btn-square btn-sm bg-black text-white border-none rounded-none hover:bg-red-600 font-bold">
                      <FaTimes />
                    </button>
                  </form>

                  <div className="absolute bottom-0 left-0 right-0 bg-black/85 p-3 sm:p-5 md:p-6 border-t border-white/10 text-white flex justify-between items-end gap-2">
                    <div>
                      <span className={`inline-block px-2.5 py-0.5 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider mb-1 ${selectedApt.available ? "bg-emerald-600" : "bg-rose-600"}`}>
                        {selectedApt.available ? "Available for Lease" : "Occupied"}
                      </span>
                      <h2 className="text-xl sm:text-2xl md:text-4xl font-black uppercase tracking-wide text-white">
                        Apartment {selectedApt.apartmentNo}
                      </h2>
                      <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-300 mt-0.5">
                        {selectedApt.blockName || selectedApt.block || "Block A"} • Floor {selectedApt.floorNo || selectedApt.floor || 1}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl sm:text-3xl md:text-4xl font-black text-emerald-400">${selectedApt.rent}</div>
                      <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-300">per month</div>
                    </div>
                  </div>
                </div>

                {/* Multi-Image Thumbnail Gallery Strip */}
                {galleryImages.length > 1 && (
                  <div className="flex items-center gap-2 p-2 bg-base-100 border-b border-base-content/20 overflow-x-auto shrink-0">
                    {galleryImages.map((imgUrl, i) => (
                      <button
                        key={i}
                        onClick={() => openFullViewModal(i)}
                        className={`w-14 sm:w-16 h-10 sm:h-12 shrink-0 border-2 transition-all ${
                          currentImageIndex === i ? "border-base-content scale-105 shadow-xs" : "border-base-content/20 opacity-70 hover:opacity-100"
                        }`}
                        title="Click to view photo in full screen"
                      >
                        <img src={imgUrl} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Modal Content Body - Clean High Contrast & Bright Backgrounds */}
                <div className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6 overflow-y-auto flex-1 bg-base-100">
                  {/* Specifications Grid Box */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4 bg-base-100 border border-base-content/20 shadow-xs text-center">
                    <div>
                      <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-base-content/70">Square Feet</div>
                      <div className="text-sm sm:text-base font-extrabold text-base-content mt-1">{selectedApt.squareFeet || 1200} sqft</div>
                    </div>
                    <div>
                      <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-base-content/70">Washrooms</div>
                      <div className="text-sm sm:text-base font-extrabold text-base-content mt-1">{selectedApt.washroomCount || 2} Bathrooms</div>
                    </div>
                    <div>
                      <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-base-content/70">Kitchen</div>
                      <div className="text-sm sm:text-base font-extrabold text-base-content mt-1">{selectedApt.kitchenCount || 1} Kitchen</div>
                    </div>
                    <div>
                      <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-base-content/70">Min Term</div>
                      <div className="text-sm sm:text-base font-extrabold text-base-content mt-1">12 Months</div>
                    </div>
                  </div>

                  {/* Video Tour Section */}
                  {selectedApt.video && (
                    <div className="p-3 sm:p-4 bg-base-100 border border-base-content/20 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-extrabold uppercase tracking-wider text-xs sm:text-sm text-base-content">Video Tour Link</h4>
                        <p className="text-[11px] sm:text-xs text-base-content/80 font-medium">Watch the video walk-through before proceeding.</p>
                      </div>
                      <a
                        href={selectedApt.video}
                        target="_blank"
                        rel="noreferrer"
                        className="btn bg-base-content text-base-100 hover:bg-base-content/80 rounded-none btn-sm font-bold uppercase tracking-wider gap-2 border-none shrink-0"
                      >
                        <FaVideo /> Watch Tour
                      </a>
                    </div>
                  )}

                  {/* Description */}
                  <div className="border-l-4 border-base-content bg-base-100 border border-base-content/20 p-3 sm:p-4 shadow-xs">
                    <h4 className="font-extrabold text-xs sm:text-base uppercase tracking-wider text-base-content mb-1 flex items-center gap-2">
                      <FaInfoCircle className="text-base-content" /> Apartment Description
                    </h4>
                    <p className="text-xs sm:text-sm text-base-content/90 leading-relaxed font-semibold">
                      {selectedApt.details || selectedApt.description || "This premium residence features luxury finishes, optimal architectural layout, high-speed elevator access, 24/7 building security, and dedicated maintenance support."}
                    </p>
                  </div>

                  {/* Pre-Booking Direct Chat Box (Only for non-admin users) */}
                  {role !== "admin" && (
                    <div className="p-3 sm:p-4 bg-base-100 border border-base-content/20 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h5 className="font-extrabold uppercase text-xs tracking-wider text-base-content">Need pre-booking clarifications?</h5>
                        <p className="text-[11px] sm:text-xs text-base-content/80 font-medium">Chat directly with the Admin or Owner to discuss terms.</p>
                      </div>
                      <button
                        onClick={handleChatWithOwner}
                        className="btn border border-base-content bg-transparent text-base-content hover:bg-base-content/10 rounded-none btn-sm font-bold uppercase tracking-wider gap-2 shrink-0"
                      >
                        <FaComments /> Direct Chat
                      </button>
                    </div>
                  )}

                  {/* Agreement Terms Checklist Box - High Contrast Pure Background */}
                  <div className="p-4 sm:p-5 bg-base-100 border border-base-content/20 shadow-xs space-y-3 sm:space-y-4">
                    <h4 className="font-black uppercase text-xs sm:text-sm tracking-wider text-base-content flex items-center gap-2">
                      <FaShieldAlt className="text-base-content text-base" /> Agreement Fulfillment Checklist
                    </h4>
                    <p className="text-[11px] sm:text-xs text-base-content/80 font-medium">
                      Verify applicant information and accept lease conditions to submit your application.
                    </p>

                    <div className="space-y-2.5 text-xs font-bold bg-base-100 p-3 sm:p-4 border border-base-content/20 shadow-xs">
                      <div className="flex justify-between items-center py-1 border-b border-base-content/15">
                        <span className="uppercase text-base-content/70 font-bold text-[10px] sm:text-xs">Applicant Name:</span>
                        <span className="text-base-content font-extrabold text-xs sm:text-sm">{user?.displayName || user?.email?.split("@")[0] || "Guest"}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-base-content/15">
                        <span className="uppercase text-base-content/70 font-bold text-[10px] sm:text-xs">Applicant Email:</span>
                        <span className="text-base-content font-extrabold font-mono text-[10px] sm:text-xs truncate max-w-[180px] sm:max-w-none">{user?.email || "Not Signed In"}</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="uppercase text-base-content/70 font-bold text-[10px] sm:text-xs">Monthly Rent:</span>
                        <span className="font-black text-base-content text-sm sm:text-base">${selectedApt.rent} / month</span>
                      </div>
                    </div>

                    {role !== "admin" && (
                      <label className="flex items-start gap-3 cursor-pointer pt-2">
                        <input
                          type="checkbox"
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          className="checkbox rounded-none checkbox-sm mt-0.5 shrink-0 border-base-content"
                        />
                        <span className="text-[11px] sm:text-xs text-base-content font-extrabold leading-snug">
                          I confirm that I have reviewed the apartment details and agree to fulfill this rental agreement application for Admin review.
                        </span>
                      </label>
                    )}
                  </div>
                </div>

                {/* Modal Footer Actions - Centered & Responsive Buttons */}
                <div className="p-3 sm:p-4 bg-base-100 border-t border-base-content/20 flex flex-col sm:flex-row justify-between items-center gap-2.5 sm:gap-3 shrink-0">
                  <form method="dialog" className="w-full sm:w-auto">
                    <button className="btn btn-ghost rounded-none font-black uppercase text-[11px] sm:text-xs tracking-wider w-full sm:w-auto text-base-content hover:bg-base-content/10">
                      Cancel
                    </button>
                  </form>

                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    {role !== "admin" && (
                      <>
                        <button
                          onClick={handleChatWithOwner}
                          className="btn border border-base-content bg-transparent text-base-content hover:bg-base-content/10 rounded-none font-black uppercase text-[11px] sm:text-xs tracking-wider w-full sm:w-auto gap-2"
                        >
                          <FaComments /> <span className="whitespace-nowrap">Ask Question</span>
                        </button>
                        <button
                          onClick={() => handleFulfillAgreement(selectedApt)}
                          disabled={submitting || !selectedApt.available}
                          className="btn bg-base-content text-base-100 hover:bg-base-content/80 rounded-none font-black uppercase text-[11px] sm:text-xs tracking-wider w-full sm:w-auto gap-2 border-none px-6"
                        >
                          <FaCheckCircle />
                          <span className="whitespace-nowrap sm:hidden">Fulfill Agreement</span>
                          <span className="hidden sm:inline whitespace-nowrap">Fulfill & Submit Agreement</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </dialog>

      {/* Full Screen High-Res Image Lightbox Native Dialog - Stacked Top Layer */}
      <dialog id="full_view_modal" className="modal modal-middle p-0 z-[999999]">
        <div className="modal-box w-screen h-screen max-w-none max-h-none rounded-none bg-black/95 text-white p-4 sm:p-6 flex flex-col justify-between overflow-hidden">
          {selectedApt && (() => {
            const galleryImages = (selectedApt.images && selectedApt.images.length > 0)
              ? selectedApt.images
              : (selectedApt.image ? [selectedApt.image] : [building6Img]);
            const activeImg = galleryImages[currentImageIndex] || selectedApt.image || building6Img;

            return (
              <div className="flex flex-col h-full justify-between items-center w-full">
                {/* Header */}
                <div className="w-full flex items-center justify-between border-b border-white/20 pb-3 shrink-0">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block">
                      FULL RESOLUTION IMAGE VIEW
                    </span>
                    <h3 className="text-base sm:text-xl font-black uppercase tracking-wider text-white">
                      Apartment {selectedApt.apartmentNo} • {selectedApt.blockName || "Block A"}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={closeFullViewModal}
                    className="btn btn-square btn-sm bg-white text-black hover:bg-red-600 hover:text-white rounded-none border-none font-bold"
                    title="Close Full View"
                  >
                    <FaTimes className="text-base" />
                  </button>
                </div>

                {/* Center Display Image */}
                <div className="relative flex-1 w-full flex items-center justify-center p-2 sm:p-4 my-2 overflow-hidden">
                  <img
                    src={activeImg}
                    alt={`Apartment ${selectedApt.apartmentNo} full view`}
                    className="max-h-[82vh] max-w-[92vw] object-contain shadow-2xl border border-white/20"
                  />

                  {galleryImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1))}
                        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 btn btn-circle btn-sm sm:btn-md bg-black/80 text-white hover:bg-white hover:text-black border border-white/30 z-20"
                        title="Previous Photo"
                      >
                        <FaChevronLeft className="text-base sm:text-lg" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentImageIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0))}
                        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 btn btn-circle btn-sm sm:btn-md bg-black/80 text-white hover:bg-white hover:text-black border border-white/30 z-20"
                        title="Next Photo"
                      >
                        <FaChevronRight className="text-base sm:text-lg" />
                      </button>
                    </>
                  )}
                </div>

                {/* Footer instruction */}
                <div className="w-full text-center border-t border-white/20 pt-2 text-xs text-white/70 font-mono shrink-0 flex justify-between items-center">
                  <span>Photo {currentImageIndex + 1} of {galleryImages.length}</span>
                  <button
                    type="button"
                    onClick={closeFullViewModal}
                    className="btn btn-xs bg-white text-black hover:bg-red-600 hover:text-white rounded-none font-bold uppercase"
                  >
                    Close Full View
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </dialog>
    </div>
  );
};

export default Apartments;


