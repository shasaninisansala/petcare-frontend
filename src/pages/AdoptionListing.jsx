import React, { useState } from 'react';
import { Search, Plus, Edit, Eye, Heart } from 'lucide-react';
import { Link } from "react-router-dom";

export default function AdoptionListings() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPet, setSelectedPet] = useState(null);
  const [editingPetId, setEditingPetId] = useState(null); // track which pet is being edited
  const [pets, setPets] = useState([
    {
      id: 1,
      name: 'Bella',
      petId: '#GP-8271',
      image: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=100&h=100&fit=crop',
      species: 'Dog',
      breed: 'Golden Retriever',
      age: '2 years',
      status: 'Available',
      statusColor: 'bg-green-100 text-green-700',
      favorite: false
    },
    {
      id: 2,
      name: 'Cooper',
      petId: '#BG-9102',
      image: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=100&h=100&fit=crop',
      species: 'Dog',
      breed: 'Beagle',
      age: '1 year',
      status: 'Pending',
      statusColor: 'bg-orange-100 text-orange-700',
      favorite: false
    }
  ]);

  // Toggle favorite
  const toggleFavorite = (id) => {
    setPets(prev =>
      prev.map(pet =>
        pet.id === id ? { ...pet, favorite: !pet.favorite } : pet
      )
    );
  };

  // Handle status change
  const handleStatusChange = (id, newStatus) => {
    let colorClass = '';
    if (newStatus === 'Available') colorClass = 'bg-green-100 text-green-700';
    else if (newStatus === 'Pending') colorClass = 'bg-orange-100 text-orange-700';
    else if (newStatus === 'In Treatment') colorClass = 'bg-blue-100 text-blue-700';
    setPets(prev =>
      prev.map(pet =>
        pet.id === id ? { ...pet, status: newStatus, statusColor: colorClass } : pet
      )
    );
    setEditingPetId(null); // close edit mode
  };

  return (
    <div className="flex-1 bg-gray-50">
      <div className="p-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Manage Adoption Listings</h2>
            <p className="text-gray-600">Overview and management of all current animal residents.</p>
          </div>
          <Link to="/shelter/adoption-listings/add">
            <button className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium">
                <Plus className="w-5 h-5" />
                Add New Adoption
            </button>
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="search by ID, Breed, Age"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Pet</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">ID</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Species & Breed</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Age</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pets
                .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             p.petId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             p.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             p.age.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((pet) => (
                <tr key={pet.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={pet.image}
                        alt={pet.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <span className="font-medium text-gray-900">{pet.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{pet.petId}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {pet.species} • {pet.breed}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{pet.age}</td>
                  <td className="px-6 py-4">
                    {editingPetId === pet.id ? (
                      <select
                        value={pet.status}
                        onChange={(e) => handleStatusChange(pet.id, e.target.value)}
                        className="px-3 py-1 rounded-full text-sm font-medium border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option>Available</option>
                        <option>Pending</option>
                        <option>In Treatment</option>
                      </select>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${pet.statusColor}`}>
                        {pet.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {/* Edit: enable inline status editing */}
                      <button
                        onClick={() => setEditingPetId(pet.id)}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>

                      {/* View */}
                      <button
                        onClick={() => setSelectedPet(pet)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>

                      {/* Favorite */}
                      <button
                        onClick={() => toggleFavorite(pet.id)}
                        className={`p-2 rounded-lg transition-colors ${pet.favorite ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:text-red-600 hover:bg-red-50'}`}
                      >
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* View Pet Modal */}
        {selectedPet && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-96">
              <h2 className="text-xl font-bold mb-4">{selectedPet.name}'s Details</h2>
              <img src={selectedPet.image} alt={selectedPet.name} className="w-32 h-32 rounded-full mb-4 object-cover mx-auto"/>
              <p><span className="font-medium">ID:</span> {selectedPet.petId}</p>
              <p><span className="font-medium">Species:</span> {selectedPet.species}</p>
              <p><span className="font-medium">Breed:</span> {selectedPet.breed}</p>
              <p><span className="font-medium">Age:</span> {selectedPet.age}</p>
              <p><span className="font-medium">Status:</span> {selectedPet.status}</p>
              <button
                onClick={() => setSelectedPet(null)}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 w-full"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
