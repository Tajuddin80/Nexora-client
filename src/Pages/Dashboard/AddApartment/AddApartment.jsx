import React, { useState } from "react";
import { useNavigate } from "react-router";
import showToast from "../../../lib/toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  FaBuilding,
  FaDollarSign,
  FaImage,
  FaVideo,
  FaFileAlt,
  FaLayerGroup,
  FaRulerCombined,
  FaBed,
  FaBath,
  FaUtensils,
  FaTrash,
  FaPlus,
} from "react-icons/fa";

const AddApartment = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const [formData, setFormData] = useState({
    apartmentNo: "",
    floorNo: "1",
    blockName: "Block A",
    rent: "",
    squareFeet: "1200",
    bedroomCount: "2",
    washroomCount: "2",
    kitchenCount: "1",
    available: true,
    video: "",
    details: "",
  });

  const [imagesList, setImagesList] = useState([]);
  const [customImageUrl, setCustomImageUrl] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Direct Cloudinary Image Upload Handler (Max 1 MB, Up to 5 Images)
  const handleImageFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (imagesList.length >= 5) {
      showToast.warning("Maximum of 5 images allowed per apartment.");
      e.target.value = "";
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      showToast.error("Image file size must be less than 1 MB.");
      e.target.value = "";
      return;
    }

    setUploadingImage(true);
    try {
      const data = new FormData();
      data.append("file", file);

      const res = await axiosSecure.post("/upload/image", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success && res.data?.url) {
        setImagesList((prev) => [...prev, res.data.url]);
        showToast.success("Image uploaded to Cloudinary!");
      }
    } catch (err) {
      console.error("Direct image upload error:", err);
      showToast.error(err?.response?.data?.message || "Failed to upload image.");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleAddImageUrl = () => {
    if (!customImageUrl.trim()) return;
    if (imagesList.length >= 5) {
      showToast.warning("Maximum of 5 images allowed per apartment.");
      return;
    }
    setImagesList((prev) => [...prev, customImageUrl.trim()]);
    setCustomImageUrl("");
    showToast.success("Image URL added to gallery.");
  };

  const handleRemoveImage = (index) => {
    setImagesList((prev) => prev.filter((_, i) => i !== index));
    showToast.info("Image removed from list.");
  };

  // Direct Cloudinary Video Upload Handler (Max 10 MB)
  const handleVideoFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast.error("Video file size must be less than 10 MB.");
      e.target.value = "";
      return;
    }

    setUploadingVideo(true);
    try {
      const data = new FormData();
      data.append("file", file);

      const res = await axiosSecure.post("/upload/video", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success && res.data?.url) {
        setFormData((prev) => ({ ...prev, video: res.data.url }));
        showToast.success("Video uploaded to Cloudinary!");
      }
    } catch (err) {
      console.error("Direct video upload error:", err);
      showToast.error(err?.response?.data?.message || "Failed to upload video.");
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imagesList.length === 0) {
      showToast.warning("Please upload at least 1 apartment image.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        apartmentNo: formData.apartmentNo.trim(),
        floorNo: formData.floorNo ? parseInt(formData.floorNo, 10) : 1,
        blockName: formData.blockName.trim() || "Block A",
        rent: parseFloat(formData.rent),
        squareFeet: formData.squareFeet ? parseInt(formData.squareFeet, 10) : 1200,
        bedroomCount: formData.bedroomCount ? parseInt(formData.bedroomCount, 10) : 2,
        washroomCount: formData.washroomCount ? parseInt(formData.washroomCount, 10) : 2,
        kitchenCount: formData.kitchenCount ? parseInt(formData.kitchenCount, 10) : 1,
        available: formData.available,
        image: imagesList[0],
        images: imagesList,
        video: formData.video.trim(),
        details: formData.details.trim(),
      };

      const res = await axiosSecure.post("/apartments", payload);

      if (res.data?.success) {
        showToast.success(`Apartment ${payload.apartmentNo} created successfully!`);
        navigate("/apartments");
      }
    } catch (err) {
      console.error("Create apartment error:", err);
      showToast.error(err?.response?.data?.message || "Failed to create apartment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 md:px-10 py-6">
      <div className="bg-base-100 border border-base-300 p-6 md:p-10 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-base-200">
          <FaBuilding className="text-4xl text-primary" />
          <div>
            <h1 className="text-2xl md:text-4xl font-extrabold uppercase tracking-wider text-base-content">
              Add New Apartment
            </h1>
            <p className="text-xs md:text-sm text-base-content/70 font-medium">
              Create a new residence listing with complete specifications and up to 5 images for gallery viewing.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Apartment No */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-base-content">
                Apartment Number <span className="text-error">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="apartmentNo"
                  required
                  placeholder="e.g. A-101"
                  value={formData.apartmentNo}
                  onChange={handleChange}
                  className="input input-bordered rounded-none border border-base-200 w-full pl-10 font-bold"
                />
                <FaBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              </div>
            </div>

            {/* Rent Amount */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-base-content">
                Monthly Rent ($) <span className="text-error">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="rent"
                  required
                  min="1"
                  step="any"
                  placeholder="e.g. 1200"
                  value={formData.rent}
                  onChange={handleChange}
                  className="input input-bordered rounded-none border border-base-200 w-full pl-10 font-bold"
                />
                <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              </div>
            </div>

            {/* Floor Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-base-content">Floor Level</label>
              <div className="relative">
                <input
                  type="number"
                  name="floorNo"
                  placeholder="e.g. 4"
                  value={formData.floorNo}
                  onChange={handleChange}
                  className="input input-bordered rounded-none border border-base-200 w-full pl-10 font-bold"
                />
                <FaLayerGroup className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              </div>
            </div>

            {/* Block Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-base-content">Block Name</label>
              <div className="relative">
                <input
                  type="text"
                  name="blockName"
                  placeholder="e.g. Block A"
                  value={formData.blockName}
                  onChange={handleChange}
                  className="input input-bordered rounded-none border border-base-200 w-full pl-10 font-bold"
                />
                <FaBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              </div>
            </div>

            {/* Square Feet */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-base-content">Size (Square Feet)</label>
              <div className="relative">
                <input
                  type="number"
                  name="squareFeet"
                  placeholder="e.g. 1200"
                  value={formData.squareFeet}
                  onChange={handleChange}
                  className="input input-bordered rounded-none border border-base-200 w-full pl-10 font-bold"
                />
                <FaRulerCombined className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              </div>
            </div>

            {/* Bedroom Count */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-base-content">Bedrooms Count</label>
              <div className="relative">
                <input
                  type="number"
                  name="bedroomCount"
                  placeholder="e.g. 2"
                  value={formData.bedroomCount}
                  onChange={handleChange}
                  className="input input-bordered rounded-none border border-base-200 w-full pl-10 font-bold"
                />
                <FaBed className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              </div>
            </div>

            {/* Washroom Count */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-base-content">Washrooms Count</label>
              <div className="relative">
                <input
                  type="number"
                  name="washroomCount"
                  placeholder="e.g. 2"
                  value={formData.washroomCount}
                  onChange={handleChange}
                  className="input input-bordered rounded-none border border-base-200 w-full pl-10 font-bold"
                />
                <FaBath className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              </div>
            </div>

            {/* Kitchen Count */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-base-content">Kitchen Count</label>
              <div className="relative">
                <input
                  type="number"
                  name="kitchenCount"
                  placeholder="e.g. 1"
                  value={formData.kitchenCount}
                  onChange={handleChange}
                  className="input input-bordered rounded-none border border-base-200 w-full pl-10 font-bold"
                />
                <FaUtensils className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              </div>
            </div>
          </div>

          {/* Up to 5 Images Upload Section */}
          <div className="p-4 bg-base-100 border border-base-300 space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-base-content flex items-center gap-2">
                <FaImage className="text-primary" /> Upload Apartment Images (Up to 5 Photos) <span className="text-error">*</span>
              </label>
              <span className="text-xs font-bold text-primary font-mono">{imagesList.length} / 5 Uploaded</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Direct File Upload */}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  disabled={uploadingImage || imagesList.length >= 5}
                  className="file-input file-input-bordered file-input-primary rounded-none border border-base-200 w-full text-xs font-bold"
                />
                <span className="text-[10px] text-base-content/60 font-mono block mt-1">Direct Cloudinary file upload (Max 1 MB each)</span>
              </div>

              {/* URL Add */}
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Or paste Image URL..."
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  className="input input-bordered rounded-none border border-base-200 flex-1 text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  disabled={imagesList.length >= 5 || !customImageUrl.trim()}
                  className="btn btn-primary btn-square rounded-none"
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            {uploadingImage && <span className="text-xs text-primary font-bold animate-pulse">Uploading image to Cloudinary...</span>}

            {/* Thumbnail Preview Strip */}
            {imagesList.length > 0 && (
              <div className="flex items-center gap-3 overflow-x-auto pt-2">
                {imagesList.map((img, idx) => (
                  <div key={idx} className="relative w-24 h-24 shrink-0 border border-base-300 group">
                    <img src={img} alt={`Uploaded ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 btn btn-xs btn-error btn-square rounded-none opacity-90 text-white"
                    >
                      <FaTrash className="text-[10px]" />
                    </button>
                    <span className="absolute bottom-1 left-1 bg-black/80 text-white text-[9px] font-bold px-1">
                      {idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Video Tour Upload / URL */}
          <div className="p-4 bg-base-100 border border-base-300 space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-base-content">
              Video Tour (Direct Upload or URL)
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoFileChange}
              disabled={uploadingVideo}
              className="file-input file-input-bordered file-input-secondary rounded-none border border-base-200 w-full text-xs font-bold"
            />
            <span className="text-[10px] text-base-content/60 font-mono block">Max size: 10 MB</span>
            <div className="relative">
              <input
                type="url"
                name="video"
                placeholder="Or paste video tour URL..."
                value={formData.video}
                onChange={handleChange}
                className="input input-bordered rounded-none border border-base-200 w-full pl-10 text-xs font-mono"
              />
              <FaVideo className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
            </div>
            {uploadingVideo && <span className="text-xs text-secondary font-bold animate-pulse">Uploading video to Cloudinary...</span>}
          </div>

          {/* Details / Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-base-content">
              Apartment Details & Specifications Description
            </label>
            <div className="relative">
              <textarea
                name="details"
                rows="4"
                placeholder="Describe rooms, furnishings, balcony view, appliances, amenities..."
                value={formData.details}
                onChange={handleChange}
                className="textarea textarea-bordered rounded-none border border-base-200 w-full pl-10 pt-3 font-medium text-sm"
              ></textarea>
              <FaFileAlt className="absolute left-3 top-4 text-base-content/40" />
            </div>
          </div>

          {/* Availability Checkbox */}
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="available"
              name="available"
              checked={formData.available}
              onChange={handleChange}
              className="checkbox checkbox-primary rounded-none checkbox-sm"
            />
            <label htmlFor="available" className="text-xs font-bold uppercase tracking-wider text-base-content cursor-pointer">
              Mark Apartment as Available for Lease Immediately
            </label>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-base-200">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-ghost rounded-none font-bold uppercase text-xs tracking-wider"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploadingImage || uploadingVideo}
              className="btn btn-primary rounded-none font-bold uppercase text-xs tracking-wider border border-primary min-w-[160px]"
            >
              {loading ? "Creating..." : "Create Apartment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddApartment;
