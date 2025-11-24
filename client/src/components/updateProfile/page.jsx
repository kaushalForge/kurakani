import React, { useState, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiUpload, FiCrop } from "react-icons/fi";
import { toast } from "sonner";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../../utils/cropImage"; // adjust path

const UpdateProfile = () => {
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [originalFile, setOriginalFile] = useState(null); // keep the original File
  const [croppedImage, setCroppedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);

  // File selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      toast.error("File not supported. Use png, jpg or jpeg only.");
      return;
    }

    setOriginalFile(file); // save original file for crop
    setPreview(URL.createObjectURL(file));
    setShowCropper(true);
  };

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropDone = async () => {
    if (!originalFile || !croppedAreaPixels) return;

    // Pass the original file (or blob) to crop utility
    const croppedBlob = await getCroppedImg(originalFile, croppedAreaPixels);

    const croppedFile = new File([croppedBlob], originalFile.name, {
      type: originalFile.type,
    });

    setCroppedImage(croppedFile); // final image to send
    setPreview(URL.createObjectURL(croppedFile));
    setShowCropper(false);
  };

  const handleCropCancel = () => setShowCropper(false);

  const handleReCrop = () => {
    if (!originalFile) return;
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setPreview(URL.createObjectURL(originalFile));
    setShowCropper(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("oldPassword", oldPassword);
      if (newPassword) formData.append("newPassword", newPassword);
      if (croppedImage) formData.append("profilePicture", croppedImage); // only append if new image

      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: token,
          },
        }
      );

      toast.success(res.data.message || "Profile updated successfully!");

      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        window.location.href = "/";
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      {/* Cropper modal */}
      {showCropper && preview && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70">
          <div className="relative w-[400px] h-[400px] bg-gray-800 rounded-xl flex items-center justify-center">
            <Cropper
              image={preview}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              cropShape="round"
              showGrid={false}
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
              <button
                type="button"
                onClick={handleCropDone}
                className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700"
              >
                Done
              </button>
              <button
                type="button"
                onClick={handleCropCancel}
                className="bg-gray-600 px-4 py-2 rounded text-white hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-3/4"
            />
          </div>
        </div>
      )}

      {/* Main form */}
      <motion.div className="w-full max-w-2xl p-8 bg-gray-800 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-100 mb-6 text-center">
          Update Profile
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Profile picture */}
          <div className="flex flex-col items-center">
            <div className="relative w-40 h-40 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center cursor-pointer">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="text-gray-400 text-4xl flex flex-col items-center justify-center">
                  <FiUpload className="animate-bounce" />
                  <span className="text-sm mt-2">Upload</span>
                </div>
              )}
              <input
                type="file"
                accept=".png, .jpg, .jpeg"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            {preview && !showCropper && (
              <button
                type="button"
                onClick={handleReCrop}
                className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <FiCrop /> Re-crop
              </button>
            )}
          </div>

          {/* Inputs */}
          <div className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="*Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
              type="password"
              placeholder="*Verify Old Password"
              value={oldPassword}
              required
              onChange={(e) => setOldPassword(e.target.value)}
              className="p-3 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
              type="password"
              placeholder="New Password (optional)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="p-3 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-blue-600 text-white font-semibold p-3 rounded hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading && (
                <AiOutlineLoading3Quarters className="animate-spin" />
              )}
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default UpdateProfile;
