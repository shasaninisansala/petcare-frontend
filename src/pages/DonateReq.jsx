import React, { useEffect, useState, useRef } from 'react';
import { Search, Download, PlusCircle, Edit, X, Upload, Camera, Building, RefreshCw } from 'lucide-react';
import axios from 'axios';

export default function Donations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // File upload ref
  const fileInputRef = useRef(null);

  // Request and Update modals
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  // Donation Requests and Donations
  const [donationRequests, setDonationRequests] = useState([]);
  const [donations, setDonations] = useState([]);

  // Logged-in shelter info
  const [loggedInShelter, setLoggedInShelter] = useState(null);
  const [shelterLoading, setShelterLoading] = useState(true);

  // Stats for this shelter
  const [shelterTotalReceived, setShelterTotalReceived] = useState(0);
  const [shelterThisMonth, setShelterThisMonth] = useState(0);
  const [activeCampaigns, setActiveCampaigns] = useState(0);

  // Request form state - Auto-populate with shelter info
  const [requestForm, setRequestForm] = useState({
    shelterId: '',
    shelterName: '',
    title: '',
    description: '',
    imageUrl: '',
    imageFile: null,
    targetAmount: '',
    currentAmount: '0',
    status: 'OPEN',
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });

  // Update form state
  const [updateForm, setUpdateForm] = useState({
    id: '',
    shelterId: '',
    shelterName: '',
    title: '',
    description: '',
    imageUrl: '',
    imageFile: null,
    targetAmount: '',
    currentAmount: '',
    status: 'OPEN',
    startDate: '',
    endDate: ''
  });

  // =========================
  // FETCH LOGGED-IN SHELTER (FIXED)
  // =========================
  useEffect(() => {
    fetchLoggedInShelter();
  }, []);

  const fetchLoggedInShelter = async () => {
    try {
      setShelterLoading(true);
      
      // METHOD 1: Get from your actual authentication system
      // This could be from localStorage, cookies, or an API call
      
      // Example 1: From localStorage (if you store it during login)
      let shelterData = null;
      const storedShelter = localStorage.getItem('currentShelter');
      
      if (storedShelter) {
        shelterData = JSON.parse(storedShelter);
      } else {
        // METHOD 2: If you have an API to get current user/shelter
        try {
          // Replace with your actual auth API endpoint
          const token = localStorage.getItem('token');
          const response = await axios.get('http://localhost:8080/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          shelterData = response.data.shelter || response.data;
          localStorage.setItem('currentShelter', JSON.stringify(shelterData));
          
        } catch (authError) {
          console.log('Auth API not available, prompting for shelter ID');
          
          // METHOD 3: Prompt user to enter shelter ID
          const shelterId = prompt('Please enter your Shelter ID:', '1');
          if (!shelterId) {
            alert('Shelter ID is required');
            return;
          }
          
          // Fetch shelter details by ID
          try {
            const shelterResponse = await axios.get(`http://localhost:8080/api/shelters/${shelterId}`);
            shelterData = shelterResponse.data;
            localStorage.setItem('currentShelter', JSON.stringify(shelterData));
          } catch (shelterError) {
            console.log('Could not fetch shelter details, using entered ID');
            // Create minimal shelter object with entered ID
            shelterData = {
              id: parseInt(shelterId),
              name: `Shelter #${shelterId}`,
              registrationNumber: `SHELTER-${shelterId}`
            };
            localStorage.setItem('currentShelter', JSON.stringify(shelterData));
          }
        }
      }
      
      if (shelterData) {
        setLoggedInShelter(shelterData);
        
        // Auto-populate request form with shelter info
        setRequestForm(prev => ({
          ...prev,
          shelterId: shelterData.id,
          shelterName: shelterData.name
        }));
        
        // Fetch data for this shelter
        fetchAllData(shelterData.id);
      }
      
    } catch (error) {
      console.error('Error fetching shelter info:', error);
      alert('Failed to load shelter information. Please refresh the page.');
    } finally {
      setShelterLoading(false);
    }
  };

  // =========================
  // FETCH DATA FOR THIS SHELTER (FIXED WITH STATS)
  // =========================
  const fetchAllData = async (shelterId) => {
    setIsLoading(true);
    try {
      console.log(`📊 Fetching data for shelter ID: ${shelterId}`);
      
      // Check if new shelter-specific endpoints are available
      const endpointsAvailable = await checkShelterEndpointsAvailable(shelterId);
      
      if (endpointsAvailable) {
        // Use new shelter-specific endpoints
        await fetchDataWithShelterEndpoints(shelterId);
      } else {
        // Use fallback method (fetch all and filter)
        await fetchDataAndFilter(shelterId);
      }
      
    } catch (error) {
      console.error('Error fetching shelter data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkShelterEndpointsAvailable = async (shelterId) => {
    try {
      // Test multiple endpoints
      await Promise.all([
        axios.get(`http://localhost:8080/api/donation-requests/shelter/${shelterId}`, { timeout: 2000 }),
        axios.get(`http://localhost:8080/api/donations/shelter/${shelterId}`, { timeout: 2000 })
      ]);
      console.log('✅ Shelter-specific endpoints are available');
      return true;
    } catch (error) {
      console.log('⚠️ Shelter-specific endpoints not available, using fallback filtering');
      return false;
    }
  };

  // Method 1: Use new shelter-specific endpoints
  const fetchDataWithShelterEndpoints = async (shelterId) => {
    try {
      // Fetch shelter-specific data
      const [donationsRes, requestsRes, totalRes, monthRes] = await Promise.all([
        axios.get(`http://localhost:8080/api/donations/shelter/${shelterId}`),
        axios.get(`http://localhost:8080/api/donation-requests/shelter/${shelterId}`),
        // Try shelter-specific stats endpoints
        axios.get(`http://localhost:8080/api/donations/stats/shelter/${shelterId}/total`).catch(() => ({ data: 0 })),
        axios.get(`http://localhost:8080/api/donations/stats/shelter/${shelterId}/this-month`).catch(() => ({ data: 0 }))
      ]);
      
      setDonations(donationsRes.data);
      setDonationRequests(requestsRes.data);
      
      // Set shelter-specific stats
      setShelterTotalReceived(Number(totalRes.data) || 0);
      setShelterThisMonth(Number(monthRes.data) || 0);
      
      // Count active campaigns
      const active = requestsRes.data.filter(req => req.status === 'OPEN').length;
      setActiveCampaigns(active);
      
      console.log(`✅ Loaded ${donationsRes.data.length} donations and ${requestsRes.data.length} campaigns for shelter ${shelterId}`);
      
    } catch (error) {
      console.error('Error with shelter endpoints:', error);
      throw error;
    }
  };

  // Method 2: Fallback - fetch all and filter on frontend
  const fetchDataAndFilter = async (shelterId) => {
    try {
      console.log(`🔄 Using fallback filtering for shelter ${shelterId}`);
      
      // Fetch all data
      const [allDonations, allRequests, totalRes, monthRes] = await Promise.all([
        axios.get('http://localhost:8080/api/donations'),
        axios.get('http://localhost:8080/api/donation-requests'),
        // Use global stats as fallback
        axios.get('http://localhost:8080/api/donations/stats/total').catch(() => ({ data: 0 })),
        axios.get('http://localhost:8080/api/donations/stats/this-month').catch(() => ({ data: 0 }))
      ]);
      
      // Filter requests by shelter ID
      const shelterRequests = allRequests.data.filter(req => 
        req.shelterId === shelterId || String(req.shelterId) === String(shelterId)
      );
      
      // Get request IDs for this shelter
      const requestIds = shelterRequests.map(req => req.id);
      
      // Filter donations that belong to this shelter's requests
      const shelterDonations = allDonations.data.filter(donation => 
        requestIds.includes(donation.donationRequestId)
      );
      
      // Calculate shelter-specific stats
      const shelterTotal = shelterDonations.reduce((sum, d) => 
        sum + parseFloat(d.amount || 0), 0
      );
      
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const shelterMonthTotal = shelterDonations.reduce((sum, d) => {
        if (d.createdAt) {
          const date = new Date(d.createdAt);
          if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
            return sum + parseFloat(d.amount || 0);
          }
        }
        return sum;
      }, 0);
      
      setDonations(shelterDonations);
      setDonationRequests(shelterRequests);
      setShelterTotalReceived(shelterTotal);
      setShelterThisMonth(shelterMonthTotal);
      
      // Count active campaigns
      const active = shelterRequests.filter(req => req.status === 'OPEN').length;
      setActiveCampaigns(active);
      
      console.log(`✅ Filtered ${shelterDonations.length} donations for shelter ${shelterId}`);
      
    } catch (error) {
      console.error('Error in fallback method:', error);
      throw error;
    }
  };

  // =========================
  // CHANGE SHELTER FUNCTION (NEW)
  // =========================
  const changeShelter = () => {
    const newShelterId = prompt('Enter new Shelter ID:', loggedInShelter?.id || '1');
    if (!newShelterId) return;
    
    // Clear current shelter data
    localStorage.removeItem('currentShelter');
    
    // Create new shelter object
    const newShelter = {
      id: parseInt(newShelterId),
      name: `Shelter #${newShelterId}`,
      registrationNumber: `SHELTER-${newShelterId}`
    };
    
    // Try to fetch actual shelter details
    axios.get(`http://localhost:8080/api/shelters/${newShelterId}`)
      .then(response => {
        const actualShelter = response.data;
        localStorage.setItem('currentShelter', JSON.stringify(actualShelter));
        setLoggedInShelter(actualShelter);
        fetchAllData(actualShelter.id);
      })
      .catch(() => {
        // Use created shelter object
        localStorage.setItem('currentShelter', JSON.stringify(newShelter));
        setLoggedInShelter(newShelter);
        fetchAllData(newShelter.id);
      });
  };

  // Refresh data
  const handleRefresh = () => {
    if (loggedInShelter) {
      console.log(`🔄 Refreshing data for shelter ${loggedInShelter.id}`);
      fetchAllData(loggedInShelter.id);
    }
  };

  // =========================
  // YOUR EXISTING FILE UPLOAD HANDLERS (keep exactly as is)
  // =========================
  // [Keep all your existing handlers: handleFileSelect, triggerFileInput, removeImage,
  //  handleRequestChange, handleUpdateChange, uploadImageToServer, submitRequest,
  //  submitUpdate, resetRequestForm, resetUpdateForm, selectDonationForUpdate]
  // =========================

  // Format currency
  const formatCurrency = (amount) => {
    return parseFloat(amount || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Filter donations based on search
  const filteredDonations = donations.filter((d) =>
    d.donorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.donationRequestId?.toString().includes(searchQuery)
  );

  // =========================
  // RENDER (UPDATED WITH CHANGE SHELTER BUTTON)
  // =========================
  if (shelterLoading) {
    return (
      <div className="flex-1 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shelter information...</p>
        </div>
      </div>
    );
  }

  if (!loggedInShelter) {
    return (
      <div className="flex-1 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white rounded-xl border shadow-sm">
          <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Shelter Access Required</h3>
          <p className="text-gray-600 mb-6">
            Please login as a shelter to access donation management.
          </p>
          <button
            onClick={fetchLoggedInShelter}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="p-4 md:p-8">

        {/* Header with Shelter Info */}
        <div className="mb-6 md:mb-8">
          <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm mb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Building className="w-8 h-8 text-green-500" />
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{loggedInShelter.name}</h2>
                    <p className="text-sm text-gray-600">Shelter Dashboard</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-3 text-sm">
                  <div>
                    <span className="text-gray-500">Shelter ID:</span>
                    <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded">#{loggedInShelter.id}</span>
                  </div>
                  {loggedInShelter.registrationNumber && (
                    <div>
                      <span className="text-gray-500">Reg No:</span>
                      <span className="ml-2 font-medium">{loggedInShelter.registrationNumber}</span>
                    </div>
                  )}
                  <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {donations.length} donations • {donationRequests.length} campaigns
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 md:gap-3">
                <button 
                  onClick={handleRefresh}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
                
                <button 
                  onClick={changeShelter}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm transition-colors"
                >
                  <Building className="w-4 h-4" />
                  Change Shelter
                </button>
                
                <button 
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm transition-colors"
                  onClick={() => alert('Export functionality coming soon!')}
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>

                <button
                  onClick={() => setShowRequestForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  New Campaign
                </button>

                <button
                  onClick={() => setShowUpdateForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Update Campaign
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <>
            {/* Stats - SHELTER SPECIFIC */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
              <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Total Received</p>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Shelter Only
                  </span>
                </div>
                <p className="text-2xl md:text-3xl font-bold mt-1">
                  ${formatCurrency(shelterTotalReceived)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  All donations to your campaigns
                </p>
                <div className="mt-2 text-xs">
                  <span className="text-gray-500">Based on </span>
                  <span className="font-medium">{donations.length} donations</span>
                </div>
              </div>
              
              <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">This Month</p>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {new Date().toLocaleString('default', { month: 'long' })}
                  </span>
                </div>
                <p className="text-2xl md:text-3xl font-bold mt-1">
                  ${formatCurrency(shelterThisMonth)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Donations this month
                </p>
                <div className="mt-2 text-xs">
                  <span className="text-gray-500">For shelter </span>
                  <span className="font-medium">#{loggedInShelter.id}</span>
                </div>
              </div>
              
              <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Campaigns</p>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                    Active: {activeCampaigns}
                  </span>
                </div>
                <p className="text-2xl md:text-3xl font-bold mt-1">
                  {donationRequests.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Total campaigns
                </p>
                <div className="flex gap-2 mt-2 text-xs">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                    {activeCampaigns} Active
                  </span>
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                    {donationRequests.length - activeCampaigns} Other
                  </span>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm mb-6">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    placeholder="Search by donor name or campaign ID"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-4 py-2.5 text-gray-600 hover:text-gray-800 text-sm font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">
                  Showing donations for <span className="font-medium">{loggedInShelter.name}</span> only
                </p>
                <p className="text-xs text-gray-500">
                  {filteredDonations.length} of {donations.length} donations
                </p>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              {filteredDonations.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">
                    {searchQuery ? 'No donations found' : 'No donations yet'}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Donations for your campaigns will appear here.
                  </p>
                  {!searchQuery && donationRequests.length === 0 && (
                    <button
                      onClick={() => setShowRequestForm(true)}
                      className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Create Your First Campaign
                    </button>
                  )}
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="mt-4 px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 md:px-6 py-3 text-left text-sm font-medium text-gray-700">Donor</th>
                        <th className="px-4 md:px-6 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                        <th className="px-4 md:px-6 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                        <th className="px-4 md:px-6 py-3 text-left text-sm font-medium text-gray-700">Campaign ID</th>
                        <th className="px-4 md:px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                        <th className="px-4 md:px-6 py-3 text-left text-sm font-medium text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDonations.map((d) => (
                        <tr key={d.id} className="border-t hover:bg-gray-50 transition-colors">
                          <td className="px-4 md:px-6 py-4">{d.donorName || 'Anonymous'}</td>
                          <td className="px-4 md:px-6 py-4">
                            {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-4 md:px-6 py-4 text-green-600 font-semibold">
                            ${formatCurrency(d.amount)}
                          </td>
                          <td className="px-4 md:px-6 py-4">{d.donationRequestId || 'N/A'}</td>
                          <td className="px-4 md:px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                d.status === 'SUCCESS'
                                  ? 'bg-green-100 text-green-800'
                                  : d.status === 'PENDING'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : d.status === 'OPEN'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {d.status || 'UNKNOWN'}
                            </span>
                          </td>
                          <td className="px-4 md:px-6 py-4">
                            <button
                              onClick={() => setSelectedDonation(d)}
                              className="text-green-600 hover:text-green-700 text-sm font-medium underline"
                            >
                              Receipt
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Campaigns Summary */}
            {donationRequests.length > 0 && (
              <div className="bg-white rounded-xl border shadow-sm overflow-hidden mt-8">
                <div className="p-4 md:p-6 border-b">
                  <h3 className="font-bold text-lg">Your Campaigns</h3>
                </div>
                <div className="p-4 md:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {donationRequests.slice(0, 3).map(campaign => (
                      <div key={campaign.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-900 truncate">{campaign.title}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            campaign.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                            campaign.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {campaign.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{campaign.description}</p>
                        <div className="mb-2">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>
                              {((parseFloat(campaign.currentAmount || 0) / parseFloat(campaign.targetAmount || 1)) * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 rounded-full"
                              style={{ 
                                width: `${Math.min(
                                  (parseFloat(campaign.currentAmount || 0) / parseFloat(campaign.targetAmount || 1)) * 100,
                                  100
                                )}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">${formatCurrency(campaign.currentAmount)}</span>
                          <span className="text-gray-600">Goal: ${formatCurrency(campaign.targetAmount)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {donationRequests.length > 3 && (
                    <div className="text-center mt-4">
                      <button
                        onClick={() => setShowUpdateForm(true)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        View all {donationRequests.length} campaigns →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* [Keep all your existing modals exactly as they are] */}
        {/* Receipt Modal, Request Donation Modal, Update Donation Modal */}
        {/* ========================= */}

      </div>
    </div>
  );
}
