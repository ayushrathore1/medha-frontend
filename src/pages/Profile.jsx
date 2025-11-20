import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
import Loader from "../components/Common/Loader";

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
      } catch {
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
    } catch {
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
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 flex flex-col items-center">
      <Card className="max-w-xl w-full mt-10">
        <div className="flex flex-col items-center mb-7">
          <div 
            className="w-28 h-28 rounded-full flex items-center justify-center text-5xl font-bold text-white shadow-lg mb-4 overflow-hidden ring-4"
            style={{ 
              background: `linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))`,
              ringColor: "var(--accent-secondary)"
            }}
          >
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
          <div className="text-2xl font-bold" style={{ color: "var(--action-primary)" }}>
            {user.name}
          </div>
          <div className="text-sm" style={{ color: "var(--text-secondary)" }}>{user.email}</div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSave}
          className="w-full flex flex-col gap-4"
        >
          <div className="w-full flex flex-col gap-1">
            <label className="font-semibold" style={{ color: "var(--text-primary)" }}>Full Name</label>
            <input
              className="px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition font-medium"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--accent-secondary)",
                color: "var(--text-primary)",
              }}
              type="text"
              name="name"
              value={fields.name || ""}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <label className="font-semibold" style={{ color: "var(--text-primary)" }}>Email</label>
            <input
              className="px-4 py-3 rounded-xl border-2 font-medium"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--accent-secondary)",
                color: "var(--text-secondary)",
              }}
              type="email"
              name="email"
              value={fields.email || ""}
              disabled
              readOnly
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <label className="font-semibold" style={{ color: "var(--text-primary)" }}>College</label>
            <input
              className="px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition font-medium"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--accent-secondary)",
                color: "var(--text-primary)",
              }}
              type="text"
              name="college"
              value={fields.college || ""}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <label className="font-semibold" style={{ color: "var(--text-primary)" }}>Year</label>
            <input
              className="px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition font-medium"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--accent-secondary)",
                color: "var(--text-primary)",
              }}
              type="text"
              name="year"
              value={fields.year || ""}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <label className="font-semibold" style={{ color: "var(--text-primary)" }}>Branch</label>
            <input
              className="px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition font-medium"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--accent-secondary)",
                color: "var(--text-primary)",
              }}
              type="text"
              name="branch"
              value={fields.branch || ""}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
          
          {editing && (
            <div className="flex w-full justify-end gap-4 mt-4">
              <Button
                type="submit"
                disabled={loading}
              >
                Save
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          )}
          
          {errMsg && (
            <div className="p-3 rounded-xl border-2" style={{ 
              backgroundColor: "#fef2f2", 
              borderColor: "#fca5a5",
              color: "#dc2626" 
            }}>
              <p className="font-bold">{errMsg}</p>
            </div>
          )}
          {saveStatus && (
            <div className="p-3 rounded-xl border-2" style={{ 
              backgroundColor: "#f0fdf4", 
              borderColor: "#86efac",
              color: "#16a34a" 
            }}>
              <p className="font-bold">{saveStatus}</p>
            </div>
          )}
        </form>

        {/* Buttons outside form */}
        {!editing && (
          <Button
            type="button"
            onClick={handleEdit}
            className="mt-6 w-full"
          >
            Edit Profile
          </Button>
        )}
        <Button
          variant="danger"
          onClick={handleLogout}
          className="mt-4 w-full"
        >
          Logout
        </Button>
      </Card>
    </div>
  );
};

export default Profile;
