import React, { useState } from 'react';
import { Upload, Eye } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";

export default function AddPetForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    petName: '',
    breed: '',
    species: 'Dog',
    age: '',
    size: 'Small',
    vaccinated: false,
    kidFriendly: false,
    medicalNotes: '',
    specialNeeds: '',
    shelter_id: '' // Now controlled by the user input
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation for Shelter ID
    if (!formData.shelter_id) {
        alert("Please enter a Shelter ID");
        return;
    }

    try {
      const data = new FormData();
      
// Change this inside your handleSubmit function
const adoptionData = {
  pet_name: formData.petName, // backend uses getPet_name()
  breed: formData.breed,
  species: formData.species,
  age: parseInt(formData.age) || 0,
  size: formData.size,
  vaccinated: formData.vaccinated,
  kid_friendly: formData.kidFriendly, // backend uses isKid_friendly()
  medical_notes: formData.medicalNotes, // backend uses getMedical_notes()
  special_needs: formData.specialNeeds, // backend uses getSpecial_needs()
  shelterId: parseInt(formData.shelter_id) // ensure this matches your Entity's @Column
};
      data.append('adoption', JSON.stringify(adoptionData));
      
      if (imageFile) {
        data.append('image', imageFile);
      }

      const response = await fetch('http://localhost:8081/adoption-app/adoptions', {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        alert("Pet adoption listing created successfully!");
        navigate('/shelter/adoption-listings');
      } else {
        alert("Failed to save to database. Check if the Shelter ID exists.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error. Please check your backend.");
    }
  };

  return (
    <div className="flex-1 bg-gray-50">
      <div className="p-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
            <Link to="/shelter/dashboard" className="hover:text-green-600 transition">
                Dashboard
            </Link>
            <span>/</span>

            <Link to="/shelter/adoption-listings" className="hover:text-green-600 transition">
                Adoption Listings
            </Link>
            <span>/</span>

            <span className="text-gray-900 font-medium">
                Add New Pet
            </span>
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">List a Pet for Adoption</h2>
            <p className="text-gray-600">Showcase a new companion to potential loving families.</p>
          </div>
          <Link to='/shelter/adoption-listings'>
            <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium">
                Publish Listing
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border-2 border-dashed border-blue-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Basic Information</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pet Name</label>
                  <input
                    type="text"
                    name="petName"
                    value={formData.petName}
                    onChange={handleInputChange}
                    placeholder="e.g. Luna"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Breed</label>
                  <input
                    type="text"
                    name="breed"
                    value={formData.breed}
                    onChange={handleInputChange}
                    placeholder="e.g. Golden Retriever"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Added Shelter ID Field */}
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shelter ID</label>
                  <input
                    type="number"
                    name="shelter_id"
                    value={formData.shelter_id}
                    onChange={handleInputChange}
                    placeholder="ID"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Species</label>
                  <select
                    name="species"
                    value={formData.species}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option>Dog</option>
                    <option>Cat</option>
                    <option>Rabbit</option>
                    <option>Bird</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Years"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                  <select
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option>Small</option>
                    <option>Medium</option>
                    <option>Large</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Health Information */}
            <div className="bg-white rounded-xl border-2 border-dashed border-blue-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Health Information</h3>
              </div>

              <div className="flex gap-6 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="vaccinated"
                    checked={formData.vaccinated}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded border-gray-300 text-green-500 focus:ring-green-500"
                  />
                  <span className="text-gray-700 font-medium">Vaccinated</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="kidFriendly"
                    checked={formData.kidFriendly}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded border-gray-300 text-green-500 focus:ring-green-500"
                  />
                  <span className="text-gray-700 font-medium">Kid Friendly</span>
                </label>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Medical Notes</label>
                <textarea
                  name="medicalNotes"
                  value={formData.medicalNotes}
                  onChange={handleInputChange}
                  placeholder="Any relevant medical history..."
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Needs</label>
                <textarea
                  name="specialNeeds"
                  value={formData.specialNeeds}
                  onChange={handleInputChange}
                  placeholder="Behavioral or physical special care requirements..."
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>
            </div>

            {/* Pet Media */}
            <div className="bg-white rounded-xl border-2 border-dashed border-blue-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Pet Media</h3>
              </div>

              <label className="block rounded-lg p-8 text-center hover:border-green-500 transition-colors cursor-pointer border-2 border-transparent">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-700 font-medium mb-1">Add Image</p>
                <p className="text-sm text-gray-500">Images/jpeg,png,jpg,gif</p>
                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
              </label>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-8">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Live Listing Preview</span>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="h-48 bg-gray-100">
                  <img
                    src={imagePreview || "https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=400&h=300&fit=crop"}
                    alt="Pet preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-3">
                    {formData.petName || "Pet"} • {formData.age || "Age"} • {formData.species} • {formData.size}
                  </p>
                  <div className="flex gap-2 mb-3">
                    {formData.vaccinated && (
                      <div className="flex-1 text-center py-2 bg-gray-50 rounded">
                        <div className="w-6 h-6 mx-auto mb-1">
                          <span className="text-green-600">✓</span>
                        </div>
                        <p className="text-xs text-gray-600">Vaccinated</p>
                      </div>
                    )}
                    {formData.kidFriendly && (
                      <div className="flex-1 text-center py-2 bg-gray-50 rounded">
                        <div className="w-6 h-6 mx-auto mb-1">
                          <span className="text-green-600">✓</span>
                        </div>
                        <p className="text-xs text-gray-600">Kid Friendly</p>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                    {formData.medicalNotes || "No description yet."}
                  </p>
                  <p className="text-xs text-green-600 mb-3 cursor-default">Read More →</p>
                  
                  {/* SUBMIT BUTTON */}
                  <button 
                    onClick={handleSubmit}
                    className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    Adopt {formData.petName || "Pet"}
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}