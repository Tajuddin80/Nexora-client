import React, { useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  FaBuilding,
  FaDollarSign,
  FaImage,
  FaVideo,
  FaFileAlt,
  FaLayerGroup,
  FaCloudUploadAlt,
  FaCheckCircle,
} from "react-icons/fa";

const AddApartment = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const [formData, setFormData] = useState({
    apartmentNo: "",
    floorNo: "",
    blockName: "",
    rent: "",
    image: "",
    video: "",
    details: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Direct Cloudinary Image Upload Handler (Max 1 MB)
  const handleImageFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "File Too Large",
        text: "Image file size must be less than 1 MB.",
      });
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
        setFormData((prev) => ({ ...prev, image: res.data.url }));
        Swal.fire({
          icon: "success",
          title: "Image Uploaded!",
          text: "Direct Cloudinary image upload successful.",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error("Direct image upload error:", err);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: err?.response?.data?.message || "Failed to upload image to Cloudinary.",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  // Direct Cloudinary Video Upload Handler (Max 10 MB)
  const handleVideoFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "File Too Large",
        text: "Video file size must be less than 10 MB.",
      });
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
        Swal.fire({
          icon: "success",
          title: "Video Uploaded!",
          text: "Direct Cloudinary video upload successful.",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error("Direct video upload error:", err);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: err?.response?.data?.message || "Failed to upload video to Cloudinary.",
      });
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      Swal.fire({
        icon: "warning",
        title: "Image Required",
        text: "Please upload an apartment image or provide an image URL.",
      });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        apartmentNo: formData.apartmentNo.trim(),
        floorNo: formData.floorNo ? parseInt(formData.floorNo, 10) : 0,
        blockName: formData.blockName.trim(),
        rent: parseFloat(formData.rent),
        image: formData.image.trim(),
        video: formData.video.trim(),
        details: formData.details.trim(),
        available: true,
      };

      const res = await axiosSecure.post("/apartments", payload);

      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Apartment Created!",
          text: `Apartment ${payload.apartmentNo} has been created successfully.`,
          showConfirmButton: false,
          timer: 1800,
        });
        navigate("/apartments");
      }
    } catch (err) {
      console.error("Create apartment error:", err);
      Swal.fire({
        icon: "error",
        title: "Creation Failed",
        text: err?.response?.data?.message || "Failed to create apartment.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 md:px-10 py-6">
      <div className="bg-base-100 border-2 border-base-300 p-6 md:p-10 shadow-md">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-base-300">
          <FaBuilding className="text-4xl text-primary" />
          <div>
            <h1 className="text-2xl md:text-4xl font-black uppercase tracking-wider text-base-content">
              Add New Apartment
            </h1>
            <p className="text-xs md:text-sm text-base-content/70 font-medium">
              Create a new residence listing. Direct Cloudinary image (Max 1MB) & video (Max 10MB) file upload supported.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Apartment No */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2 text-base-content">
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
                  className="input input-bordered rounded-none border-2 border-base-300 w-full pl-10 font-bold"
                />
                <FaBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              </div>
            </div>

            {/* Rent Amount */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2 text-base-content">
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
                  className="input input-bordered rounded-none border-2 border-base-300 w-full pl-10 font-bold"
                />
                <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              </div>
            </div>

            {/* Floor Number */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2 text-base-content">Floor Number</label>
              <div className="relative">
                <input
                  type="number"
                  name="floorNo"
                  placeholder="e.g. 4"
                  value={formData.floorNo}
                  onChange={handleChange}
                  className="input input-bordered rounded-none border-2 border-base-300 w-full pl-10 font-bold"
                />
                <FaLayerGroup className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              </div>
            </div>

            {/* Block Name */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2 text-base-content">Block Name</label>
              <div className="relative">
                <input
                  type="text"
                  name="blockName"
                  placeholder="e.g. Block A"
                  value={formData.blockName}
                  onChange={handleChange}
                  className="input input-bordered rounded-none border-2 border-base-300 w-full pl-10 font-bold"
                />
                <FaBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              </div>
            </div>

            {/* Direct Image Upload / URL */}
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-wider text-base-content">
                Apartment Image (Direct Upload or URL) <span className="text-error">*</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  disabled={uploadingImage}
                  className="file-input file-input-bordered file-input-primary rounded-none border-2 border-base-300 w-full text-xs font-bold"
                />
              </div>
              <span className="text-[10px] text-base-content/60 font-mono block">Max size: 1 MB (PNG, JPG, WebP)</span>
              <div className="relative">
                <input
                  type="url"
                  name="image"
                  placeholder="Or paste Cloudinary/Unsplash Image URL..."
                  value={formData.image}
                  onChange={handleChange}
                  className="input input-bordered rounded-none border-2 border-base-300 w-full pl-10 text-xs font-mono"
                />
                <FaImage className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              </div>
              {uploadingImage && <span className="text-xs text-primary font-bold animate-pulse">Uploading image to Cloudinary...</span>}
            </div>

            {/* Direct Video Upload / URL */}
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-wider text-base-content">
                Apartment Video Tour (Direct Upload or URL)
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoFileChange}
                  disabled={uploadingVideo}
                  className="file-input file-input-bordered file-input-secondary rounded-none border-2 border-base-300 w-full text-xs font-bold"
                />
              </div>
              <span className="text-[10px] text-base-content/60 font-mono block">Max size: 10 MB (MP4, WebM, MOV)</span>
              <div className="relative">
                <input
                  type="url"
                  name="video"
                  placeholder="Or paste Video URL (YouTube/Vimeo)..."
                  value={formData.video}
                  onChange={handleChange}
                  className="input input-bordered rounded-none border-2 border-base-300 w-full pl-10 text-xs font-mono"
                />
                <FaVideo className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              </div>
              {uploadingVideo && <span className="text-xs text-secondary font-bold animate-pulse">Uploading video to Cloudinary...</span>}
            </div>
          </div>

          {/* Details / Description */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-2 text-base-content">
              Apartment Details & Features
            </label>
            <div className="relative">
              <textarea
                name="details"
                rows="4"
                placeholder="Describe rooms, balcony, furnishings, amenities..."
                value={formData.details}
                onChange={handleChange}
                className="textarea textarea-bordered rounded-none border-2 border-base-300 w-full pl-10 pt-3 font-medium"
              ></textarea>
              <FaFileAlt className="absolute left-3 top-4 text-base-content/40" />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t-2 border-base-300">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-ghost rounded-none font-black uppercase text-xs tracking-wider"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploadingImage || uploadingVideo}
              className="btn btn-primary rounded-none font-black uppercase text-xs tracking-wider border-2 border-primary min-w-[160px]"
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
