import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { api } from '../utils/api';

export default function MyPets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All Statuses');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserPets();
  }, []);

  const fetchUserPets = async () => {
    try {
      const result = await api.getPets();
      if (Array.isArray(result)) {
        setPets(result);
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
      toast.error('Failed to load pets');
    } finally {
      setLoading(false);
    }
  };

  const deletePet = async (petId, petName) => {
    if (!window.confirm(`Are you sure you want to delete ${petName}? This will also delete all vaccination, growth, and medical records for this pet.`)) {
      return;
    }

    try {
      const result = await api.deletePet(petId);
      if (result.message) {
        toast.success('Pet deleted successfully');
        fetchUserPets(); // Refresh the list
      } else {
        toast.error(result.error || 'Failed to delete pet');
      }
    } catch (error) {
      console.error('Error deleting pet:', error);
      toast.error('Failed to delete pet');
    }
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'Unknown age';
    
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''} old`;
    } else {
      return `${months} month${months !== 1 ? 's' : ''} old`;
    }
  };

  const getPetImage = (pet) => {
    // If pet has uploaded image (stored as URL), use it
    if (pet.imageUrl && pet.imageUrl.startsWith('/')) {
      // Make sure the URL is complete
      if (pet.imageUrl.startsWith('/petowner-app/')) {
        return `http://localhost:8080${pet.imageUrl}`;
      } else {
        return `http://localhost:8080/petowner-app${pet.imageUrl}`;
      }
    }
    
    // If it's already a full URL
    if (pet.imageUrl && (pet.imageUrl.startsWith('http://') || pet.imageUrl.startsWith('https://'))) {
      return pet.imageUrl;
    }
    
    // Otherwise use default based on species
    if (pet.species === 'dog') {
      return 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400&h=300&fit=crop';
    } else if (pet.species === 'cat') {
      return 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400&h=300&fit=crop';
    } else {
      return 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop';
    }
  };

  if (loading) {
    return (
      <div className="flex-1 bg-gray-50 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading pets...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">My Pets</h2>
            <p className="text-green-600 text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {pets.length} {pets.length === 1 ? 'Pet' : 'Pets'} Registered
            </p>
          </div>
          <Link to='/pet-owner/addpet' className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Pet
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveFilter('All Statuses')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeFilter === 'All Statuses'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Statuses
            </button>
            <button
              onClick={() => setActiveFilter('All Species')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeFilter === 'All Species'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Species
            </button>
          </div>
        </div>

        {/* Pets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {pets.map((pet) => (
            <div key={pet.petId} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Pet Image */}
              <div className="h-48 bg-gray-100 relative">
                <img
                  src={getPetImage(pet)}
                  alt={pet.petName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // If image fails to load, use default
                    if (pet.species === 'dog') {
                      e.target.src = 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400&h=300&fit=crop';
                    } else if (pet.species === 'cat') {
                      e.target.src = 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400&h=300&fit=crop';
                    } else {
                      e.target.src = 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop';
                    }
                  }}
                />
              </div>

              {/* Pet Info */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{pet.petName}</h3>
                    <p className="text-sm text-gray-600">
                      {pet.breed || 'Unknown breed'} • {calculateAge(pet.dateOfBirth)}
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700">
                    {pet.status || 'Active'}
                  </span>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  {pet.weight && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weight</span>
                      <span className="text-gray-900 font-medium">{pet.weight} kg</span>
                    </div>
                  )}
                  {pet.height && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Height</span>
                      <span className="text-gray-900 font-medium">{pet.height} cm</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    to={`/pet-owner/petdetail?petId=${pet.petId}`}
                    className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Link>
                  <button 
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    onClick={() => deletePet(pet.petId, pet.petName)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Pet Card */}
          <Link to="/pet-owner/addpet" className="block">
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 hover:border-green-500 transition-colors cursor-pointer h-full">
              <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Register New Pet</h3>
                <p className="text-sm text-gray-600">
                  Easily manage your pet's medical history and appointments.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}