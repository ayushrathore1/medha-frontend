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
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
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
        console.error(err);
        setErrMsg("Server error.");
        setLoading(false);
      }
    }
    if (token) fetchProfile();
  }, [token]);

  const handleEdit = (e) => {
    e.preventDefault(); // Prevent form submit if inside form!
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
        "https://medha-backend.onrender.com/api/users/me",
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
      console.error(err);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-blue-700 text-xl font-semibold">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-12 flex flex-col items-center bg-blue-50">
      <div className="bg-white/90 p-8 rounded-2xl shadow-xl border border-blue-100 max-w-xl w-full flex flex-col items-center mt-8">
        <div className="mb-6 flex flex-col items-center">
          <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center text-5xl text-blue-700 font-bold mb-2 overflow-hidden">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              user.name?.charAt(0)
            )}
          </div>
          <div className="text-xl text-blue-700 font-semibold">{user.name}</div>
          <div className="text-blue-900 text-sm">{user.email}</div>
        </div>

        {/* Form only for Save/Cancel, Edit button is OUTSIDE */}
        <form
          onSubmit={handleSave}
          className="w-full flex flex-col gap-3 items-center"
        >
          <div className="w-full flex flex-col gap-1">
            <label className="font-medium text-blue-900">Full Name</label>
            <input
              className="border border-blue-300 rounded-lg px-3 py-2 text-blue-900 bg-white"
              type="text"
              name="name"
              value={fields.name || ""}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <label className="font-medium text-blue-900">Email</label>
            <input
              className="border border-blue-300 rounded-lg px-3 py-2 text-blue-900 bg-white"
              type="email"
              name="email"
              value={fields.email || ""}
              disabled
              readOnly
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <label className="font-medium text-blue-900">College</label>
            <input
              className="border border-blue-300 rounded-lg px-3 py-2 text-blue-900 bg-white"
              type="text"
              name="college"
              value={fields.college || ""}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <label className="font-medium text-blue-900">Year</label>
            <input
              className="border border-blue-300 rounded-lg px-3 py-2 text-blue-900 bg-white"
              type="text"
              name="year"
              value={fields.year || ""}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <label className="font-medium text-blue-900">Branch</label>
            <input
              className="border border-blue-300 rounded-lg px-3 py-2 text-blue-900 bg-white"
              type="text"
              name="branch"
              value={fields.branch || ""}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
          {editing && (
            <div className="flex w-full justify-end gap-3 mt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition"
              >
                Save
              </button>
              <button
                type="button"
                className="bg-blue-100 border border-blue-300 text-blue-700 font-semibold py-2 px-4 rounded-lg hover:bg-blue-200 transition"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          )}
          {errMsg && <div className="text-red-600 mt-2">{errMsg}</div>}
          {saveStatus && (
            <div className="text-green-600 mt-2">{saveStatus}</div>
          )}
        </form>
        {/* Edit button OUTSIDE the form, so it never submits */}
        {!editing && (
          <button
            type="button"
            className="bg-blue-600 text-white font-semibold py-2 px-8 rounded-lg hover:bg-blue-700 transition mt-5"
            onClick={handleEdit}
          >
            Edit Profile
          </button>
        )}
        <button
          className="bg-red-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-600 mt-6"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
