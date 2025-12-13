import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
import Loader from "../components/Common/Loader";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
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
      setUser(response.data);
      setFormData({ name: response.data.name, email: response.data.email });
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/me`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProfile();
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="min-h-screen w-full p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8" style={{ color: "var(--text-primary)" }}>
          Profile
        </h1>

        <Card>
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-xl"
              style={{
                background: `linear-gradient(to bottom right, var(--action-primary), var(--accent-secondary))`
              }}
            >
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block mb-2 font-semibold" style={{ color: "var(--text-primary)" }}>
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-5 py-3 rounded-xl border-2 font-medium focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--accent-secondary)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold" style={{ color: "var(--text-primary)" }}>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-5 py-3 rounded-xl border-2 font-medium focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--accent-secondary)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" loading={saving} disabled={saving} fullWidth>
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({ name: user.name, email: user.email });
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
                  {user?.name || "User Name"}
                </div>
                <div className="text-lg" style={{ color: "var(--text-secondary)" }}>
                  {user?.email || "email@example.com"}
                </div>
              </div>

              <div className="text-center text-sm" style={{ color: "var(--text-secondary)" }}>
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
              </div>

              <Button onClick={() => setIsEditing(true)} variant="primary" fullWidth>
                Edit Profile
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Profile;
