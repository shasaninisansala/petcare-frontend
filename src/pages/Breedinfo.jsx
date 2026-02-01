import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/CTAAndFooter';
import {
  Users, Zap, Star, Heart, AlertTriangle, Scissors, Dumbbell, Droplets, Sparkles
} from 'lucide-react';

const iconMap = { Users, Zap, Star, Heart, AlertTriangle, Scissors, Dumbbell, Droplets, Sparkles };

export default function BreedInformation() {
  const [selectedTab, setSelectedTab] = useState('Dog');
  const [selectedBreed, setSelectedBreed] = useState(null);
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch breed data from API
  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://your-api-endpoint.com/breeds'); // Replace with your API
        const data = await response.json();
        setBreeds(data);
        const defaultBreed = data.find(b => b.species === selectedTab) || null;
        setSelectedBreed(defaultBreed);
      } catch (error) {
        console.error('Error fetching breed data:', error);
        setBreeds([]);
        setSelectedBreed(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBreeds();
  }, []);

  // Update selected breed when tab changes
  useEffect(() => {
    if (breeds.length === 0) return;
    const breed = breeds.find(b => b.species === selectedTab) || null;
    setSelectedBreed(breed);
  }, [selectedTab, breeds]);

  // Helper to safely get value or fallback
  const get = (obj, key, fallback = '') => (obj && obj[key] ? obj[key] : fallback);

  return (
    <>
      <Navbar />

      <div className="pt-20 min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-green-600 text-sm font-medium mb-2">PetCare Knowledge Base</p>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Breed Information</h1>
                <p className="text-gray-600 max-w-2xl">
                  {get(selectedBreed, 'description', 'Select a breed or tab to view information.')}
                </p>
              </div>
              <div className="ml-8">
                <div className="w-40 h-40 rounded-2xl overflow-hidden bg-amber-50">
                  <img
                    src={get(selectedBreed, 'heroImage', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop')}
                    alt={get(selectedBreed, 'name', 'Pet')}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Tab Selection */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setSelectedTab('Dog')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  selectedTab === 'Dog' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Dog
              </button>
              <button
                onClick={() => setSelectedTab('Cat')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  selectedTab === 'Cat' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cat
              </button>
              <div className="ml-auto">
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  onChange={(e) => {
                    const breed = breeds.find(b => b.name === e.target.value);
                    if (breed) setSelectedBreed(breed);
                  }}
                  value={get(selectedBreed, 'name', '')}
                >
                  <option value="">Select a breed...</option>
                  {breeds.filter(b => b.species === selectedTab).map(b => (
                    <option key={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {loading ? (
            <div className="text-center text-gray-500">Loading breed information...</div>
          ) : !selectedBreed ? (
            <div className="text-center text-gray-500">No breed information available for this tab.</div>
          ) : (
            <>
              {/* Breed Header */}
              <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
                <div className="flex gap-8">
                  <div className="w-48 h-48 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={get(selectedBreed, 'image', 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400&h=400&fit=crop')}
                      alt={get(selectedBreed, 'name', 'Pet')}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{get(selectedBreed, 'name', 'Unknown Breed')}</h2>
                    <p className="text-gray-600 mb-6">{get(selectedBreed, 'tagline', '')}</p>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <div className="flex justify-center mb-2">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 text-xs font-bold">SIZE</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">Size</p>
                        <p className="font-semibold text-gray-900">{get(selectedBreed, 'size', 'N/A')}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <div className="flex justify-center mb-2">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <Zap className="w-4 h-4 text-green-600" />
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">Lifespan</p>
                        <p className="font-semibold text-gray-900">{get(selectedBreed, 'lifespan', 'N/A')}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <div className="flex justify-center mb-2">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <Zap className="w-4 h-4 text-green-600" />
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">Energy</p>
                        <p className="font-semibold text-gray-900">{get(selectedBreed, 'energy', 'N/A')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Behavior & Temperament */}
              <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Behavior & Temperament</h3>
                <div className="grid grid-cols-4 gap-6">
                  {get(selectedBreed, 'behavior', []).length > 0 ? get(selectedBreed, 'behavior', []).map((item, idx) => {
                    const Icon = iconMap[item.icon] || Users;
                    return (
                      <div className="text-center" key={idx}>
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Icon className="w-8 h-8 text-green-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">{item.title || 'N/A'}</h4>
                        <p className="text-sm text-gray-600">{item.description || 'No information available.'}</p>
                      </div>
                    );
                  }) : <p className="col-span-4 text-center text-gray-500">No behavior information available.</p>}
                </div>
              </div>

              {/* Diet & Grooming */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                {/* Diet */}
                <div className="bg-white rounded-2xl shadow-sm p-8 border-2 border-dashed border-blue-200">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Diet & Nutrition</h3>
                  </div>
                  <div className="space-y-4">
                    {get(selectedBreed, 'diet', []).length > 0 ? get(selectedBreed, 'diet', []).map((item, idx) => (
                      <div className="flex gap-3" key={idx}>
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-green-600 text-xs">✓</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.title || 'N/A'}:</p>
                          <p className="text-sm text-gray-600">{item.description || 'No information available.'}</p>
                        </div>
                      </div>
                    )) : <p className="text-gray-500">No diet information available.</p>}
                  </div>
                </div>

                {/* Grooming */}
                <div className="bg-white rounded-2xl shadow-sm p-8 border-2 border-dashed border-blue-200">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <Scissors className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Grooming & Daily Care</h3>
                  </div>
                  <div className="space-y-4">
                    {get(selectedBreed, 'grooming', []).length > 0 ? get(selectedBreed, 'grooming', []).map((item, idx) => (
                      <div className="flex gap-3" key={idx}>
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          {item.icon && iconMap[item.icon] ? React.createElement(iconMap[item.icon], { className: "w-3 h-3 text-green-600" }) : null}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.title || 'N/A'}:</p>
                          <p className="text-sm text-gray-600">{item.description || 'No information available.'}</p>
                        </div>
                      </div>
                    )) : <p className="text-gray-500">No grooming information available.</p>}
                  </div>
                </div>
              </div>

              {/* Health */}
              <div className="bg-white rounded-2xl shadow-sm p-8 border-2 border-dashed border-blue-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Common Health Considerations</h3>
                <div className="grid grid-cols-2 gap-6">
                  {get(selectedBreed, 'health', []).length > 0 ? get(selectedBreed, 'health', []).map((item, idx) => {
                    const Icon = item.icon && iconMap[item.icon] ? iconMap[item.icon] : AlertTriangle;
                    return (
                      <div className={`rounded-lg p-6 bg-${get(item, 'color', 'amber')}-50 border border-${get(item, 'color', 'amber')}-200`} key={idx}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 ${get(item, 'color', 'amber')}-100 rounded-full flex items-center justify-center`}>
                            <Icon className={`w-5 h-5 text-${get(item, 'color', 'amber')}-600`} />
                          </div>
                          <h4 className="font-bold text-gray-900">{item.title || 'N/A'}</h4>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{item.description || 'No information available.'}</p>
                        {item.prevention && <p className="text-sm text-green-700 font-medium">{item.prevention}</p>}
                      </div>
                    );
                  }) : <p className="col-span-2 text-center text-gray-500">No health information available.</p>}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
