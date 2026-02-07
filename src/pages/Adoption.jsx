import React, { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/CTAAndFooter';

export default function AdoptionPage() {
  const navigate = useNavigate();
  const [selectedSpecies, setSelectedSpecies] = useState('Dog');
  const [selectedAgeRange, setSelectedAgeRange] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch pets
  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8081/adoption-app/adoptions');
        setPets(response.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch pets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  const toggleAgeRange = (age) => {
    setSelectedAgeRange(prev =>
      prev.includes(age) ? prev.filter(a => a !== age) : [...prev, age]
    );
  };

  const ageToRange = (age) => {
    if (age <= 1) return 'Puppy';
    if (age <= 3) return 'Young';
    if (age <= 8) return 'Adult';
    return 'Senior';
  };

  const filteredPets = pets.filter(pet => {
    const matchesSpecies = pet.species === selectedSpecies;
    const matchesAge =
      selectedAgeRange.length === 0 || selectedAgeRange.includes(ageToRange(pet.age));
    const matchesSearch = pet.pet_name.toLowerCase().includes(searchText.toLowerCase());
    return matchesSpecies && matchesAge && matchesSearch;
  });

  // Navigate to form page with petName in state
  const handleCardClick = (pet) => {
  navigate('/adoption-form', { 
    state: { 
      petName: pet.pet_name,
      adoptionId: pet.adoption_id, // Pass the real ID from the DB
      shelterId: pet.shelterId      // Pass the real shelter ID
    } 
  });
};

  return (
    <>
      <Navbar />

      <div className="pt-20 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <div className="w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
                <h3 className="font-semibold text-gray-800 mb-4">Filters</h3>
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-green-600">🐾</span>
                    <span className="font-medium text-gray-700">Species</span>
                  </div>
                  <div className="space-y-2">
                    {['Dog', 'Cat', 'Rabbit'].map(species => (
                      <button
                        key={species}
                        onClick={() => setSelectedSpecies(species)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          selectedSpecies === species
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {species}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-green-600">○</span>
                    <span className="font-medium text-gray-700">Age Range</span>
                  </div>
                  <div className="space-y-2">
                    {['Puppy', 'Young', 'Adult', 'Senior'].map(age => (
                      <label key={age} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedAgeRange.includes(age)}
                          onChange={() => toggleAgeRange(age)}
                          className="w-4 h-4 rounded border-gray-300 text-green-500 focus:ring-green-500"
                        />
                        <span className="text-gray-700">{age}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Pet Grid */}
            <div className="flex-1">
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {loading ? 'Loading pets...' : `${filteredPets.length} Best Friends Found`}
                </h2>
                {error && <p className="text-red-500 mt-2">{error}</p>}
                {!loading && filteredPets.length === 0 && !error && (
                  <p className="text-gray-500 mt-2">No pets match your filters.</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {loading && !error && <p>Loading pets...</p>}
                {!loading && filteredPets.map(pet => (
                  <div
                    key={pet.adoption_id}
  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
  onClick={() => handleCardClick(pet)}
                  >
                    <div className="relative h-48 bg-gray-200">
                      <img
                        src={pet.image_path || '/placeholder.png'}
                        alt={pet.pet_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{pet.pet_name}</h3>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                          {pet.gender || 'Unknown'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {pet.breed} • {ageToRange(pet.age)}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="w-3 h-3" />
                        <span>{pet.shelterId || 'Unknown Shelter'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
