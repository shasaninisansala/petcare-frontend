import React, { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/CTAAndFooter';

export default function AdoptionPage() {
  const [selectedSpecies, setSelectedSpecies] = useState('Dogs');
  const [selectedAgeRange, setSelectedAgeRange] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch pets from backend API
  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/pets'); // replace with your backend endpoint
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

  // Filter pets based on search and filters
  const filteredPets = pets.filter(pet => {
    const matchesSpecies = pet.species === selectedSpecies;
    const matchesAge = selectedAgeRange.length === 0 || selectedAgeRange.includes(pet.ageRange);
    const matchesSearch = pet.name.toLowerCase().includes(searchText.toLowerCase());
    return matchesSpecies && matchesAge && matchesSearch;
  });

  return (
    <>
      <Navbar />

      <div className="pt-20 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <div className="w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">Filters</h3>
                  <button className="text-sm text-gray-500 hover:text-gray-700">
                    fitting your search
                  </button>
                </div>

                {/* Species Filter */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-green-600">🐾</span>
                    <span className="font-medium text-gray-700">Species</span>
                  </div>
                  <div className="space-y-2">
                    {['Dogs', 'Cats', 'Rabbits'].map((species) => (
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

                {/* Age Range Filter */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-green-600">○</span>
                    <span className="font-medium text-gray-700">Age Range</span>
                  </div>
                  <div className="space-y-2">
                    {['Puppy', 'Young', 'Adult', 'Senior'].map((age) => (
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

            {/* Main Content */}
            <div className="flex-1">
              {/* Search Bar */}
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

              {/* Results Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {loading ? 'Loading pets...' : `${filteredPets.length} Best Friends Found`}
                </h2>
                {error && <p className="text-red-500 mt-2">{error}</p>}
              </div>

              {/* Pet Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {loading && !error && <p>Loading pets...</p>}
                {!loading && filteredPets.map((pet) => (
                  <div key={pet.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-48 bg-gray-200">
                      <img
                        src={pet.image}
                        alt={pet.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{pet.name}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          pet.gender === 'Male' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-pink-100 text-pink-700'
                        }`}>
                          {pet.gender}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{pet.breed} • {pet.ageRange}</p>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="w-3 h-3" />
                        <span>{pet.location}</span>
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
