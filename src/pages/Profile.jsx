import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
import Loader from "../components/Common/Loader";
import CustomCursor from "../components/Common/CustomCursor";
import CursorSettingsPanel from "../components/Common/CursorSettingsPanel";
import AppearanceSettings from "../components/Profile/AppearanceSettings";
import { AuthContext } from "../AuthContext";
import { useCursor } from "../context/CursorContext";
import { generateAvatarOptions, getAvatarByIndex } from "../utils/avatarUtils";
import { FaMars, FaVenus, FaGenderless, FaTrash, FaCamera, FaXmark, FaWandMagicSparkles, FaCrop } from "react-icons/fa6";

const UNIVERSITIES = ["RTU", "GGSIPU", "DTU", "AKTU"];
const BRANCHES = ["CSE", "IT", "ECE", "EE", "ME", "Civil", "AIDS"];
const GENDERS = ["Male", "Female", "Other"];

const GenderIcon = ({ gender }) => {
  switch (gender) {
    case "Male": return <FaMars />;
    case "Female": return <FaVenus />;
    default: return <FaGenderless />;
  }
};

// Simple Image Cropper & Filter Component
const ImageCropper = ({ imageSrc, onCancel, onSave }) => {
  const [zoom, setZoom] = useState(1);
  const [baseScale, setBaseScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [filter, setFilter] = useState("none"); // none, grayscale, sepia, vintage
  const [isDragging, setIsDragging] = useState(false);
  const startPan = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    startPan.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - startPan.current.x, y: e.clientY - startPan.current.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const applyFilter = (ctx, width, height) => {
    if (filter === "grayscale") {
      ctx.globalCompositeOperation = "saturation";
      ctx.fillStyle = "white";
      ctx.globalAlpha = 0; // standard canvas doesn't support blend modes easily without complex logic, using CSS filter for save is better
      // Actually, standard canvas 'filter' property exists in modern browsers
      ctx.filter = "grayscale(100%)";
    } else if (filter === "sepia") {
      ctx.filter = "sepia(100%)";
    } else if (filter === "vintage") {
      ctx.filter = "sepia(50%) contrast(120%) brightness(90%)";
    } else {
      ctx.filter = "none";
    }
  };

  const handleSave = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const size = 300; // Output size
    canvas.width = size;
    canvas.height = size;

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);

    // Filter
    applyFilter(ctx, size, size);

    // Draw
    const img = imageRef.current;
    // Calculate draw parameters to match the visual crop
    // The container is 256x256 (w-64).
    // The scale is zoom.
    // The pan is relative to the center.
    
    // Simplification: Draw image centered with pan and zoom (corrected for baseScale and output ratio)
    const ratio = size / 256;
    ctx.translate(size / 2 + pan.x * ratio, size / 2 + pan.y * ratio);
    ctx.scale(zoom * baseScale * ratio, zoom * baseScale * ratio);
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

    onSave(canvas.toDataURL("image/jpeg", 0.9));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <Card className="max-w-md w-full shadow-2xl" style={{ backgroundColor: "var(--bg-secondary)" }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <FaCrop /> Edit Photo
          </h3>
          <button onClick={onCancel} className="hover:opacity-80 transition-opacity" style={{ color: "var(--text-tertiary)" }}>
            <FaXmark />
          </button>
        </div>

        {/* Crop Area */}
        <div 
          className="relative w-64 h-64 mx-auto bg-slate-100 rounded-full overflow-hidden border-4 border-indigo-100 shadow-inner cursor-move touch-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          ref={containerRef}
        >
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Crop preview"
            onLoad={(e) => {
              const { naturalWidth, naturalHeight } = e.currentTarget;
              // default container size 256px
              const scale = Math.max(256 / naturalWidth, 256 / naturalHeight);
              setBaseScale(scale);
            }}
            className="absolute max-w-none origin-center pointer-events-none select-none transition-filter duration-200"
            style={{
              transform: `translate(-50%, -50%) translate(${pan.x}px, ${pan.y}px) scale(${zoom * baseScale})`,
              left: "50%",
              top: "50%",
              filter: filter === "grayscale" ? "grayscale(100%)" : 
                      filter === "sepia" ? "sepia(100%)" : 
                      filter === "vintage" ? "sepia(50%) contrast(120%) brightness(90%)" : "none"
            }}
            draggable={false}
          />
        </div>
        <p className="text-center text-xs text-slate-400 mt-2">Drag to pan • Pinch/Slide to zoom</p>

        {/* Controls */}
        <div className="space-y-4 mt-6">
          {/* Zoom */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Zoom</label>
            <input
              type="range"
              min="1"
              max="3"
              step="0.01"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          {/* Filters */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1 mb-2">
              <FaWandMagicSparkles size={10} /> Filters
            </label>
            <div className="flex gap-2 justify-center">
              {[
                { id: "none", label: "Normal" },
                { id: "grayscale", label: "B&W" },
                { id: "sepia", label: "Sepia" },
                { id: "vintage", label: "Vintage" }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  type="button"
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    filter === f.id
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8">
          <Button variant="ghost" onClick={onCancel} fullWidth>Cancel</Button>
          <Button onClick={handleSave} fullWidth>Save Photo</Button>
        </div>
      </Card>
    </div>
  );
};



const Profile = () => {
  const navigate = useNavigate();
  const { setUser, logout } = useContext(AuthContext);
  const { isEnabled, setIsEnabled, cursorSpeed, setCursorSpeed } = useCursor();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteStep, setDeleteStep] = useState(1); // 1 = reason, 2 = confirm
  const [deleteReason, setDeleteReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  
  // Custom Avatar States
  const [showCropModal, setShowCropModal] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({ 
    name: "", 
    email: "",
    university: "",
    branch: "",
    gender: "",
    selectedAvatar: 0,
    customAvatar: null // Base64 string
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Deletion reason options
  const DELETE_REASONS = [
    "Not using the app anymore",
    "Found a better alternative",
    "Too many notifications",
    "Privacy concerns",
    "App is too complicated",
    "Missing features I need",
    "Just exploring, not a student",
    "Other"
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/me`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const user = response.data.user || response.data;
      setUserData(user);
      setFormData({ 
        name: user.name || "", 
        email: user.email || "",
        university: user.university || "",
        branch: user.branch || "",
        gender: user.gender || "",
        selectedAvatar: user.avatarIndex || 0,
        customAvatar: null // We don't load into formData until edit, but display uses userData
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (field, value) => {
    // If selecting a predefined avatar, clear custom one
    if (field === "selectedAvatar") {
      setFormData(prev => ({
        ...prev,
        [field]: value,
        customAvatar: null // Clear custom if picking from list
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };
  
  // Image Upload Handlers
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTempImage(reader.result);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    e.target.value = null;
  };

  const handleCropSave = (croppedImage) => {
    setFormData(prev => ({
      ...prev,
      customAvatar: croppedImage,
      selectedAvatar: -1 // Special index to indicate custom
    }));
    setShowCropModal(false);
    setTempImage(null);
  };
  
  const handleRemoveAvatar = () => {
    setFormData(prev => ({
      ...prev,
      customAvatar: null,
      selectedAvatar: 0
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      
      // Prepare payload
      const payload = {
        name: formData.name,
        university: formData.university,
        branch: formData.branch,
        gender: formData.gender,
        avatarIndex: formData.selectedAvatar
      };

      // Handle custom avatar logic
      if (formData.selectedAvatar === -1 && formData.customAvatar) {
        payload.avatar = formData.customAvatar;
      } else if (formData.selectedAvatar !== -1) {
        // If user selected a preset avatar, clear the custom one
        payload.avatar = ""; 
      }

      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/me`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const updatedUser = response.data.user;
      
      // Update context and localStorage
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      setUserData(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  // ... (handleDeleteAccount remains same)

  // ... (resetDeleteModal remains same)

  // Get gender icon component - keep same

  // Generate avatar URL based on user's email, gender and selected index
  const getAvatarUrl = () => {
    // 1. Previewing custom uploaded avatar (Edit Mode)
    if (isEditing && formData.customAvatar) {
        return formData.customAvatar;
    }
    
    // 2. Previewing selected preset avatar (Edit Mode)
    if (isEditing && formData.selectedAvatar !== -1) {
        const seed = formData.email || "default";
        const gender = formData.gender || "Other";
        return getAvatarByIndex(seed, gender, formData.selectedAvatar);
    }

    // 3. Saved Custom Avatar (View Mode / Default Edit Mode if not changed)
    if (userData?.avatar) {
        return userData.avatar;
    }

    // 4. Default DiceBear Avatar
    // Fallback if userData is null to prevent error
    const email = userData?.email || "default";
    const gender = userData?.gender || "Other";
    const index = userData?.avatarIndex || 0;
    return getAvatarByIndex(email, gender, index);
  };

  // Get avatar options for picker - regenerates when gender changes
  const avatarOptions = generateAvatarOptions(
    formData.email || "default",
    formData.gender || "Other"
  );

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="min-h-screen w-full p-6 bg-transparent">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8" style={{ color: "var(--text-primary)" }}>
          Profile
        </h1>

        <Card className="shadow-lg" style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-secondary)" }}>
          {/* Avatar with Gender Badge */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src={getAvatarUrl()}
                alt={userData?.name || "User Avatar"}
                className="w-24 h-24 rounded-full shadow-xl border-4 border-white"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div
                className="w-24 h-24 rounded-full items-center justify-center text-4xl font-bold text-white shadow-xl bg-gradient-to-br from-indigo-600 to-violet-600 hidden"
              >
                {userData?.name?.[0]?.toUpperCase() || "U"}
              </div>
              {/* Gender Badge */}
              {userData?.gender && (
                <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white ${
                  userData.gender === "Male" ? "bg-blue-500" : 
                  userData.gender === "Female" ? "bg-pink-500" : "bg-purple-500"
                }`}>
                  {userData.gender === "Male" ? <FaMars className="text-white text-sm" /> : 
                   userData.gender === "Female" ? <FaVenus className="text-white text-sm" /> : 
                   <FaGenderless className="text-white text-sm" />}
                </div>
              )}
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-6">
              {/* Avatar Selection & Upload */}
              <div>
                <label className="block mb-3 text-sm font-bold" style={{ color: "var(--text-secondary)" }}>
                  Profile Picture
                </label>
                
                {/* Upload Options */}
                <div className="flex flex-col gap-3 mb-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex gap-3">
                      <Button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 border-2 shadow-sm"
                        style={{ 
                          backgroundColor: "var(--bg-primary)", 
                          borderColor: "var(--border-default)", 
                          color: "var(--text-primary)" 
                        }}
                      >
                        <FaCamera className="mr-2" /> Upload Photo
                      </Button>
                    {(formData.customAvatar || (userData?.avatar && formData.selectedAvatar === -1)) && (
                      <Button 
                        type="button" 
                        onClick={handleRemoveAvatar}
                        className="px-4 bg-red-50 text-red-600 border-2 border-red-100 hover:bg-red-100 hover:border-red-200"
                        title="Remove custom photo"
                      >
                        <FaTrash />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px bg-slate-200 flex-1"></div>
                  <span className="text-xs text-slate-400 font-bold uppercase">Or choose from list</span>
                  <div className="h-px bg-slate-200 flex-1"></div>
                </div>

                <div className={`max-h-48 overflow-y-auto border-2 rounded-xl p-3 transition-all ${formData.customAvatar ? 'opacity-50 pointer-events-none grayscale' : ''}`}
                     style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-tertiary)" }}>
                  <div className="grid grid-cols-5 gap-2">
                    {avatarOptions.map((avatar) => (
                      <button
                        key={avatar.id}
                        type="button"
                        onClick={() => handleSelect("selectedAvatar", avatar.id)}
                        className={`p-1 rounded-full transition-all ${
                          formData.selectedAvatar === avatar.id
                            ? "ring-4 ring-indigo-500 ring-offset-2 bg-indigo-50"
                            : "hover:ring-2 hover:ring-slate-300 hover:bg-white"
                        }`}
                      >
                        <img
                          src={avatar.url}
                          alt={`Avatar option ${avatar.id + 1}`}
                          className="w-10 h-10 rounded-full"
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  {formData.customAvatar 
                    ? "Remove your custom photo to select from the list above" 
                    : (formData.gender ? `Showing ${formData.gender.toLowerCase()} avatars` : "Select gender to see matching avatars")
                  }
                </p>
              </div>

              {/* Name */}
              <div>
                <label className="block mb-2 font-bold text-sm" style={{ color: "var(--text-secondary)" }}>
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 font-medium focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: "var(--bg-tertiary)",
                    borderColor: "var(--border-default)",
                    color: "var(--text-primary)",
                    // outlineColor handled by ring classes roughly or rely on focus ring color
                  }}
                />
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="block mb-2 font-bold text-sm" style={{ color: "var(--text-secondary)" }}>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 rounded-xl border-2 font-medium cursor-not-allowed"
                  style={{
                    backgroundColor: "var(--bg-tertiary)",
                    borderColor: "var(--border-default)",
                    color: "var(--text-tertiary)",
                    opacity: 0.7
                  }}
                />
              </div>

              {/* University */}
              <div>
                <label className="block mb-3 text-sm font-bold text-slate-700">
                  University
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {UNIVERSITIES.map((uni) => (
                    <button
                      key={uni}
                      type="button"
                      onClick={() => setFormData({ ...formData, university: uni, customUniversity: "" })}
                      className={`px-4 py-3 rounded-xl border-2 font-bold transition-all ${
                        formData.university === uni && !formData.customUniversity
                          ? "text-white shadow-lg"
                          : "hover:bg-opacity-80"
                      }`}
                      style={formData.university === uni && !formData.customUniversity ? {
                          backgroundColor: "var(--action-primary)", borderColor: "var(--action-primary)", color: "#fff"
                      } : {
                          backgroundColor: "var(--bg-primary)", borderColor: "var(--border-default)", color: "var(--text-secondary)"
                      }}
                    >
                      {uni}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, university: "Other", customUniversity: formData.customUniversity || "" })}
                    className={`px-4 py-3 rounded-xl border-2 font-bold transition-all ${
                      formData.university === "Other" || (formData.customUniversity && !UNIVERSITIES.includes(formData.university))
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-lg"
                        : "bg-slate-50 border-slate-300 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50"
                    }`}
                  >
                    Other
                  </button>
                </div>
                {(formData.university === "Other" || (formData.customUniversity && !UNIVERSITIES.includes(formData.university))) && (
                  <input
                    type="text"
                    placeholder="Enter your university name"
                    value={formData.customUniversity || (UNIVERSITIES.includes(formData.university) ? "" : formData.university)}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value || "Other", customUniversity: e.target.value })}
                    className="mt-3 w-full px-4 py-3 rounded-xl border-2 border-slate-300 bg-slate-50 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                )}
              </div>

              {/* Branch */}
              <div>
                <label className="block mb-3 text-sm font-bold text-slate-700">
                  Branch
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {BRANCHES.map((branch) => (
                    <button
                      key={branch}
                      type="button"
                      onClick={() => setFormData({ ...formData, branch: branch, customBranch: "" })}
                      className={`px-3 py-2.5 rounded-xl border-2 font-bold text-sm transition-all ${
                        formData.branch === branch && !formData.customBranch
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-lg"
                          : "hover:border-indigo-400" // Simplify hover or use vars but tricky with conditional.
                      }`}
                      style={formData.branch === branch && !formData.customBranch ? {
                          background: "var(--action-primary)", borderColor: "var(--action-primary)", color: "#fff"
                      } : {
                          backgroundColor: "var(--bg-primary)", borderColor: "var(--border-default)", color: "var(--text-secondary)"
                      }}
                    >
                      {branch}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, branch: "Other", customBranch: formData.customBranch || "" })}
                    className={`px-3 py-2.5 rounded-xl border-2 font-bold text-sm transition-all ${
                      formData.branch === "Other" || (formData.customBranch && !BRANCHES.includes(formData.branch))
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-lg"
                        : "bg-slate-50 border-slate-300 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50"
                    }`}
                  >
                    Other
                  </button>
                </div>
                {(formData.branch === "Other" || (formData.customBranch && !BRANCHES.includes(formData.branch))) && (
                  <input
                    type="text"
                    placeholder="Enter your branch name"
                    value={formData.customBranch || (BRANCHES.includes(formData.branch) ? "" : formData.branch)}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value || "Other", customBranch: e.target.value })}
                    className="mt-3 w-full px-4 py-3 rounded-xl border-2 border-slate-300 bg-slate-50 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block mb-3 text-sm font-bold text-slate-700">
                  Gender
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {GENDERS.map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => handleSelect("gender", gender)}
                      className={`px-4 py-2.5 rounded-xl border-2 font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                        formData.gender === gender
                          ? "text-white shadow-lg"
                          : "hover:bg-opacity-80"
                      }`}
                      style={formData.gender === gender ? {
                          backgroundColor: "var(--action-primary)", borderColor: "var(--action-primary)", color: "#fff"
                      } : {
                          backgroundColor: "var(--bg-primary)", borderColor: "var(--border-default)", color: "var(--text-secondary)"
                      }}
                    >
                      <GenderIcon gender={gender} />
                      {gender}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" loading={saving} disabled={saving} fullWidth>
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({ 
                      name: userData.name, 
                      email: userData.email,
                      university: userData.university || "",
                      branch: userData.branch || "",
                      gender: userData.gender || "",
                      selectedAvatar: userData.avatarIndex || 0
                    });
                  }}
                  fullWidth
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                  {userData?.name || "User Name"}
                </div>
                <div className="text-lg" style={{ color: "var(--text-secondary)" }}>
                  {userData?.email || "email@example.com"}
                </div>
              </div>

              {/* Profile Details - Only University and Branch */}
              <div className="grid grid-cols-2 gap-4 py-4 border-t border-b" style={{ borderColor: "var(--border-default)" }}>
                <div className="text-center">
                  <div className="text-xs font-bold uppercase mb-1" style={{ color: "var(--text-tertiary)" }}>University</div>
                  <div className="font-bold" style={{ color: "var(--text-primary)" }}>{userData?.university || "—"}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold uppercase mb-1" style={{ color: "var(--text-tertiary)" }}>Branch</div>
                  <div className="font-bold" style={{ color: "var(--text-primary)" }}>{userData?.branch || "—"}</div>
                </div>
              </div>

              <div className="text-center text-sm" style={{ color: "var(--text-tertiary)" }}>
                Member since {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "N/A"}
              </div>

              <Button onClick={() => setIsEditing(true)} variant="primary" fullWidth>
                Edit Profile
              </Button>
            </div>
          )}
        </Card>

        {/* Interface Settings */}
        {/* Interface & Appearance Settings */}
        <Card className="mt-6 shadow-lg" style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-secondary)" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg" style={{ backgroundColor: "var(--action-primary)", color: "#fff", opacity: 0.9 }}>
               <FaWandMagicSparkles className="text-xl" />
            </div>
            <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Appearance & Interface</h3>
          </div>

          <div className="space-y-8">
            <AppearanceSettings />
            
            <div className="pt-6 border-t" style={{ borderColor: "var(--border-default)" }}>
              <h4 className="text-sm font-bold mb-4 uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Cursor Settings</h4>
              <CursorSettingsPanel />
            </div>
          </div>
        </Card>

        {/* Danger Zone - Account Deletion */}
        <Card className="mt-6 shadow-lg" style={{ backgroundColor: "var(--color-danger-bg)", borderColor: "var(--color-danger-bg)", "--tw-bg-opacity": 0.05, "--tw-border-opacity": 0.2 }}>
           {/* Note: easier to use inline styles for generic vars or just bg vars directly */}
           <div style={{ backgroundColor: "rgba(var(--color-danger-bg-rgb), 0.05)", border: "1px solid rgba(var(--color-danger-bg-rgb), 0.2)", borderRadius: "1rem", padding: "1.5rem" }}>
              <div className="flex items-center gap-3 mb-4">
                <FaTrash style={{ color: "var(--color-danger-text)" }} />
                <h3 className="text-lg font-bold" style={{ color: "var(--color-danger-text)" }}>Danger Zone</h3>
              </div>
              <p className="text-sm mb-4" style={{ color: "var(--color-danger-text)" }}>
                Once you delete your account, there is no going back. This will permanently delete your account and all associated data.
              </p>
              <Button
                variant="ghost"
                onClick={() => setShowDeleteModal(true)}
                className="border hover:bg-red-100" // Keep hover class for now or use vars if Button supports style prop well. Button logic handles variant ghost.
                style={{ 
                   borderColor: "rgba(var(--color-danger-bg-rgb), 0.3)", 
                   color: "var(--color-danger-text)" 
                }}
              >
                Delete Account
              </Button>
           </div>
        </Card>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
              
              {/* Step 1: Select Reason */}
              {deleteStep === 1 && (
                <>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                      <span className="text-2xl">💔</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">We're sad to see you go!</h3>
                    <p className="text-slate-500 mt-2">
                      Before you leave, please tell us why. Your feedback helps us improve.
                    </p>
                  </div>

                  <div className="space-y-2 mb-6">
                    {DELETE_REASONS.map((reason) => (
                      <button
                        key={reason}
                        onClick={() => setDeleteReason(reason)}
                        className={`w-full text-left px-4 py-3 rounded-xl border-2 font-medium transition-all ${
                          deleteReason === reason
                            ? "bg-red-50 border-red-400 text-red-700"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        {reason}
                      </button>
                    ))}
                  </div>

                  {deleteReason === "Other" && (
                    <div className="mb-6">
                      <textarea
                        value={otherReason}
                        onChange={(e) => setOtherReason(e.target.value)}
                        placeholder="Please tell us more..."
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 bg-slate-50 font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"
                        rows={3}
                      />
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button
                      variant="ghost"
                      onClick={resetDeleteModal}
                      fullWidth
                    >
                      Never mind
                    </Button>
                    <Button
                      onClick={() => setDeleteStep(2)}
                      disabled={!deleteReason || (deleteReason === "Other" && !otherReason.trim())}
                      fullWidth
                      className="bg-red-600 hover:bg-red-700 border-red-600 text-white"
                    >
                      Continue
                    </Button>
                  </div>
                </>
              )}

              {/* Step 2: Confirm Deletion */}
              {deleteStep === 2 && (
                <>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                      <FaTrash className="text-2xl text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Final Confirmation</h3>
                    <p className="text-slate-500 mt-2">
                      This action cannot be undone. All your data will be permanently removed.
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 mb-6">
                    <p className="text-sm text-slate-600">
                      <strong>Reason:</strong> {deleteReason === "Other" ? otherReason : deleteReason}
                    </p>
                  </div>

                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-bold text-slate-700">
                      Type <span className="text-red-600">DELETE</span> to confirm
                    </label>
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 bg-slate-50 font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                      placeholder="DELETE"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="ghost"
                      onClick={() => setDeleteStep(1)}
                      fullWidth
                    >
                      ← Back
                    </Button>
                    <Button
                      onClick={handleDeleteAccount}
                      disabled={deleteConfirmText !== "DELETE" || deleting}
                      loading={deleting}
                      fullWidth
                      className="bg-red-600 hover:bg-red-700 border-red-600 text-white"
                    >
                      Delete Forever
                    </Button>
                  </div>
                </>
              )}
            </Card>
          </div>
        )}

        {/* Image Cropper Modal */}
        {showCropModal && tempImage && (
          <ImageCropper
            imageSrc={tempImage}
            onCancel={() => {
              setShowCropModal(false);
              setTempImage(null);
            }}
            onSave={handleCropSave}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;

