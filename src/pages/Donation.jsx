import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/CTAAndFooter';
import { FaCheckCircle } from 'react-icons/fa'; // React Icons for verified badge
import axios from 'axios'; // For API requests

export default function DonatePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Regions');
  const [activeFilter, setActiveFilter] = useState('All Shelters');
  const [shelters, setShelters] = useState([]); // From backend
  const [filters] = useState([
    { name: 'All Shelters', icon: null },
    { name: 'Medical', icon: '🏥' },
    { name: 'Food', icon: '🍖' },
    { name: 'Rescue', icon: '🚨' },
    { name: 'Senior Care', icon: '👴' },
  ]);

  // Fetch shelters from backend
  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/shelters'); // Replace with your API
        setShelters(response.data);
      } catch (error) {
        console.error('Error fetching shelters:', error);
      }
    };

    fetchShelters();
  }, []);

  // Filter shelters based on search, location, and active filter
  const filteredShelters = shelters.filter((shelter) => {
    const matchesSearch =
      shelter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (shelter.tags && shelter.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesLocation =
      selectedLocation === 'All Regions' || shelter.location.includes(selectedLocation);

    const matchesFilter =
      activeFilter === 'All Shelters' || (shelter.tags && shelter.tags.includes(activeFilter));

    return matchesSearch && matchesLocation && matchesFilter;
  });

  return (
    <>
      <Navbar />

      <div className="bg-gray-50 pt-16 md:pt-20 min-h-screen">
        {/* Hero Section */}
        <section className="bg-white py-12 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Support Animal Welfare
            </h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Your contributions go directly to verified shelters. Track every dollar and see the real-world impact you make on the lives of animals in need.
            </p>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="bg-white border-t border-gray-200 py-8 px-6 sticky top-16 md:top-20 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Shelters</label>
                <input
                  type="text"
                  placeholder="Search by name or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition bg-white"
                >
                  <option>All Regions</option>
                  <option>Colombo</option>
                  <option>Galle</option>
                  <option>Gampaha</option>
                  <option>Kandy</option>
                </select>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-3">
              {filters.map((filter) => (
                <button
                  key={filter.name}
                  onClick={() => setActiveFilter(filter.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    activeFilter === filter.name
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.icon && <span className="mr-2">{filter.icon}</span>}
                  {filter.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Shelter Cards Grid */}
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredShelters.map((shelter) => (
                <div key={shelter.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
                  {/* Image */}
                  <div className="relative h-48 bg-gray-200">
                    <img
                      src={shelter.image}
                      alt={shelter.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Verified Badge */}
                    {shelter.verified && (
                      <div className="absolute top-3 right-3">
                        <FaCheckCircle className="w-6 h-6 text-green-500" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{shelter.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                      </svg>
                      {shelter.location}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {shelter.tags?.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Donate Button */}
                    <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg transition">
                      Donate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
