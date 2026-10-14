import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";

import {
  User,
  Mail,
  GraduationCap,
  ShieldCheck,
  Edit3,
  Save,
  X,
} from "lucide-react";

const defaultProfile = {
  name: "EduAI User",
  email: "admin@eduai.com",
  institution: "Educational Institution",
  role: "Administrator",
};

function Profile() {
  const [profile, setProfile] = useState(defaultProfile);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(defaultProfile);

  // Load saved profile
  useEffect(() => {
    const savedProfile = localStorage.getItem("eduaiProfile");

    if (savedProfile) {
      try {
        const data = JSON.parse(savedProfile);

        setProfile({
          ...defaultProfile,
          ...data,
        });

        setFormData({
          ...defaultProfile,
          ...data,
        });
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    }
  }, []);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Save profile
  const handleSave = () => {
   localStorage.setItem("eduaiProfile", JSON.stringify(formData));

setProfile(formData);

// Tell Navbar that profile was updated
window.dispatchEvent(new Event("profileUpdated"));

setEditMode(false);
    alert("Profile updated successfully!");
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData(profile);
    setEditMode(false);
  };

  return (
    <MainLayout>
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Profile
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your EduAI profile information.
          </p>
        </div>

        {/* Profile Card */}
        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-5">

              <div className="w-20 h-20 rounded-full bg-violet-100 flex items-center justify-center">
                <User
                  size={38}
                  className="text-violet-600"
                />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {profile.name}
                </h2>

                <p className="text-gray-500 mt-1">
                  Student Performance Management
                </p>
              </div>

            </div>

            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition"
              >
                <Edit3 size={18} />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">

                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200 transition"
                >
                  <X size={18} />
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition"
                >
                  <Save size={18} />
                  Save
                </button>

              </div>
            )}

          </div>

        </section>

        {/* Personal Information */}
        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">

          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Personal Information
          </h2>

          {!editMode ? (

            <div className="grid grid-cols-2 gap-6">

              {/* Name */}
              <InfoCard
                icon={<User size={19} className="text-violet-600" />}
                label="Full Name"
                value={profile.name}
              />

              {/* Email */}
              <InfoCard
                icon={<Mail size={19} className="text-violet-600" />}
                label="Email"
                value={profile.email}
              />

              {/* Institution */}
              <InfoCard
                icon={
                  <GraduationCap
                    size={19}
                    className="text-violet-600"
                  />
                }
                label="Institution"
                value={profile.institution}
              />

              {/* Role */}
              <InfoCard
                icon={
                  <ShieldCheck
                    size={19}
                    className="text-violet-600"
                  />
                }
                label="Role"
                value={profile.role}
              />

            </div>

          ) : (

            <div className="grid grid-cols-2 gap-6">

              {/* Name */}
              <InputField
                icon={<User size={19} className="text-violet-600" />}
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />

              {/* Email */}
              <InputField
                icon={<Mail size={19} className="text-violet-600" />}
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />

              {/* Institution */}
              <InputField
                icon={
                  <GraduationCap
                    size={19}
                    className="text-violet-600"
                  />
                }
                label="Institution"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
              />

              {/* Role */}
              <InputField
                icon={
                  <ShieldCheck
                    size={19}
                    className="text-violet-600"
                  />
                }
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              />

            </div>

          )}

        </section>

        {/* Account Status */}
        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">

          <h2 className="text-xl font-semibold text-gray-800">
            Account Status
          </h2>

          <div className="mt-5 flex items-center gap-3">

            <div className="w-3 h-3 rounded-full bg-green-500"></div>

            <p className="text-gray-600">
              Account is active
            </p>

          </div>

        </section>

      </div>
    </MainLayout>
  );
}

/* Information Card */
function InfoCard({ icon, label, value }) {
  return (
    <div className="p-5 rounded-2xl bg-gray-50">

      <div className="flex items-center gap-3">

        <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
          {icon}
        </div>

        <div>
          <p className="text-xs text-gray-400">
            {label}
          </p>

          <p className="font-semibold text-gray-800 mt-1">
            {value}
          </p>
        </div>

      </div>

    </div>
  );
}

/* Input Field */
function InputField({
  icon,
  label,
  name,
  type = "text",
  value,
  onChange,
}) {
  return (
    <div className="p-5 rounded-2xl bg-gray-50">

      <div className="flex items-center gap-3 mb-3">

        <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
          {icon}
        </div>

        <p className="text-sm font-semibold text-gray-700">
          {label}
        </p>

      </div>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400"
      />

    </div>
  );
}

export default Profile;
