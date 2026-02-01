import React, { useState } from 'react';
import { Camera, CheckCircle } from 'lucide-react';

export default function AddNewPet() {
  const [formData, setFormData] = useState({
    petName: '',
    species: '',
    breed: '',
    dateOfBirth: '',
    weight: '',
    height: '',
    healthNotes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex-1 bg-gray-50">
      <div className="p-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Add New Pet</h2>
          <p className="text-gray-600">Help us get to know your furry (or scaly) friend.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - General Information */}
          <div className="space-y-6">
            {/* General Information Card */}
            <div className="bg-white rounded-xl border-2 border-dashed border-blue-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">General Information</h3>
              </div>

              <div className="space-y-4">
                {/* Pet Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pet Name
                  </label>
                  <input
                    type="text"
                    name="petName"
                    value={formData.petName}
                    onChange={handleChange}
                    placeholder="e.g. Buddy"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                  />
                </div>

                {/* Species */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Species
                  </label>
                  <select
                    name="species"
                    value={formData.species}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                  >
                    <option value="">Select species</option>
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="bird">Bird</option>
                    <option value="rabbit">Rabbit</option>
                  </select>
                </div>

                {/* Breed */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Breed
                  </label>
                  <input
                    type="text"
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    placeholder="e.g.Corgi"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Vitals & Details */}
          <div className="space-y-6">
            {/* Vitals & Details Card */}
            <div className="bg-white rounded-xl border-2 border-dashed border-blue-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">📊</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Vitals & Details</h3>
              </div>

              {/* Pet Photo Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pet Photo
                </label>
                <div className="flex items-center justify-center">
                  <div className="w-32 h-32 bg-gray-100 rounded-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors border-2 border-dashed border-gray-300">
                    <Camera className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-xs text-gray-500">Click to upload photo</p>
                  </div>
                </div>
              </div>

              {/* Weight and Height */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height (cm)
                  </label>
                  <input
                    type="text"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Health Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Health Notes
                </label>
                <textarea
                  name="healthNotes"
                  value={formData.healthNotes}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 mt-8">
          <button className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium">
            Cancel
          </button>
          <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2">
            Save Pet Profile
            <CheckCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Pro Tip */}
        <div className="mt-6 bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex gap-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs">💡</span>
            </div>
            <p className="text-sm text-green-900">
              <span className="font-semibold">Pro Tip:</span> Update your pet weight and height once a week from the Growth tab & track your pet growth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
