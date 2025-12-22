import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
import Loader from "../components/Common/Loader";
import { AuthContext } from "../AuthContext";
import { generateAvatarOptions, getAvatarByIndex } from "../utils/avatarUtils";
import { FaMars, FaVenus, FaGenderless, FaTrash } from "react-icons/fa";

const UNIVERSITIES = ["RTU", "GGSIPU", "DTU", "AKTU"];
const BRANCHES = ["CSE", "IT", "ECE", "EE", "ME", "Civil", "AIDS"];
const GENDERS = ["Male", "Female", "Other"];

const Profile = () => {
  const navigate = useNavigate();
  const { user: clerkUser } = useUser();
  const { setUser, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "",
    university: "",
    branch: "",
    gender: "",
    selectedAvatar: 0 // Index of selected avatar
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
        selectedAvatar: user.avatarIndex || 0
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/me`,
        {
          name: formData.name,
          university: formData.university,
          branch: formData.branch,
          gender: formData.gender,
          avatarIndex: formData.selectedAvatar
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update context and localStorage
      const updatedUser = { ...userData, ...formData, avatarIndex: formData.selectedAvatar };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      fetchProfile();
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    setDeleting(true);
    
    try {
      const token = localStorage.getItem("token");
      
      // Delete from backend first
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/me`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Delete from Clerk if user exists
      if (clerkUser) {
        try {
          await clerkUser.delete();
        } catch (clerkErr) {
          console.error("Clerk deletion error (may not exist):", clerkErr);
          // Continue even if Clerk deletion fails - backend is source of truth
        }
      }
      
      // Clear local storage and logout
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      logout();
      
      // Redirect to home
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
      setDeleting(false);
    }
  };

  // Get gender icon component
  const GenderIcon = ({ gender, className = "" }) => {
    if (gender === "Male") return <FaMars className={className} />;
    if (gender === "Female") return <FaVenus className={className} />;
    return <FaGenderless className={className} />;
  };

  // Generate avatar URL based on user's email, gender and selected index
  const getAvatarUrl = () => {
    const email = userData?.email || userData?._id || "default";
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
    <div className="min-h-screen w-full p-6 bg-slate-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-slate-900">
          Profile
        </h1>

        <Card className="shadow-lg border-slate-200">
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
                  <GenderIcon gender={userData.gender} className="text-white text-sm" />
                </div>
              )}
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-6">
              {/* Avatar Picker */}
              <div>
                <label className="block mb-3 text-sm font-bold text-slate-700">
                  Choose Your Avatar
                </label>
                <div className="max-h-48 overflow-y-auto border-2 border-slate-200 rounded-xl p-3 bg-slate-50">
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
                  {formData.gender ? `Showing ${formData.gender.toLowerCase()} avatars` : "Select gender to see matching avatars"}
                </p>
              </div>

              {/* Name */}
              <div>
                <label className="block mb-2 font-bold text-sm text-slate-700">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 bg-slate-50 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="block mb-2 font-bold text-sm text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-100 font-medium text-slate-500 cursor-not-allowed"
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
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-lg"
                          : "bg-slate-50 border-slate-300 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50"
                      }`}
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
                          : "bg-slate-50 border-slate-300 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50"
                      }`}
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
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-lg"
                          : "bg-slate-50 border-slate-300 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50"
                      }`}
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
                <div className="text-2xl font-bold mb-2 text-slate-900">
                  {userData?.name || "User Name"}
                </div>
                <div className="text-lg text-slate-500">
                  {userData?.email || "email@example.com"}
                </div>
              </div>

              {/* Profile Details - Only University and Branch */}
              <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-slate-100">
                <div className="text-center">
                  <div className="text-xs font-bold text-slate-400 uppercase mb-1">University</div>
                  <div className="font-bold text-slate-800">{userData?.university || "—"}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-slate-400 uppercase mb-1">Branch</div>
                  <div className="font-bold text-slate-800">{userData?.branch || "—"}</div>
                </div>
              </div>

              <div className="text-center text-sm text-slate-500">
                Member since {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "N/A"}
              </div>

              <Button onClick={() => setIsEditing(true)} variant="primary" fullWidth>
                Edit Profile
              </Button>
            </div>
          )}
        </Card>

        {/* Danger Zone - Account Deletion */}
        <Card className="mt-6 shadow-lg border-red-200 bg-red-50">
          <div className="flex items-center gap-3 mb-4">
            <FaTrash className="text-red-500" />
            <h3 className="text-lg font-bold text-red-700">Danger Zone</h3>
          </div>
          <p className="text-sm text-red-600 mb-4">
            Once you delete your account, there is no going back. This will permanently delete your account and all associated data.
          </p>
          <Button
            variant="ghost"
            onClick={() => setShowDeleteModal(true)}
            className="border-red-300 text-red-600 hover:bg-red-100 hover:border-red-400"
          >
            Delete Account
          </Button>
        </Card>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                  <FaTrash className="text-2xl text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Delete Account?</h3>
                <p className="text-slate-500 mt-2">
                  This action cannot be undone. All your data will be permanently removed.
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
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmText("");
                  }}
                  fullWidth
                >
                  Cancel
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
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

