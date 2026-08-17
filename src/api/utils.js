import axios from "axios";

export const imageUpload = async (imageFile) => {
  if (!imageFile) return null;

  // 1. Attempt Cloudinary Upload
  try {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "ml_default"
    );
    formData.append(
      "api_key",
      import.meta.env.VITE_CLOUDINARY_API_KEY || "534143958426955"
    );

    const cloudName =
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "nexora";

    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );

    if (data?.secure_url || data?.url) {
      return data.secure_url || data.url;
    }
  } catch (error) {
    console.warn(
      "Cloudinary upload failed, using Data URL fallback:",
      error?.response?.data || error?.message
    );
  }

  // 2. Fail-safe Base64 Data URL fallback
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => resolve("https://i.ibb.co/whvstfQ6/lr36.jpg");
    reader.readAsDataURL(imageFile);
  });
};
