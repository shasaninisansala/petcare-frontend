import React, { useState } from 'react';
import { Search, Plus, Eye, Trash2 } from 'lucide-react';
import { Link } from "react-router-dom";

export default function AdoptionListings() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPet, setSelectedPet] = useState(null);
  const [pets, setPets] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [shelterIdInput, setShelterIdInput] = useState('');
  const [activeShelterId, setActiveShelterId] = useState('');

  /**
   * ROBUST IMAGE URL GENERATOR
   */
  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/400?text=No+Image';
    const baseUrl = 'http://localhost:8083/adoption-app';
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  };

  const fetchPets = async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      // Fetching from your Spring Boot API
      const response = await fetch(`http://localhost:8083/adoption-app/adoptions/shelter/${id}`);
      
      if (!response.ok) throw new Error('Failed to fetch data');

      const data = await response.json();
      // Handle both array response and single object response
      setPets(Array.isArray(data) ? data : data ? [data] : []);
      setActiveShelterId(id);
    } catch (error) {
      console.error("Error fetching pets:", error);
      setPets([]); 
      alert("Could not find any listings for this License Number.");
    } finally {
      setLoading(false);
    }
  };

  const handleIdSubmit = (e) => {
    e.preventDefault();
    // Removed REG-001 Regex validation. Now it accepts any license string.
    if (shelterIdInput.trim()) {
      fetchPets(shelterIdInput);
    } else {
      alert("Please enter a License Number");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        const response = await fetch(`http://localhost:8083/adoption-app/adoptions/${id}`, {
          method: 'DELETE',
        });
        if(response.ok) {
          setPets(pets.filter(pet => (pet.adoption_id || pet.adoptionId) !== id));
        }
      } catch (error) {
        alert("Failed to delete");
      }
    }
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen font-sans">
      <div className="p-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Manage Adoption Listings</h2>
            <p className="text-gray-500 text-sm">
              {activeShelterId ? `Active License: ${activeShelterId}` : "Enter License Number to manage listings"}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <form onSubmit={handleIdSubmit} className="flex items-center shadow-sm">
              <input
                type="text"
                placeholder="License Number"
                value={shelterIdInput}
                onChange={(e) => setShelterIdInput(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:outline-none w-48 text-sm"
                required
              />
              <button type="submit" className="bg-green-600 text-white px-5 py-2.5 rounded-r-lg hover:bg-green-700 transition-colors text-sm font-semibold border border-green-600">
                Load
              </button>
            </form>

            <Link to="/shelter/adoption-listings/add">
              <button className="flex items-center gap-2 px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium shadow-sm">
                  <Plus className="w-5 h-5" /> Add New Adoption
              </button>
            </Link>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Pet</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Adoption ID</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Species & Breed</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Age</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">Loading listings...</td>
                </tr>
              ) : (
                pets.map((pet) => {
                  const name = pet.pet_name || pet.petName;
                  const id = pet.adoption_id || pet.adoptionId;
                  const imgPath = pet.image_path || pet.imagePath;

                  return (
                    <tr key={id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={getImageUrl(imgPath)}
                            alt={name}
                            className="w-12 h-12 rounded-full object-cover border border-gray-200"
                            onError={(e) => { 
                              e.target.src = 'https://via.placeholder.com/100?text=Pet'; 
                            }}
                          />
                          <span className="font-medium text-gray-900">{name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-mono">#{id}</td>
                      <td className="px-6 py-4 text-gray-600">{pet.species} • {pet.breed}</td>
                      <td className="px-6 py-4 text-gray-600">{pet.age} years</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setSelectedPet(pet)} className="p-2 text-gray-600 hover:text-blue-600 rounded-lg" title="View Details">
                            <Eye className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleDelete(id)} className="p-2 text-gray-600 hover:text-red-600 rounded-lg" title="Delete Listing">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
          {!loading && activeShelterId !== '' && pets.length === 0 && (
            <div className="p-10 text-center text-gray-500">No pets found for license: {activeShelterId}</div>
          )}
          {!loading && activeShelterId === '' && (
            <div className="p-10 text-center text-gray-400 italic">Please enter a License Number above to load your pets.</div>
          )}
        </div>

        {/* Details Modal */}
        {selectedPet && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
              <div className="h-64 bg-gray-200">
                 <img 
                    src={getImageUrl(selectedPet.image_path || selectedPet.imagePath)} 
                    className="w-full h-full object-cover" 
                    alt="pet"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=Error'; }}
                 />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedPet.pet_name || selectedPet.petName}</h2>
                <p className="text-gray-600 mb-4">{selectedPet.breed} • {selectedPet.species}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-gray-500 block">Vaccinated</span>
                    <span className="font-semibold">{selectedPet.vaccinated ? "Yes" : "No"}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-gray-500 block">Kid Friendly</span>
                    <span className="font-semibold">{selectedPet.kid_friendly || selectedPet.kidFriendly ? "Yes" : "No"}</span>
                  </div>
                </div>

                <button onClick={() => setSelectedPet(null)} className="w-full py-2.5 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors">
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