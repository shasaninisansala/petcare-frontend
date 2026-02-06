import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Trash2, PawPrint, ArrowRight } from 'lucide-react';
import { Link } from "react-router-dom";

export default function AdoptionListings() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPet, setSelectedPet] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // New State for handling the Shelter ID entry
  const [shelterIdInput, setShelterIdInput] = useState('');
  const [activeShelterId, setActiveShelterId] = useState(null);

  // Fetch data from Backend using the specific ID
  const fetchPets = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8081/adoption-app/adoptions/shelter/${id}`);
      const data = await response.json();
      setPets(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching pets:", error);
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (shelterIdInput.trim()) {
      setActiveShelterId(shelterIdInput);
      fetchPets(shelterIdInput);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await fetch(`http://localhost:8081/adoption-app/adoptions/${id}`, {
          method: 'DELETE',
        });
        setPets(pets.filter(pet => pet.adoption_id !== id));
      } catch (error) {
        alert("Failed to delete");
      }
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-700';
      case 'Pending': return 'bg-orange-100 text-orange-700';
      case 'In Treatment': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // --- RENDER LOGIN VIEW ---
  if (!activeShelterId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <PawPrint className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Shelter Portal</h1>
            <p className="text-gray-500 text-center mt-2">Please enter your Shelter ID to manage your pet listings</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shelter Identification Number</label>
              <input
                type="number"
                required
                placeholder="e.g. 101"
                value={shelterIdInput}
                onChange={(e) => setShelterIdInput(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              Access Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- RENDER MAIN DASHBOARD ---
  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="p-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Manage Adoption Listings</h2>
            <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">SHELTER #{activeShelterId}</span>
                <button onClick={() => setActiveShelterId(null)} className="text-sm text-blue-600 hover:underline">Change Shelter</button>
            </div>
          </div>
          <Link to="/shelter/adoption-listings/add">
            <button className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium">
                <Plus className="w-5 h-5" />
                Add New Adoption
            </button>
          </Link>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID, Name, Breed..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Pet</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Adoption ID</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Species & Breed</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Age</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-10">Loading pets...</td></tr>
              ) : (
                pets
                  .filter(p => 
                    p.pet_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    p.adoption_id?.toString().includes(searchQuery) ||
                    p.breed?.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((pet) => (
                    <tr key={pet.adoption_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={pet.image_path ? `http://localhost:8081/adoption-app${pet.image_path}` : 'https://via.placeholder.com/100'}
                            alt={pet.pet_name}
                            className="w-12 h-12 rounded-full object-cover border border-gray-200"
                          />
                          <span className="font-medium text-gray-900">{pet.pet_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-mono">#{pet.adoption_id}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {pet.species} • {pet.breed}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{pet.age} years</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle('Available')}`}>
                          Available
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedPet(pet)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(pet.adoption_id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
          {!loading && pets.length === 0 && (
            <div className="p-10 text-center text-gray-500">No pets found for Shelter #{activeShelterId}.</div>
          )}
        </div>

        {/* View Pet Modal */}
        {selectedPet && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
              <div className="h-48 bg-gray-200 relative">
                 <img 
                    src={selectedPet.image_path ? `http://localhost:8081/adoption-app${selectedPet.image_path}` : 'https://via.placeholder.com/400'} 
                    alt={selectedPet.pet_name} 
                    className="w-full h-full object-cover"
                 />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedPet.pet_name}</h2>
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                    <p><span className="text-gray-500">Adoption ID:</span> <span className="font-semibold">#{selectedPet.adoption_id}</span></p>
                    <p><span className="text-gray-500">Species:</span> <span className="font-semibold">{selectedPet.species}</span></p>
                    <p><span className="text-gray-500">Breed:</span> <span className="font-semibold">{selectedPet.breed}</span></p>
                    <p><span className="text-gray-500">Age:</span> <span className="font-semibold">{selectedPet.age} Years</span></p>
                    <p><span className="text-gray-500">Vaccinated:</span> <span className="font-semibold">{selectedPet.vaccinated ? 'Yes' : 'No'}</span></p>
                    <p><span className="text-gray-500">Kid Friendly:</span> <span className="font-semibold">{selectedPet.kid_friendly ? 'Yes' : 'No'}</span></p>
                </div>
                <div className="mt-4 border-t pt-4">
                    <p className="text-sm font-semibold text-gray-700">Medical Notes:</p>
                    <p className="text-sm text-gray-600 italic">{selectedPet.medical_notes || 'None'}</p>
                </div>
                <button
                  onClick={() => setSelectedPet(null)}
                  className="mt-6 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 w-full font-medium transition-colors"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}