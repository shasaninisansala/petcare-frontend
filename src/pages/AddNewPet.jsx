import React, { useState, useRef } from 'react';
import { Camera, CheckCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { api } from '../utils/api';

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
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        toast.error('Please select an image file (JPG, PNG, etc.)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setSelectedImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.petName || !formData.species) {
      toast.error('Please fill in Pet Name and Species');
      return;
    }

    setLoading(true);

    try {
      let imageUrl = null;
      
      // Upload image if selected
      if (selectedImage) {
        setUploadingImage(true);
        try {
          const uploadResult = await api.uploadPetImage(selectedImage);
          if (uploadResult.imageUrl) {
            imageUrl = uploadResult.imageUrl;
            toast.success('Image uploaded successfully!');
          } else {
            toast.error('Failed to upload image');
          }
        } catch (uploadError) {
          toast.error(uploadError.message || 'Failed to upload image');
          setLoading(false);
          setUploadingImage(false);
          return;
        } finally {
          setUploadingImage(false);
        }
      }

      const petData = {
        petName: formData.petName,
        species: formData.species,
        breed: formData.breed || null,
        dateOfBirth: formData.dateOfBirth || null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        healthNotes: formData.healthNotes || null,
        imageUrl: imageUrl
      };

      const result = await api.addPet(petData);
      
      if (result.message) {
        toast.success('Pet added successfully!');
        
        // Reset form
        setFormData({
          petName: '',
          species: '',
          breed: '',
          dateOfBirth: '',
          weight: '',
          height: '',
          healthNotes: ''
        });
        setSelectedImage(null);
        setImagePreview(null);
        
        // Navigate to My Pets
        setTimeout(() => {
          navigate('/pet-owner/mypets');
        }, 1000);
      } else {
        toast.error(result.error || 'Failed to add pet');
      }
    } catch (error) {
      console.error('Error adding pet:', error);
      toast.error(error.message || 'Failed to add pet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
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
                    Pet Name *
                  </label>
                  <input
                    type="text"
                    name="petName"
                    value={formData.petName}
                    onChange={handleChange}
                    placeholder="e.g. Buddy"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Species */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Species *
                  </label>
                  <select
                    name="species"
                    value={formData.species}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                    required
                    disabled={loading}
                  >
                    <option value="">Select species</option>
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="bird">Bird</option>
                    <option value="rabbit">Rabbit</option>
                    <option value="other">Other</option>
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
                    placeholder="e.g. Corgi"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                    disabled={loading}
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
                    disabled={loading}
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
                <div className="flex flex-col items-center justify-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    className="hidden"
                    disabled={loading || uploadingImage}
                  />
                  
                  {uploadingImage ? (
                    <div className="w-32 h-32 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
                      <div className="text-center">
                        <svg className="animate-spin h-8 w-8 text-green-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-xs text-gray-500 mt-2">Uploading...</p>
                      </div>
                    </div>
                  ) : imagePreview ? (
                    <div className="relative">
                      <button
                        type="button"
                        onClick={triggerFileInput}
                        disabled={loading}
                        className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg"
                      >
                        <img
                          src={imagePreview}
                          alt="Pet preview"
                          className="w-full h-full object-cover"
                        />
                      </button>
                      <button
                        type="button"
                        onClick={removeImage}
                        disabled={loading}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Click image to change
                      </p>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      disabled={loading}
                      className="w-32 h-32 bg-gray-100 rounded-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors border-2 border-dashed border-gray-300"
                    >
                      <Camera className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-xs text-gray-500">Click to upload photo</p>
                      <p className="text-xs text-gray-400 mt-1">Max 5MB</p>
                    </button>
                  )}
                </div>
              </div>

              {/* Weight and Height */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                    placeholder="0.0"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                    placeholder="0.0"
                    disabled={loading}
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
                  placeholder="Any health concerns or special needs..."
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 mt-8">
          <button 
            type="button"
            onClick={() => navigate('/pet-owner/mypets')}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            disabled={loading || uploadingImage || !formData.petName || !formData.species}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading || uploadingImage ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {uploadingImage ? 'Uploading Image...' : 'Saving...'}
              </>
            ) : (
              <>
                Save Pet Profile
                <CheckCircle className="w-5 h-5" />
              </>
            )}
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