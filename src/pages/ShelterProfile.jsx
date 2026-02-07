import React, { useState, useEffect } from "react";
import { Upload, MapPin } from "lucide-react";
import axios from "axios";

export default function ShelterProfile() {
  const [formData, setFormData] = useState({
    shelterName: "",
    contactPhone: "",
    email: "",
    licenseNo: "",
    description: "",
    streetAddress: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: ""
  });

  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  console.log("PROFILE COMPONENT LOADED");


  // Fetch shelter info on mount
useEffect(() => {
  const email = localStorage.getItem("email");
console.log("EMAIL FROM STORAGE:", email);


  axios
    .get(`http://localhost:8085/api/shelter/profile/email/${email}`)
    .then(res => {
      console.log("API RESPONSE:", res.data);

      const d = res.data;

      setFormData({
  shelterName: d.shelterName || "",
  contactPhone: d.phone || "",
  email: d.email || "",
  licenseNo: d.licenseNumber || "",
  description: d.description || "",

  streetAddress: d.streetAddress || "",
  addressLine2: d.addressLine2 || "",
  city: d.city || "",
  state: d.state || "",
  zipCode: d.zipCode || "",
  country: d.country || ""
});
if (d.profileImage) {
  setLogoPreview(`data:image/jpeg;base64,${d.profileImage}`);
}


      console.log("STATE SET");
    })
    .catch(err => {
      console.error("API ERROR:", err);
    });
}, []);






  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

const handleSubmit = async () => {
  try {
    const email = localStorage.getItem("email");

    const form = new FormData();

    form.append("streetAddress", formData.streetAddress);
    form.append("addressLine2", formData.addressLine2);
    form.append("city", formData.city);
    form.append("state", formData.state);
    form.append("zipCode", formData.zipCode);
    form.append("country", formData.country);

    if (logo) {
      form.append("profileImage", logo);   // ✅ REAL FILE
    }

    await axios.put(
      `http://localhost:8085/api/shelter/profile/update/email/${email}`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    alert("Profile updated successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to update profile");
  }
};




 


  return (
    <div className="flex-1 bg-gray-50">
      <div className="p-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Shelter Profile Settings</h2>
            <p className="text-gray-600">Manage your shelter's public-facing information and verification</p>
          </div>
        </div>

        {/* Shelter Logo */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Shelter Logo</h3>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="w-full h-full object-cover rounded-full" />
              ) : (
                <span className="text-4xl">🦊</span>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-3">
                Recommended: 400x400px PNG or JPG. This will be visible on all animal listings.
              </p>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Add Photo
                  <input type="file" className="hidden" onChange={handleLogoChange} />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Shelter Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
              <span className="text-green-600 text-sm">≡</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Shelter Information</h3>
          </div>

          {/* Readonly Shelter Info */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shelter Name</label>
              <input
                type="text"
                value={formData.shelterName}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
              <input
                type="text"
                value={formData.contactPhone}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={formData.email}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">License No.</label>
              <input
                type="text"
                value={formData.licenseNo}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shelter Description</label>
            <textarea
              value={formData.description}
              readOnly
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed resize-none"
            />
          </div>
        </div>

        {/* Physical Address */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-bold text-gray-900">Physical Address</h3>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
              <input
                type="text"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
              <input
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Zip/Postal Code</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            onClick={() => window.location.reload()}
          >
            Discard Changes
          </button>
          <button
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            onClick={handleSubmit}
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}
