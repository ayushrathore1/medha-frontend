import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const blankUser = {
  name: "",
  email: "",
  avatar: "",
  college: "",
  year: "",
  branch: "",
};

const Profile = () => {
  const [user, setUser] = useState(blankUser);
  const [editing, setEditing] = useState(false);
  const [fields, setFields] = useState(blankUser);
  const [saveStatus, setSaveStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setErrMsg("");
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (!res.ok) {
          setErrMsg(data.message || "Failed to fetch user profile.");
          setLoading(false);
          return;
        }
        setUser(data);
        setFields(data);
        setLoading(false);
      } catch (err) {
        setErrMsg("Server error.");
        setLoading(false);
      }
    }
    if (token) fetchProfile();
  }, [token]);

  const handleEdit = (e) => {
    e.preventDefault();
    setFields(user);
    setEditing(true);
    setSaveStatus("");
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setEditing(false);
    setFields(user);
    setSaveStatus("");
    setErrMsg("");
  };

  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrMsg("");
    setSaveStatus("");
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/me`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(fields),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setErrMsg(data.message || "Update failed.");
        setLoading(false);
        return;
      }
      setUser(data.user || fields);
      setEditing(false);
      setSaveStatus("Profile updated!");
      setTimeout(() => setSaveStatus(""), 2000);
      setLoading(false);
    } catch (err) {
      setErrMsg("Server error.");
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] font-inter">
        <div className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-blue-300 bg-clip-text text-transparent animate-pulse">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-10 flex flex-col items-center bg-[#0a0a0a] font-inter relative overflow-hidden">
      {/* background ambient blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-0 w-96 h-60 bg-gradient-to-tr from-violet-400/20 to-blue-400/18 rounded-full blur-2xl opacity-25 animate-blob"></div>
        <div className="absolute bottom-0 right-1/3 w-72 h-44 bg-gradient-to-r from-blue-400/16 to-purple-400/19 rounded-full blur-2xl opacity-25 animate-blob animation-delay-2000"></div>
        <style>{`
          @keyframes blob { 0% {transform: scale(1) translate(0,0);} 33% {transform: scale(1.07) translate(19px,-20px);} 66% {transform: scale(0.96) translate(-16px,11px);} 100% {transform: scale(1) translate(0,0);} }
          .animate-blob { animation: blob 12s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
        `}</style>
      </div>
      <div className="bg-[#18163a]/90 p-10 rounded-3xl shadow-2xl border border-violet-400/15 max-w-xl w-full flex flex-col items-center mt-10 backdrop-blur-xl z-10">
        <div className="mb-7 flex flex-col items-center">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-violet-500/35 via-blue-600/20 to-purple-400/15 flex items-center justify-center text-5xl font-bold text-white shadow-lg mb-2 overflow-hidden ring-4 ring-violet-400/20">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              user.name?.charAt(0) || "U"
            )}
          </div>
          <div className="text-2xl bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent font-bold">
            {user.name}
          </div>
          <div className="text-blue-200 text-sm">{user.email}</div>
        </div>
        {/* Form only for Save/Cancel, Edit button is OUTSIDE */}
        <form
          onSubmit={handleSave}
          className="w-full flex flex-col gap-4 items-center"
        >
          <div className="w-full flex flex-col gap-1">
            <label className="font-semibold text-violet-300">Full Name</label>
            <input
              className="bg-[#18163a]/70 border border-violet-400/20 rounded-xl px-4 py-3 text-white placeholder-violet-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-400 focus:outline-none transition-all font-medium"
              type="text"
              name="name"
              value={fields.name || ""}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <label className="font-semibold text-blue-300">Email</label>
            <input
              className="bg-[#18163a]/70 border border-violet-400/20 rounded-xl px-4 py-3 text-blue-200 font-medium focus:ring-violet-400"
              type="email"
              name="email"
              value={fields.email || ""}
              disabled
              readOnly
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <label className="font-semibold text-blue-300">College</label>
            <input
              className="bg-[#18163a]/70 border border-violet-400/20 rounded-xl px-4 py-3 text-white placeholder-violet-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-400 focus:outline-none transition-all font-medium"
              type="text"
              name="college"
              value={fields.college || ""}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <label className="font-semibold text-blue-300">Year</label>
            <input
              className="bg-[#18163a]/70 border border-violet-400/20 rounded-xl px-4 py-3 text-white placeholder-violet-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-400 focus:outline-none transition-all font-medium"
              type="text"
              name="year"
              value={fields.year || ""}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <label className="font-semibold text-blue-300">Branch</label>
            <input
              className="bg-[#18163a]/70 border border-violet-400/20 rounded-xl px-4 py-3 text-white placeholder-violet-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-400 focus:outline-none transition-all font-medium"
              type="text"
              name="branch"
              value={fields.branch || ""}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
          {editing && (
            <div className="flex w-full justify-end gap-5 mt-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold py-2.5 px-8 rounded-xl shadow-xl hover:scale-[1.04] transition-all focus:outline-none focus:ring-2 focus:ring-violet-400"
              >
                Save
              </button>
              <button
                type="button"
                className="bg-gradient-to-r from-violet-400/15 to-blue-400/10 text-violet-200 border border-violet-400/20 rounded-xl px-6 py-2.5 font-bold hover:bg-violet-400/20 transition shadow focus:outline-none"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          )}
          {errMsg && (
            <div className="text-red-400 mt-2 font-bold animate-pulse">
              {errMsg}
            </div>
          )}
          {saveStatus && (
            <div className="text-emerald-400 mt-2 font-bold animate-pulse">
              {saveStatus}
            </div>
          )}
        </form>
        {/* Edit button OUTSIDE form */}
        {!editing && (
          <button
            type="button"
            className="bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold py-2.5 px-10 rounded-xl shadow-xl hover:scale-[1.05] transition-all mt-7 focus:outline-none focus:ring-2 focus:ring-violet-400"
            onClick={handleEdit}
          >
            Edit Profile
          </button>
        )}
        <button
          className="bg-gradient-to-r from-red-600 to-pink-500 text-white font-bold py-2.5 px-7 rounded-xl shadow-lg hover:scale-[1.05] transition-all mt-8 focus:outline-none focus:ring-2 focus:ring-red-400"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
