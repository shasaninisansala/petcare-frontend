import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/CTAAndFooter';
import axios from 'axios';
import { Search, MapPin, Filter, Target, TrendingUp, Calendar, Users, Eye, Hash } from 'lucide-react';

export default function DonatePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Regions');
  const [activeFilter, setActiveFilter] = useState('All Shelters');
  const [donationRequests, setDonationRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  // Fetch donation requests from backend
  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        // Fetch donation requests
        const response = await axios.get('http://localhost:8084/api/donation-requests'); 
        const requests = response.data;
        
        // For each request, fetch updated current amount from donations
        const requestsWithUpdatedAmounts = await Promise.all(
          requests.map(async (req) => {
            try {
              // Fetch current total donations for this request
              const totalResponse = await axios.get(
                `http://localhost:8084/api/donations/request/${req.id}/total`
              );
              
              // Sync the amount in the backend (this will update donation_requests table)
              await axios.post(`http://localhost:8084/api/donations/request/${req.id}/sync`);
              
              return {
                ...req,
                currentAmount: totalResponse.data.totalAmount || 0
              };
            } catch (error) {
              console.error(`Error fetching total for request ${req.id}:`, error);
              return req;
            }
          })
        );
        
        console.log('Donation requests data with updated amounts:', requestsWithUpdatedAmounts);
        setDonationRequests(requestsWithUpdatedAmounts);
      } catch (error) {
        console.error('Error fetching donation requests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Dynamically create filters based on unique shelter names
  const uniqueShelters = [...new Set(donationRequests.map(req => req.shelterName))].filter(Boolean);
  const filters = ["All Shelters", ...uniqueShelters];

  // Filter donation requests based on search, location, and active filter
  const filteredRequests = donationRequests.filter((req) => {
    const matchesSearch = 
      req.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.shelterName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = selectedLocation === 'All Regions' || req.location?.includes(selectedLocation);
    
    const matchesFilter = activeFilter === 'All Shelters' || req.shelterName === activeFilter;
    
    return matchesSearch && matchesLocation && matchesFilter;
  });

  // Calculate progress percentage
  const calculateProgress = (current, target) => {
    if (!target || target <= 0) return 0;
    const progress = (current / target) * 100;
    return Math.min(100, Math.round(progress * 10) / 10); // Round to 1 decimal
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric' 
      });
    } catch (error) {
      return 'N/A';
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '0.00';
    try {
      return parseFloat(amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    } catch (error) {
      return '0.00';
    }
  };

  // View image in modal
  const viewImage = (url) => {
    setSelectedImage(url || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800');
    setShowImageModal(true);
  };

  // Get total raised
  const totalRaised = donationRequests.reduce((sum, req) => {
    const amount = parseFloat(req.currentAmount || 0);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  // Function to refresh data
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8084/api/donation-requests'); 
      setDonationRequests(response.data);
      
      // Sync amounts in backend
      await axios.post('http://localhost:8084/api/donations/admin/sync-amounts');
      
      console.log('✅ Data refreshed and synced');
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="bg-gradient-to-b from-gray-50 to-white pt-16 md:pt-20 min-h-screen">
        {/* Hero Section */}
        <section className="relative py-12 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Support Animal Welfare
            </h1>
            <p className="text-lg text-green-100 max-w-3xl mx-auto mb-8">
              Your contributions go directly to verified shelters. Track every dollar and see the real-world impact you make on the lives of animals in need.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 min-w-[150px]">
                <p className="text-2xl font-bold">{donationRequests.length}</p>
                <p className="text-sm text-green-100">Active Campaigns</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 min-w-[150px]">
                <p className="text-2xl font-bold">
                  ${formatCurrency(totalRaised)}
                </p>
                <p className="text-sm text-green-100">Total Raised</p>
              </div>
              <button
                onClick={refreshData}
                className="bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                title="Refresh Data"
              >
                Refresh
              </button>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="bg-white border-b border-gray-200 py-8 px-6 sticky top-16 md:top-20 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Campaigns
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by title, shelter, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filter by Shelter
                  </div>
                </label>
                <select
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition bg-white"
                >
                  <option value="All Shelters">All Shelters</option>
                  {uniqueShelters.map((shelter, index) => (
                    <option key={index} value={shelter}>{shelter}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </div>
              </label>
              <div className="flex flex-wrap gap-2">
                {['All Regions', 'Colombo', 'Galle', 'Gampaha', 'Kandy'].map((location) => (
                  <button
                    key={location}
                    onClick={() => setSelectedLocation(location)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      selectedLocation === location
                        ? 'bg-green-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
                    }`}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Donation Requests Cards */}
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                <span className="ml-3 text-gray-600">Loading campaigns...</span>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No campaigns found</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  {searchQuery || selectedLocation !== 'All Regions' || activeFilter !== 'All Shelters' 
                    ? 'Try adjusting your search or filters'
                    : 'No donation campaigns available yet. Check back soon!'}
                </p>
                {(searchQuery || selectedLocation !== 'All Regions' || activeFilter !== 'All Shelters') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedLocation('All Regions');
                      setActiveFilter('All Shelters');
                    }}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRequests.map((req) => (
                    <div key={req.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                      {/* Image Section */}
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        <img 
                          src={req.imageUrl || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800'} 
                          alt={req.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800';
                            e.target.className = 'w-full h-full object-contain p-8 bg-gray-50';
                          }}
                        />
                        
                        {/* Status Badge */}
                        <div className="absolute top-3 left-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            req.status === 'OPEN' ? 'bg-green-500 text-white' :
                            req.status === 'COMPLETED' ? 'bg-blue-500 text-white' :
                            req.status === 'CANCELLED' ? 'bg-red-500 text-white' :
                            'bg-gray-500 text-white'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                        
                        {/* Request ID Badge */}
                        <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-mono flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          ID: {req.id}
                        </div>
                        
                        {/* View Image Button */}
                        <button
                          onClick={() => viewImage(req.imageUrl)}
                          className="absolute top-12 right-3 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                          title="View Image"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {/* Progress Bar Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                          <div className="w-full bg-white/30 rounded-full h-2 mb-2">
                            <div 
                              className="bg-green-400 h-2 rounded-full transition-all duration-500" 
                              style={{ 
                                width: `${calculateProgress(req.currentAmount, req.targetAmount)}%` 
                              }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-white text-xs">
                            <span>{calculateProgress(req.currentAmount, req.targetAmount).toFixed(1)}% Funded</span>
                            <span>${formatCurrency(req.currentAmount)} / ${formatCurrency(req.targetAmount)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{req.title}</h3>
                          {/* Request ID inside card */}
                          <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            <Hash className="w-3 h-3" />
                            <span className="font-mono">#{req.id}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{req.description}</p>
                        
                        {/* Shelter Info */}
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span className="font-medium">{req.shelterName || `Shelter #${req.shelterId}`}</span>
                          </div>
                          <div className="text-xs text-gray-400">
                            Shelter ID: {req.shelterId}
                          </div>
                        </div>
                        
                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                              <Target className="w-4 h-4" />
                              <span className="text-xs">Target</span>
                            </div>
                            <p className="font-bold text-gray-900">${formatCurrency(req.targetAmount)}</p>
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 text-green-600 mb-1">
                              <TrendingUp className="w-4 h-4" />
                              <span className="text-xs">Raised</span>
                            </div>
                            <p className="font-bold text-green-700">${formatCurrency(req.currentAmount)}</p>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 text-blue-600 mb-1">
                              <Hash className="w-4 h-4" />
                              <span className="text-xs">Request ID</span>
                            </div>
                            <p className="font-bold text-blue-700 font-mono">#{req.id}</p>
                          </div>
                        </div>
                        
                        {/* Date Info */}
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-5">
                          <Calendar className="w-3 h-3" />
                          <span>Created: {formatDate(req.createdAt)}</span>
                        </div>

                        {/* Donate Button */}
                        <Link
                          to="/donate/form"
                          state={{ 
                            requestId: req.id,
                            requestTitle: req.title,
                            requestDescription: req.description,
                            shelterName: req.shelterName,
                            targetAmount: req.targetAmount,
                            currentAmount: req.currentAmount,
                            imageUrl: req.imageUrl
                          }}
                          className="w-full inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
                        >
                          <span>Donate Now</span>
                          <span className="ml-2 text-xs bg-green-600 px-2 py-0.5 rounded">
                            Request #{req.id}
                          </span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Show count */}
                <div className="mt-8 text-center text-gray-600">
                  <p>Showing {filteredRequests.length} of {donationRequests.length} campaigns</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Total Raised: ${formatCurrency(totalRaised)}
                  </p>
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      {/* Image View Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-4 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Campaign Image</h3>
              <button
                onClick={() => setShowImageModal(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex justify-center items-center bg-gray-100 rounded-lg p-4">
              <img 
                src={selectedImage}
                alt="Campaign"
                className="max-w-full max-h-[70vh] object-contain rounded"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800';
                  e.target.className = 'max-w-full max-h-[70vh] object-contain rounded p-8';
                }}
              />
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}