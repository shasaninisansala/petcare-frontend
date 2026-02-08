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

  // Donation Requests and Donations - Start empty
  const [donationRequests, setDonationRequests] = useState([]);
  const [donations, setDonations] = useState([]);

  // Logged-in shelter info - Start as null
  const [loggedInShelter, setLoggedInShelter] = useState(null);

  // Stats for this shelter
  const [shelterTotalReceived, setShelterTotalReceived] = useState(0);
  const [shelterThisMonth, setShelterThisMonth] = useState(0);
  const [activeCampaigns, setActiveCampaigns] = useState(0);

  // Request form state
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

  // State to control showing shelter ID input
  const [showShelterInput, setShowShelterInput] = useState(false);

  // =========================
  // INITIAL LOAD - NO DATA
  // =========================
  useEffect(() => {
    // Clear any stored shelter data to ensure fresh start
    localStorage.removeItem('currentShelter');
    
    // Reset all data
    setDonations([]);
    setDonationRequests([]);
    setLoggedInShelter(null);
    setShelterTotalReceived(0);
    setShelterThisMonth(0);
    setActiveCampaigns(0);
    
    console.log('📭 Page loaded with empty state');
  }, []);

  // =========================
  // FETCH DATA FOR THIS SHELTER
  // =========================
  const fetchAllData = async (shelterId) => {
    setIsLoading(true);
    try {
      console.log(`📊 Fetching data for shelter ID: ${shelterId}`);
      
      // Clear previous data first
      setDonations([]);
      setDonationRequests([]);
      setShelterTotalReceived(0);
      setShelterThisMonth(0);
      setActiveCampaigns(0);

      // Try shelter-specific endpoints first
      try {
        // Use new shelter-specific endpoints
        await fetchDataWithShelterEndpoints(shelterId);
      } catch (error) {
        console.log('Using fallback filtering');
        // Use fallback method (fetch all and filter)
        await fetchDataAndFilter(shelterId);
      }
      
    } catch (error) {
      console.error('Error fetching shelter data:', error);
      // Don't show error if no data exists yet
      if (error.response?.status !== 404) {
        alert(`Error fetching data: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Method 1: Use new shelter-specific endpoints
  const fetchDataWithShelterEndpoints = async (shelterId) => {
    try {
      // Try to fetch shelter-specific data
      const [donationsRes, requestsRes] = await Promise.all([
        axios.get(`http://localhost:8084/api/donations/shelter/${shelterId}`),
        axios.get(`http://localhost:8084/api/donation-requests/shelter/${shelterId}`)
      ]);
      
      setDonations(donationsRes.data || []);
      setDonationRequests(requestsRes.data || []);
      
      // Calculate stats from donations data
      const total = (donationsRes.data || []).reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthTotal = (donationsRes.data || []).reduce((sum, d) => {
        if (d.createdAt) {
          const date = new Date(d.createdAt);
          if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
            return sum + parseFloat(d.amount || 0);
          }
        }
        return sum;
      }, 0);
      
      setShelterTotalReceived(total);
      setShelterThisMonth(monthTotal);
      
      // Count active campaigns
      const active = (requestsRes.data || []).filter(req => req.status === 'OPEN').length;
      setActiveCampaigns(active);
      
      console.log(`✅ Loaded ${(donationsRes.data || []).length} donations for shelter ${shelterId}`);
      
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
      const [allDonations, allRequests] = await Promise.all([
        axios.get('http://localhost:8084/api/donations'),
        axios.get('http://localhost:8084/api/donation-requests')
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
  // SET SHELTER FUNCTION
  // =========================
  const setShelter = (shelterId) => {
    if (!shelterId || shelterId.trim() === '') {
      alert('Please enter a valid Shelter ID');
      return false;
    }

    const id = parseInt(shelterId);
    if (isNaN(id) || id <= 0) {
      alert('Please enter a valid numeric Shelter ID');
      return false;
    }

    // Create shelter object with entered ID
    const shelterData = {
      id: id,
      name: `Shelter #${id}`,
      registrationNumber: `SHELTER-${id}`
    };
    
    localStorage.setItem('currentShelter', JSON.stringify(shelterData));
    setLoggedInShelter(shelterData);
    setShowShelterInput(false);
    
    // Auto-populate request form
    setRequestForm(prev => ({
      ...prev,
      shelterId: shelterData.id,
      shelterName: shelterData.name
    }));
    
    // Fetch data for this shelter
    fetchAllData(shelterData.id);
    return true;
  };

  // =========================
  // CHANGE SHELTER FUNCTION
  // =========================
  const changeShelter = () => {
    if (!loggedInShelter) {
      setShowShelterInput(true);
      return;
    }
    
    const newShelterId = prompt('Enter new Shelter ID:', loggedInShelter?.id || '');
    if (!newShelterId) return;
    
    if (setShelter(newShelterId)) {
      // Reset search query
      setSearchQuery('');
    }
  };

  // Refresh data
  const handleRefresh = () => {
    if (loggedInShelter) {
      console.log(`🔄 Refreshing data for shelter ${loggedInShelter.id}`);
      fetchAllData(loggedInShelter.id);
    }
  };

  // =========================
  // FILE UPLOAD HANDLERS
  // =========================
  const handleFileSelect = (e, formType = 'request') => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.match('image.*')) {
      alert('Please select an image file (JPG, PNG, GIF, etc.)');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    // Create object URL for preview
    const imageUrl = URL.createObjectURL(file);
    
    if (formType === 'request') {
      setRequestForm({
        ...requestForm,
        imageFile: file,
        imageUrl: imageUrl
      });
    } else {
      setUpdateForm({
        ...updateForm,
        imageFile: file,
        imageUrl: imageUrl
      });
    }
  };

  const triggerFileInput = (formType = 'request') => {
    if (formType === 'request') {
      fileInputRef.current?.click();
    }
  };

  const removeImage = (formType = 'request') => {
    if (formType === 'request') {
      if (requestForm.imageUrl && requestForm.imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(requestForm.imageUrl);
      }
      setRequestForm({
        ...requestForm,
        imageFile: null,
        imageUrl: ''
      });
    } else {
      if (updateForm.imageUrl && updateForm.imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(updateForm.imageUrl);
      }
      setUpdateForm({
        ...updateForm,
        imageFile: null,
        imageUrl: ''
      });
    }
  };

  // =========================
  // FORM HANDLERS
  // =========================
  const handleRequestChange = (e) =>
    setRequestForm({ ...requestForm, [e.target.name]: e.target.value });
  
  const handleUpdateChange = (e) =>
    setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });

  // Upload image to server
  const uploadImageToServer = async (imageFile) => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await axios.post('http://localhost:8084/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return URL.createObjectURL(imageFile);
    }
  };

  // Submit new donation request
  const submitRequest = async (e) => {
    e.preventDefault();
    try {
      if (requestForm.endDate && requestForm.startDate > requestForm.endDate) {
        alert('End date must be after start date');
        return;
      }

      let finalImageUrl = requestForm.imageUrl;
      
      if (requestForm.imageFile) {
        const uploadedUrl = await uploadImageToServer(requestForm.imageFile);
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        }
      }

      const payload = {
        ...requestForm,
        imageUrl: finalImageUrl,
        targetAmount: parseFloat(requestForm.targetAmount),
        currentAmount: parseFloat(requestForm.currentAmount) || 0
      };

      delete payload.imageFile;

      const res = await axios.post('http://localhost:8084/api/donation-requests', payload);
      setDonationRequests([res.data, ...donationRequests]);
      setShowRequestForm(false);
      resetRequestForm();
      alert('Campaign created successfully!');
      handleRefresh();
    } catch (error) {
      console.error('Error creating donation request:', error);
      alert(`Failed to create campaign: ${error.response?.data?.message || error.message}`);
    }
  };

  // Submit update donation request
  const submitUpdate = async (e) => {
    e.preventDefault();
    try {
      if (updateForm.endDate && updateForm.startDate > updateForm.endDate) {
        alert('End date must be after start date');
        return;
      }

      let finalImageUrl = updateForm.imageUrl;
      
      if (updateForm.imageFile) {
        const uploadedUrl = await uploadImageToServer(updateForm.imageFile);
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        }
      }

      const payload = {
        ...updateForm,
        imageUrl: finalImageUrl,
        targetAmount: parseFloat(updateForm.targetAmount),
        currentAmount: parseFloat(updateForm.currentAmount) || 0
      };

      delete payload.imageFile;

      const res = await axios.put(
        `http://localhost:8084/api/donation-requests/${updateForm.id}`,
        payload
      );
      setDonationRequests(
        donationRequests.map((d) => (d.id === updateForm.id ? res.data : d))
      );
      setShowUpdateForm(false);
      resetUpdateForm();
      alert('Campaign updated successfully!');
      handleRefresh();
    } catch (error) {
      console.error('Error updating donation request:', error);
      alert(`Failed to update campaign: ${error.response?.data?.message || error.message}`);
    }
  };

  // Reset forms
  const resetRequestForm = () => {
    setRequestForm({
      shelterId: loggedInShelter?.id || '',
      shelterName: loggedInShelter?.name || '',
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
  };

  const resetUpdateForm = () => {
    setUpdateForm({
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
  };

  // Select donation request for update
  const selectDonationForUpdate = (request) => {
    setUpdateForm({
      id: request.id,
      shelterId: request.shelterId || '',
      shelterName: request.shelterName || '',
      title: request.title || '',
      description: request.description || '',
      imageUrl: request.imageUrl || '',
      imageFile: null,
      targetAmount: request.targetAmount || '',
      currentAmount: request.currentAmount || '',
      status: request.status || 'OPEN',
      startDate: request.startDate?.split('T')[0] || '',
      endDate: request.endDate?.split('T')[0] || ''
    });
  };

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
  // SHELTER INPUT MODAL
  // =========================
  const ShelterInputModal = () => (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <div className="flex items-center gap-3 mb-4">
          <Building className="w-8 h-8 text-green-500" />
          <h2 className="text-xl font-bold text-gray-900">Enter Shelter ID</h2>
        </div>
        
        <p className="text-gray-600 mb-6">
          Please enter your Shelter ID to view and manage your donation data.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shelter ID
            </label>
            <input
              type="number"
              min="1"
              placeholder="Enter Shelter ID (e.g., 1)"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              id="shelterIdInput"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const input = document.getElementById('shelterIdInput');
                  setShelter(input.value);
                }
              }}
            />
          </div>
          
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => {
                const input = document.getElementById('shelterIdInput');
                setShelter(input.value);
              }}
              className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 font-medium transition-colors"
            >
              Continue
            </button>
            
            <button
              onClick={() => {
                setShowShelterInput(false);
              }}
              className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // =========================
  // RENDER - FULL INTERFACE WITH EMPTY DATA
  // =========================
  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="p-4 md:p-8">

        {/* Header with Shelter Info */}
        <div className="mb-6 md:mb-8">
          <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm mb-4">
            {loggedInShelter ? (
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
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 md:gap-3">
                  <button 
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? 'Loading...' : 'Refresh'}
                  </button>
                  
                  <button 
                    onClick={changeShelter}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm transition-colors"
                  >
                    <Building className="w-4 h-4" />
                    {loggedInShelter ? 'Change Shelter' : 'Enter Shelter ID'}
                  </button>
                  
                  <button 
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm transition-colors"
                    onClick={() => {
                      if (!loggedInShelter) {
                        setShowShelterInput(true);
                      } else {
                        alert('Export functionality coming soon!');
                      }
                    }}
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>

                  <button
                    onClick={() => {
                      if (!loggedInShelter) {
                        setShowShelterInput(true);
                      } else {
                        setShowRequestForm(true);
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm transition-colors"
                  >
                    <PlusCircle className="w-4 h-4" />
                    New Campaign
                  </button>

                  <button
                    onClick={() => {
                      if (!loggedInShelter) {
                        setShowShelterInput(true);
                      } else {
                        setShowUpdateForm(true);
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Update Campaign
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Building className="w-8 h-8 text-gray-400" />
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Donation Management</h2>
                      <p className="text-sm text-gray-600">Shelter Dashboard</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm">
                    <div>
                      <span className="text-gray-500">Shelter ID:</span>
                      <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded text-gray-400">Not Selected</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Reg No:</span>
                      <span className="ml-2 font-medium text-gray-400">SHELTER-XXX</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 md:gap-3">
                  <button 
                    onClick={() => setShowShelterInput(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                  
                  <button 
                    onClick={() => setShowShelterInput(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm transition-colors"
                  >
                    <Building className="w-4 h-4" />
                    Enter Shelter ID
                  </button>
                  
                  <button 
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm transition-colors"
                    onClick={() => setShowShelterInput(true)}
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>

                  <button
                    onClick={() => setShowShelterInput(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm transition-colors"
                  >
                    <PlusCircle className="w-4 h-4" />
                    New Campaign
                  </button>

                  <button
                    onClick={() => setShowShelterInput(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Update Campaign
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Shelter Input Modal */}
        {showShelterInput && <ShelterInputModal />}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <>
            {/* Stats - Show always */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
              <div className={`bg-white p-4 md:p-6 rounded-xl border shadow-sm ${!loggedInShelter ? 'opacity-60' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Total Received</p>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {loggedInShelter ? 'Shelter Only' : 'Select Shelter'}
                  </span>
                </div>
                <p className="text-2xl md:text-3xl font-bold mt-1">
                  ${formatCurrency(shelterTotalReceived)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {loggedInShelter ? 'All donations to your campaigns' : 'Enter Shelter ID to view data'}
                </p>
              </div>
              
              <div className={`bg-white p-4 md:p-6 rounded-xl border shadow-sm ${!loggedInShelter ? 'opacity-60' : ''}`}>
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
                  {loggedInShelter ? 'Donations this month' : 'Select Shelter to view monthly data'}
                </p>
              </div>
              
              <div className={`bg-white p-4 md:p-6 rounded-xl border shadow-sm ${!loggedInShelter ? 'opacity-60' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Campaigns</p>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                    {loggedInShelter ? `Active: ${activeCampaigns}` : 'Inactive'}
                  </span>
                </div>
                <p className="text-2xl md:text-3xl font-bold mt-1">
                  {donationRequests.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {loggedInShelter ? 'Total campaigns' : 'No campaigns until shelter selected'}
                </p>
              </div>
            </div>

            {/* Search Bar - Show always */}
            <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm mb-6">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    placeholder={loggedInShelter ? "Search by donor name or campaign ID" : "Enter Shelter ID first to search"}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={!loggedInShelter}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${!loggedInShelter ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  />
                </div>
                {searchQuery && loggedInShelter && (
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
                  {loggedInShelter ? (
                    <>Showing donations for <span className="font-medium">{loggedInShelter.name}</span> only</>
                  ) : (
                    <>Select a shelter to view donation data</>
                  )}
                </p>
                {loggedInShelter && (
                  <p className="text-xs text-gray-500">
                    {filteredDonations.length} of {donations.length} donations
                  </p>
                )}
              </div>
            </div>

            {/* Table - Show always */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              {!loggedInShelter ? (
                <div className="p-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg font-medium mb-3">No Shelter Selected</p>
                    <p className="text-sm text-gray-600 mb-6 max-w-md">
                      Enter your Shelter ID to view and manage your donation campaigns and history.
                    </p>
                    <button
                      onClick={() => setShowShelterInput(true)}
                      className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium transition-colors flex items-center gap-2"
                    >
                      <Building className="w-5 h-5" />
                      Enter Shelter ID to Get Started
                    </button>
                  </div>
                </div>
              ) : filteredDonations.length === 0 && donations.length > 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No donations match your search</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-4 px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Clear Search
                  </button>
                </div>
              ) : filteredDonations.length === 0 && donations.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-lg font-medium mb-3">No Donations Yet</p>
                    <p className="text-sm text-gray-600 mb-6 max-w-md">
                      {donationRequests.length === 0 
                        ? "You haven't created any donation campaigns yet. Create your first campaign to start receiving donations."
                        : "You have campaigns but no donations yet. Once donors contribute, they will appear here."
                      }
                    </p>
                    {donationRequests.length === 0 ? (
                      <button
                        onClick={() => setShowRequestForm(true)}
                        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Create Your First Campaign
                      </button>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => setShowRequestForm(true)}
                          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Create Another Campaign
                        </button>
                        <button
                          onClick={handleRefresh}
                          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Check for New Donations
                        </button>
                      </div>
                    )}
                  </div>
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
          </>
        )}

        {/* Receipt Modal */}
        {selectedDonation && (
          <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Donation Receipt</h2>
                <button
                  onClick={() => setSelectedDonation(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Donor:</span>
                  <span>{selectedDonation.donorName || 'Anonymous'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Date:</span>
                  <span>
                    {selectedDonation.createdAt ? new Date(selectedDonation.createdAt).toLocaleString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Amount:</span>
                  <span className="text-green-600 font-semibold">
                    ${formatCurrency(selectedDonation.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Campaign ID:</span>
                  <span>{selectedDonation.donationRequestId || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    selectedDonation.status === 'SUCCESS' ? 'bg-green-100 text-green-800' :
                    selectedDonation.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    selectedDonation.status === 'OPEN' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedDonation.status}
                  </span>
                </div>
                {selectedDonation.purpose && (
                  <div className="pt-3 border-t">
                    <p className="font-medium mb-1">Purpose:</p>
                    <p className="text-sm text-gray-600">{selectedDonation.purpose}</p>
                  </div>
                )}
              </div>
              <button
                onClick={() => setSelectedDonation(null)}
                className="mt-6 w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => handleFileSelect(e, 'request')}
        />

        {/* Request Donation Modal */}
        {showRequestForm && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Request Donation</h2>
                <button
                  onClick={() => {
                    setShowRequestForm(false);
                    resetRequestForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={submitRequest} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shelter ID *
                    </label>
                    <input
                      name="shelterId"
                      type="number"
                      placeholder="e.g., 1"
                      value={requestForm.shelterId}
                      onChange={handleRequestChange}
                      required
                      min="1"
                      className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shelter Name *
                    </label>
                    <input
                      name="shelterName"
                      placeholder="e.g., Safe Valley Shelter"
                      value={requestForm.shelterName}
                      onChange={handleRequestChange}
                      required
                      className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    name="title"
                    placeholder="e.g., Winter Supplies Drive"
                    value={requestForm.title}
                    onChange={handleRequestChange}
                    required
                    className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    placeholder="Describe the campaign purpose and goals..."
                    value={requestForm.description}
                    onChange={handleRequestChange}
                    required
                    rows={3}
                    className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Image (Optional)
                  </label>
                  
                  {/* Current Preview */}
                  {requestForm.imageUrl && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-600 mb-1">Preview:</p>
                      <div className="relative">
                        <img 
                          src={requestForm.imageUrl} 
                          alt="Preview" 
                          className="w-full h-48 object-cover rounded-lg border"
                          onError={(e) => {
                            e.target.src = '/images/default-donation.jpg';
                            e.target.className = 'w-full h-48 object-contain rounded-lg border p-8 bg-gray-100';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage('request')}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {requestForm.imageFile ? `Selected: ${requestForm.imageFile.name}` : 'Image loaded'}
                      </p>
                    </div>
                  )}

                  {/* Upload Button */}
                  <div className="mb-3">
                    <button
                      type="button"
                      onClick={() => triggerFileInput('request')}
                      className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-500 hover:bg-green-50 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <Upload className="w-10 h-10 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                          {requestForm.imageFile 
                            ? `Change image (${requestForm.imageFile.name})`
                            : 'Click to upload image from your device'
                          }
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Supports JPG, PNG, GIF (Max 5MB)
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          Or paste URL below
                        </p>
                      </div>
                    </button>
                  </div>

                  {/* Image URL Input (Fallback) */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-px flex-1 bg-gray-300"></div>
                      <span className="text-xs text-gray-500">OR</span>
                      <div className="h-px flex-1 bg-gray-300"></div>
                    </div>
                    <input
                      name="imageUrl"
                      type="url"
                      placeholder="Paste image URL here instead"
                      value={requestForm.imageFile ? '' : requestForm.imageUrl}
                      onChange={handleRequestChange}
                      disabled={!!requestForm.imageFile}
                      className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {requestForm.imageFile 
                        ? 'URL input disabled because file is selected'
                        : 'Enter image URL if you prefer'
                      }
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Amount *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">$</span>
                      <input
                        name="targetAmount"
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="e.g., 50000"
                        value={requestForm.targetAmount}
                        onChange={handleRequestChange}
                        required
                        className="w-full border p-2.5 pl-8 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date *
                    </label>
                    <input
                      name="startDate"
                      type="date"
                      value={requestForm.startDate}
                      onChange={handleRequestChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date (Optional)
                  </label>
                  <input
                    name="endDate"
                    type="date"
                    value={requestForm.endDate}
                    onChange={handleRequestChange}
                    min={requestForm.startDate || new Date().toISOString().split('T')[0]}
                    className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRequestForm(false);
                      resetRequestForm();
                    }}
                    className="px-5 py-2.5 border rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Update Donation Modal */}
        {showUpdateForm && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Update Donation Request</h2>
                <button
                  onClick={() => {
                    setShowUpdateForm(false);
                    resetUpdateForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!updateForm.id ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <p className="text-gray-600 mb-3">Select a campaign to update:</p>
                  {donationRequests.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No donation campaigns available
                    </div>
                  ) : (
                    donationRequests.map(req => (
                      <button
                        key={req.id}
                        onClick={() => selectDonationForUpdate(req)}
                        className="w-full border p-3 rounded-lg hover:bg-gray-100 text-left flex items-center gap-3 transition-colors"
                      >
                        <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                          <img 
                            src={req.imageUrl || '/images/default-donation.jpg'} 
                            alt={req.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/images/default-donation.jpg';
                              e.target.className = 'w-full h-full object-contain p-1';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{req.title}</p>
                          <p className="text-sm text-gray-500 truncate">
                            {req.shelterName} • ${formatCurrency(req.targetAmount)}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            req.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                            req.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              ) : (
                <form onSubmit={submitUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Shelter ID *
                      </label>
                      <input
                        name="shelterId"
                        type="number"
                        value={updateForm.shelterId}
                        onChange={handleUpdateChange}
                        required
                        min="1"
                        className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Shelter Name *
                      </label>
                      <input
                        name="shelterName"
                        value={updateForm.shelterName}
                        onChange={handleUpdateChange}
                        required
                        className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      name="title"
                      value={updateForm.title}
                      onChange={handleUpdateChange}
                      required
                      className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={updateForm.description}
                      onChange={handleUpdateChange}
                      required
                      rows={3}
                      className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Image Upload for Update Form */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Campaign Image
                    </label>
                    
                    {/* Current Preview */}
                    {updateForm.imageUrl && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-600 mb-1">
                          {updateForm.imageFile ? 'New Preview:' : 'Current Image:'}
                        </p>
                        <div className="relative">
                          <img 
                            src={updateForm.imageUrl} 
                            alt="Preview" 
                            className="w-full h-48 object-cover rounded-lg border"
                            onError={(e) => {
                              e.target.src = '/images/default-donation.jpg';
                              e.target.className = 'w-full h-48 object-contain rounded-lg border p-8 bg-gray-100';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeImage('update')}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        {updateForm.imageFile && (
                          <p className="text-xs text-gray-500 mt-1">
                            New image selected: {updateForm.imageFile.name}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Upload Button for Update */}
                    <div className="mb-3">
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = (e) => handleFileSelect(e, 'update');
                          input.click();
                        }}
                        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Camera className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {updateForm.imageFile ? 'Change image' : 'Upload new image'}
                          </span>
                        </div>
                      </button>
                    </div>

                    {/* Image URL Input for Update */}
                    <div className="mb-3">
                      <input
                        name="imageUrl"
                        type="url"
                        placeholder="Or enter new image URL"
                        value={updateForm.imageFile ? '' : updateForm.imageUrl}
                        onChange={handleUpdateChange}
                        disabled={!!updateForm.imageFile}
                        className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-100"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {updateForm.imageFile 
                          ? 'URL input disabled because file is selected'
                          : 'Enter new URL or keep existing'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Target Amount *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-500">$</span>
                        <input
                          name="targetAmount"
                          type="number"
                          step="0.01"
                          min="0.01"
                          value={updateForm.targetAmount}
                          onChange={handleUpdateChange}
                          required
                          className="w-full border p-2.5 pl-8 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Amount
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-500">$</span>
                        <input
                          name="currentAmount"
                          type="number"
                          step="0.01"
                          min="0"
                          value={updateForm.currentAmount}
                          onChange={handleUpdateChange}
                          className="w-full border p-2.5 pl-8 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        name="status"
                        value={updateForm.status}
                        onChange={handleUpdateChange}
                        className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date *
                      </label>
                      <input
                        name="startDate"
                        type="date"
                        value={updateForm.startDate}
                        onChange={handleUpdateChange}
                        required
                        className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <input
                        name="endDate"
                        type="date"
                        value={updateForm.endDate}
                        onChange={handleUpdateChange}
                        min={updateForm.startDate || new Date().toISOString().split('T')[0]}
                        className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUpdateForm(false);
                        resetUpdateForm();
                      }}
                      className="px-5 py-2.5 border rounded-lg hover:bg-gray-50 font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-colors"
                    >
                      Update
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}