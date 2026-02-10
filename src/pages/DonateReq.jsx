import React, { useEffect, useState, useRef } from 'react';
import { Search, Download, PlusCircle, Edit, X, Upload, Camera, Building, RefreshCw, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function Donations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // File upload ref
  const fileInputRef = useRef(null);
  const shelterNameInputRef = useRef(null);

  // Request and Update modals
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  // Donation Requests and Donations - Start empty
  const [donationRequests, setDonationRequests] = useState([]);
  const [donations, setDonations] = useState([]);

  // Currently loaded shelter info (temporary, no login)
  const [currentShelter, setCurrentShelter] = useState(null);

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
    status: 'PENDING', // Using PENDING for new campaigns
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
    status: 'PENDING',
    startDate: '',
    endDate: ''
  });

  // State to control showing shelter ID input modal
  const [showShelterInput, setShowShelterInput] = useState(false);
  const [shelterIdInput, setShelterIdInput] = useState('');
  const [shelterNameInput, setShelterNameInput] = useState('');

  // =========================
  // FETCH DATA FOR THIS SHELTER (TEMPORARY)
  // =========================
  const fetchAllData = async (shelterId) => {
    if (!shelterId) return;
    
    setIsLoading(true);
    try {
      console.log(`📊 Fetching data for shelter License: ${shelterId}`);
      
      // Clear previous data first
      setDonations([]);
      setDonationRequests([]);
      setShelterTotalReceived(0);
      setShelterThisMonth(0);
      setActiveCampaigns(0);

      // Try shelter-specific endpoints first
      try {
        // Use shelter-specific endpoints
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

  // Method 1: Use shelter-specific endpoints
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
      
      // Count active campaigns (now includes PENDING, PROCESSING, and ACTIVE)
      const active = (requestsRes.data || []).filter(req => 
        req.status === 'PENDING' || req.status === 'PROCESSING' || req.status === 'ACTIVE'
      ).length;
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
      
      // Count active campaigns (now includes PENDING, PROCESSING, and ACTIVE)
      const active = shelterRequests.filter(req => 
        req.status === 'PENDING' || req.status === 'PROCESSING' || req.status === 'ACTIVE'
      ).length;
      setActiveCampaigns(active);
      
      console.log(`✅ Filtered ${shelterDonations.length} donations for shelter ${shelterId}`);
      
    } catch (error) {
      console.error('Error in fallback method:', error);
      throw error;
    }
  };

  // =========================
  // LOAD SHELTER DATA (TEMPORARY - NO LOGIN)
  // =========================
  const loadShelterData = async () => {
    if (!shelterIdInput || shelterIdInput.trim() === '') {
      alert('Please enter a valid Shelter License Number');
      return false;
    }

    if (!shelterNameInput || shelterNameInput.trim() === '') {
      alert('Please enter your Shelter Name');
      if (shelterNameInputRef.current) {
        shelterNameInputRef.current.focus();
      }
      return false;
    }

    const shelterId = shelterIdInput.trim().toUpperCase();
    const shelterName = shelterNameInput.trim();
    
    setIsLoading(true);

    try {
      console.log(`🔍 Loading data for shelter: ${shelterName} (${shelterId})`);
      
      // Create shelter object with entered ID and name
      const shelterData = {
        id: shelterId,
        name: shelterName,
        licenseNumber: shelterId
      };
      
      // Update state (no localStorage)
      setCurrentShelter(shelterData);
      setShelterIdInput('');
      setShelterNameInput('');
      setShowShelterInput(false);
      
      // Auto-populate request form
      setRequestForm(prev => ({
        ...prev,
        shelterId: shelterData.id,
        shelterName: shelterData.name
      }));
      
      // Fetch data for this shelter
      await fetchAllData(shelterData.id);
      
      console.log(`✅ Loaded data for shelter ${shelterName} (${shelterId})`);
      return true;
      
    } catch (error) {
      console.error('Error loading shelter data:', error);
      alert(`Error loading data: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // CLEAR SHELTER DATA
  // =========================
  const clearShelterData = () => {
    // Clear all state (no localStorage to clear)
    setCurrentShelter(null);
    setDonations([]);
    setDonationRequests([]);
    setShelterTotalReceived(0);
    setShelterThisMonth(0);
    setActiveCampaigns(0);
    setSearchQuery('');
    
    // Reset request form
    setRequestForm(prev => ({
      ...prev,
      shelterId: '',
      shelterName: ''
    }));
    
    console.log('🧹 Cleared shelter data');
  };

  // Refresh data
  const handleRefresh = () => {
    if (currentShelter) {
      console.log(`🔄 Refreshing data for shelter ${currentShelter.name}`);
      fetchAllData(currentShelter.id);
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

  // =========================
  // SUBMIT NEW DONATION REQUEST WITH CONTINUOUS ENTRY
  // =========================
  const submitRequest = async (e) => {
    e.preventDefault();
    
    // Check if shelter is loaded
    if (!currentShelter) {
      alert('Please load shelter data first to create a campaign');
      setShowShelterInput(true);
      return;
    }
    
    try {
      // Basic validation
      if (!requestForm.title.trim()) {
        alert('Please enter a campaign title');
        return;
      }
      
      if (!requestForm.description.trim()) {
        alert('Please enter a campaign description');
        return;
      }
      
      if (!requestForm.targetAmount || parseFloat(requestForm.targetAmount) <= 0) {
        alert('Please enter a valid target amount');
        return;
      }
      
      if (!requestForm.startDate) {
        alert('Please select a start date');
        return;
      }
      
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

      // Ensure shelter ID and name are from current shelter
      const payload = {
        ...requestForm,
        shelterId: currentShelter.id,
        shelterName: currentShelter.name,
        imageUrl: finalImageUrl || '/images/default-donation.jpg',
        targetAmount: parseFloat(requestForm.targetAmount),
        currentAmount: 0, // Always start with 0 for new campaigns
        status: 'PENDING' // New campaigns start as PENDING
      };

      delete payload.imageFile;

      console.log('📤 Submitting campaign:', payload);
      
      const res = await axios.post('http://localhost:8084/api/donation-requests', payload);
      
      // Add new campaign to the list
      setDonationRequests([res.data, ...donationRequests]);
      
      // Update stats
      const activeCount = donationRequests.filter(req => 
        req.status === 'PENDING' || req.status === 'PROCESSING' || req.status === 'ACTIVE'
      ).length + 1;
      setActiveCampaigns(activeCount);
      
      // Don't close the form for continuous entry
      resetRequestForm();
      
      // Show success message but keep form open
      alert('Campaign created successfully! You can create another campaign.');
      
    } catch (error) {
      console.error('Error creating donation request:', error);
      alert(`Failed to create campaign: ${error.response?.data?.message || error.message}`);
    }
  };

  // =========================
  // SUBMIT UPDATE DONATION REQUEST
  // =========================
  const submitUpdate = async (e) => {
    e.preventDefault();
    
    // Check if shelter is loaded
    if (!currentShelter) {
      alert('Please load shelter data first to update a campaign');
      setShowShelterInput(true);
      return;
    }
    
    try {
      // Basic validation
      if (!updateForm.title.trim()) {
        alert('Please enter a campaign title');
        return;
      }
      
      if (!updateForm.description.trim()) {
        alert('Please enter a campaign description');
        return;
      }
      
      if (!updateForm.targetAmount || parseFloat(updateForm.targetAmount) <= 0) {
        alert('Please enter a valid target amount');
        return;
      }
      
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

      const currentAmount = parseFloat(updateForm.currentAmount) || 0;
      const targetAmount = parseFloat(updateForm.targetAmount);
      
      // Determine status based on donations
      let newStatus = updateForm.status;
      if (currentAmount > 0 && currentAmount < targetAmount) {
        newStatus = 'PROCESSING'; // Partial donations received
      } else if (currentAmount >= targetAmount) {
        newStatus = 'ACTIVE'; // Target reached, waiting for admin approval
      }

      const payload = {
        ...updateForm,
        imageUrl: finalImageUrl || updateForm.imageUrl || '/images/default-donation.jpg',
        targetAmount: targetAmount,
        currentAmount: currentAmount,
        status: newStatus
      };

      delete payload.imageFile;

      console.log('📤 Updating campaign:', payload);
      
      const res = await axios.put(
        `http://localhost:8084/api/donation-requests/${updateForm.id}`,
        payload
      );
      
      // Update the campaign in the list
      const updatedRequests = donationRequests.map((d) => 
        d.id === updateForm.id ? res.data : d
      );
      setDonationRequests(updatedRequests);
      
      // Update active campaigns count
      const activeCount = updatedRequests.filter(req => 
        req.status === 'PENDING' || req.status === 'PROCESSING' || req.status === 'ACTIVE'
      ).length;
      setActiveCampaigns(activeCount);
      
      // Update total received if this campaign received donations
      if (currentAmount > 0) {
        // Find all donations for this campaign and update total
        const campaignDonations = donations.filter(d => 
          d.donationRequestId === updateForm.id
        );
        const campaignTotal = campaignDonations.reduce((sum, d) => 
          sum + parseFloat(d.amount || 0), 0
        );
        
        // Recalculate shelter total
        const newTotal = donations.reduce((sum, d) => {
          if (d.donationRequestId === updateForm.id) {
            return sum + campaignTotal;
          }
          return sum + parseFloat(d.amount || 0);
        }, 0);
        
        setShelterTotalReceived(newTotal);
      }
      
      setShowUpdateForm(false);
      resetUpdateForm();
      alert('Campaign updated successfully!');
      
    } catch (error) {
      console.error('Error updating donation request:', error);
      alert(`Failed to update campaign: ${error.response?.data?.message || error.message}`);
    }
  };

  // =========================
  // MARK CAMPAIGN AS SUCCESS (ADMIN FUNCTION)
  // =========================
  const markCampaignAsSuccess = async (campaignId) => {
    try {
      // Find the campaign
      const campaign = donationRequests.find(req => req.id === campaignId);
      if (!campaign) {
        alert('Campaign not found');
        return;
      }
      
      const currentAmount = parseFloat(campaign.currentAmount || 0);
      const targetAmount = parseFloat(campaign.targetAmount || 1);
      
      // Check if target amount has been reached
      if (currentAmount < targetAmount) {
        alert(`Cannot mark as SUCCESS yet. Current: $${currentAmount}, Target: $${targetAmount}. Campaign needs to reach its target first.`);
        return;
      }
      
      if (!window.confirm(`Mark campaign "${campaign.title}" as SUCCESS?\n\nThis will complete the campaign and show it as successfully completed.`)) {
        return;
      }
      
      const payload = {
        ...campaign,
        status: 'SUCCESS'
      };
      
      const res = await axios.put(
        `http://localhost:8084/api/donation-requests/${campaignId}`,
        payload
      );
      
      // Update the campaign in the list
      const updatedRequests = donationRequests.map((d) => 
        d.id === campaignId ? res.data : d
      );
      setDonationRequests(updatedRequests);
      
      // Update active campaigns count
      const activeCount = updatedRequests.filter(req => 
        req.status === 'PENDING' || req.status === 'PROCESSING' || req.status === 'ACTIVE'
      ).length;
      setActiveCampaigns(activeCount);
      
      // Show success message
      alert(`Campaign "${campaign.title}" marked as SUCCESS!\n\nTotal raised: $${formatCurrency(currentAmount)}`);
      
      // Refresh to show updated status
      handleRefresh();
      
    } catch (error) {
      console.error('Error marking campaign as success:', error);
      alert(`Failed to update campaign: ${error.response?.data?.message || error.message}`);
    }
  };

  // Reset forms
  const resetRequestForm = () => {
    setRequestForm({
      shelterId: currentShelter?.id || '',
      shelterName: currentShelter?.name || '',
      title: '',
      description: '',
      imageUrl: '',
      imageFile: null,
      targetAmount: '',
      currentAmount: '0',
      status: 'PENDING',
      startDate: new Date().toISOString().split('T')[0],
      endDate: ''
    });
    
    // Clear file input if exists
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
      status: 'PENDING',
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
      status: request.status || 'PENDING',
      startDate: request.startDate?.split('T')[0] || '',
      endDate: request.endDate?.split('T')[0] || ''
    });
    setShowUpdateForm(true);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return parseFloat(amount || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Get status badge color and icon
  const getStatusInfo = (status) => {
    switch(status) {
      case 'PENDING':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: <Clock className="w-3 h-3 mr-1" />,
          label: 'PENDING'
        };
      case 'PROCESSING':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: <AlertCircle className="w-3 h-3 mr-1" />,
          label: 'PROCESSING'
        };
      case 'ACTIVE':
        return {
          color: 'bg-purple-100 text-purple-800',
          icon: <CheckCircle className="w-3 h-3 mr-1" />,
          label: 'ACTIVE'
        };
      case 'SUCCESS':
        return {
          color: 'bg-green-100 text-green-800',
          icon: <CheckCircle className="w-3 h-3 mr-1" />,
          label: 'SUCCESS'
        };
      case 'CANCELLED':
        return {
          color: 'bg-red-100 text-red-800',
          icon: <X className="w-3 h-3 mr-1" />,
          label: 'CANCELLED'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: null,
          label: status || 'UNKNOWN'
        };
    }
  };

  // Filter donations based on search
  const filteredDonations = donations.filter((d) =>
    d.donorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.donationRequestId?.toString().includes(searchQuery)
  );

  // =========================
  // SHELTER INPUT MODAL - UPDATED
  // =========================
  const ShelterInputModal = () => (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <div className="flex items-center gap-3 mb-4">
          <Building className="w-8 h-8 text-green-500" />
          <h2 className="text-xl font-bold text-gray-900">Load Shelter Data</h2>
        </div>
        
        <p className="text-gray-600 mb-6">
          Enter your Shelter License Number and Name to load and view your donation data temporarily.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shelter License Number *
            </label>
            <input
              type="text"
              placeholder="Enter License Number"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={shelterIdInput}
              onChange={(e) => setShelterIdInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  if (shelterNameInputRef.current) {
                    shelterNameInputRef.current.focus();
                  }
                }
              }}
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter your official shelter license number
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shelter Name *
            </label>
            <input
              ref={shelterNameInputRef}
              type="text"
              placeholder="Enter your Shelter Name"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={shelterNameInput}
              onChange={(e) => setShelterNameInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && shelterIdInput.trim() && shelterNameInput.trim()) {
                  loadShelterData();
                }
              }}
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the name of your shelter
            </p>
          </div>
          
          <div className="flex gap-3 pt-2">
            <button
              onClick={loadShelterData}
              disabled={isLoading || !shelterIdInput.trim() || !shelterNameInput.trim()}
              className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Loading...' : 'Load Data'}
            </button>
            
            <button
              onClick={() => {
                setShowShelterInput(false);
                setShelterIdInput('');
                setShelterNameInput('');
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
  // CAMPAIGN PROGRESS COMPONENT
  // =========================
  const CampaignProgress = ({ campaign }) => {
    const currentAmount = parseFloat(campaign.currentAmount || 0);
    const targetAmount = parseFloat(campaign.targetAmount || 1);
    const progress = Math.min((currentAmount / targetAmount) * 100, 100);
    const statusInfo = getStatusInfo(campaign.status);
    
    return (
      <div className="mt-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">
            Raised: ${formatCurrency(currentAmount)} of ${formatCurrency(targetAmount)}
          </span>
          <span className="font-medium">{progress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              campaign.status === 'SUCCESS' ? 'bg-green-500' : 
              campaign.status === 'PENDING' ? 'bg-yellow-500' : 
              campaign.status === 'PROCESSING' ? 'bg-blue-500' : 
              campaign.status === 'ACTIVE' ? 'bg-purple-500' : 
              campaign.status === 'CANCELLED' ? 'bg-red-500' : 'bg-gray-300'
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">
            {campaign.status === 'PENDING' ? 'Awaiting donations' :
             campaign.status === 'PROCESSING' ? 'Partial donations received' :
             campaign.status === 'ACTIVE' ? 'Target reached - Ready for admin approval' :
             campaign.status === 'SUCCESS' ? 'Campaign completed successfully' :
             campaign.status === 'CANCELLED' ? 'Campaign cancelled' :
             'Unknown status'}
          </span>
          {campaign.status === 'ACTIVE' && (
            <button
              onClick={() => markCampaignAsSuccess(campaign.id)}
              className="text-xs text-green-600 hover:text-green-700 underline"
            >
              Mark as Success
            </button>
          )}
        </div>
      </div>
    );
  };

  // =========================
  // RENDER
  // =========================
  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="p-4 md:p-8">

        {/* Header with Shelter Info */}
        <div className="mb-6 md:mb-8">
          <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm mb-4">
            {currentShelter ? (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Building className="w-8 h-8 text-green-500" />
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{currentShelter.name}</h2>
                      <p className="text-sm text-gray-600">Shelter Dashboard (Temporary View)</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm">
                    <div>
                      <span className="text-gray-500">License No:</span>
                      <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded">{currentShelter.licenseNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        Temporary Data
                      </span>
                      <button
                        onClick={clearShelterData}
                        className="text-red-600 hover:text-red-700 text-sm underline"
                        title="Clear loaded data"
                      >
                        Clear Data
                      </button>
                      <button
                        onClick={() => {
                          setShowShelterInput(true);
                          setShelterIdInput('');
                          setShelterNameInput('');
                        }}
                        className="text-blue-600 hover:text-blue-700 text-sm underline"
                        title="Load different shelter data"
                      >
                        Load Different Shelter
                      </button>
                    </div>
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
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm transition-colors"
                    onClick={() => {
                      if (!currentShelter) {
                        alert('Please load shelter data first to export');
                        setShowShelterInput(true);
                        return;
                      }
                      alert('Export functionality coming soon!');
                    }}
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>

                  <button
                    onClick={() => {
                      if (!currentShelter) {
                        alert('Please load shelter data first to create a campaign');
                        setShowShelterInput(true);
                        return;
                      }
                      setShowRequestForm(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm transition-colors"
                  >
                    <PlusCircle className="w-4 h-4" />
                    New Campaign
                  </button>

                  <button
                    onClick={() => {
                      if (!currentShelter) {
                        alert('Please load shelter data first to update a campaign');
                        setShowShelterInput(true);
                        return;
                      }
                      // Show campaign selection first
                      setUpdateForm({
                        id: '',
                        shelterId: currentShelter.id,
                        shelterName: currentShelter.name,
                        title: '',
                        description: '',
                        imageUrl: '',
                        imageFile: null,
                        targetAmount: '',
                        currentAmount: '',
                        status: 'PENDING',
                        startDate: '',
                        endDate: ''
                      });
                      setShowUpdateForm(true);
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
                      <span className="text-gray-500">Status:</span>
                      <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded text-gray-400">No Data Loaded</span>
                    </div>
                    
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 md:gap-3">
                  <button 
                    onClick={() => {
                      setShowShelterInput(true);
                      setShelterIdInput('');
                      setShelterNameInput('');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm transition-colors"
                  >
                    <Building className="w-4 h-4" />
                    Load Shelter Data
                  </button>
                  
                  <button 
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm transition-colors opacity-50 cursor-not-allowed"
                    onClick={() => {
                      alert('Please load shelter data first to export');
                    }}
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>

                  <button
                    onClick={() => {
                      alert('Please load shelter data first to create a campaign');
                      setShowShelterInput(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm transition-colors opacity-70"
                  >
                    <PlusCircle className="w-4 h-4" />
                    New Campaign
                  </button>

                  <button
                    onClick={() => {
                      alert('Please load shelter data first to update a campaign');
                      setShowShelterInput(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm transition-colors opacity-70"
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
              <div className={`bg-white p-4 md:p-6 rounded-xl border shadow-sm ${!currentShelter ? 'opacity-50' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Total Received</p>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {currentShelter ? 'Shelter Only' : 'Load Data First'}
                  </span>
                </div>
                <p className="text-2xl md:text-3xl font-bold mt-1">
                  ${formatCurrency(shelterTotalReceived)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {currentShelter ? 'All donations to your campaigns' : 'Load Shelter License to view data'}
                </p>
              </div>
              
              <div className={`bg-white p-4 md:p-6 rounded-xl border shadow-sm ${!currentShelter ? 'opacity-50' : ''}`}>
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
                  {currentShelter ? 'Donations this month' : 'Load Shelter License to view monthly data'}
                </p>
              </div>
              
              <div className={`bg-white p-4 md:p-6 rounded-xl border shadow-sm ${!currentShelter ? 'opacity-50' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Campaigns</p>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                    {currentShelter ? `Active: ${activeCampaigns}` : 'Load Data First'}
                  </span>
                </div>
                <p className="text-2xl md:text-3xl font-bold mt-1">
                  {donationRequests.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {currentShelter ? 'Total campaigns' : 'No campaigns until shelter loaded'}
                </p>
              </div>
            </div>

            {/* Campaigns Section */}
            {currentShelter && donationRequests.length > 0 && (
              <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm mb-6">
                <h3 className="text-lg font-semibold mb-4">Campaigns Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {donationRequests.map(campaign => {
                    const statusInfo = getStatusInfo(campaign.status);
                    return (
                      <div key={campaign.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900 truncate">{campaign.title}</h4>
                          <span className={`flex items-center px-2 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>
                            {statusInfo.icon}
                            {statusInfo.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{campaign.description}</p>
                        <CampaignProgress campaign={campaign} />
                        <div className="flex justify-end mt-3">
                          <button
                            onClick={() => selectDonationForUpdate(campaign)}
                            className="text-xs text-blue-600 hover:text-blue-700 underline"
                          >
                            Edit Campaign
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Search Bar - Show always */}
            <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm mb-6">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    placeholder={currentShelter ? "Search by donor name or campaign ID" : "Load Shelter License first to search"}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={!currentShelter}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${!currentShelter ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  />
                </div>
                {searchQuery && currentShelter && (
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
                  {currentShelter ? (
                    <>Showing donations for <span className="font-medium">{currentShelter.name}</span> only</>
                  ) : (
                    <>Load a shelter to view donation data</>
                  )}
                </p>
                {currentShelter && (
                  <p className="text-xs text-gray-500">
                    {filteredDonations.length} of {donations.length} donations
                  </p>
                )}
              </div>
            </div>

            {/* Table - Show always */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              {!currentShelter ? (
                <div className="p-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg font-medium mb-3">No Shelter Data Loaded</p>
                    <p className="text-sm text-gray-600 mb-6 max-w-md">
                      Enter your Shelter License Number and Name to temporarily load and view your donation campaigns and history.
                    </p>
                    <button
                      onClick={() => {
                        setShowShelterInput(true);
                        setShelterIdInput('');
                        setShelterNameInput('');
                      }}
                      className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium transition-colors flex items-center gap-2"
                    >
                      <Building className="w-5 h-5" />
                      Load Shelter Data to Get Started
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
                        ? "This shelter hasn't created any donation campaigns yet."
                        : "This shelter has campaigns but no donations yet."
                      }
                    </p>
                    {donationRequests.length === 0 ? (
                      <button
                        onClick={() => setShowRequestForm(true)}
                        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Create First Campaign
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
                                  : d.status === 'PROCESSING'
                                  ? 'bg-blue-100 text-blue-800'
                                  : d.status === 'ACTIVE'
                                  ? 'bg-purple-100 text-purple-800'
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
                <div>
                  <h2 className="text-xl font-bold">Donation Receipt</h2>
                  {currentShelter && (
                    <p className="text-sm text-gray-600">Shelter: {currentShelter.name}</p>
                  )}
                </div>
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
                {/* SHELTER LICENSE IN RECEIPT */}
                {currentShelter && (
                  <div className="flex justify-between">
                    <span className="font-medium">Beneficiary License:</span>
                    <span className="font-mono">{currentShelter.licenseNumber}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    selectedDonation.status === 'SUCCESS' ? 'bg-green-100 text-green-800' :
                    selectedDonation.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    selectedDonation.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                    selectedDonation.status === 'ACTIVE' ? 'bg-purple-100 text-purple-800' :
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
                <h2 className="text-xl font-bold">Create New Campaign</h2>
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
              
              {/* Current shelter info */}
              {currentShelter && (
                <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Building className="w-6 h-6 text-green-500" />
                      <div>
                        <p className="font-medium">Creating campaign for: {currentShelter.name}</p>
                        <p className="text-sm text-gray-600">Shelter License No: {currentShelter.licenseNumber}</p>
                        <p className="text-xs text-green-600 mt-1">
                          ⓘ New campaigns start as PENDING. Status will update automatically when donations are received.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full">
                      Data Loaded
                    </span>
                  </div>
                </div>
              )}
              
              <form onSubmit={submitRequest} className="space-y-4">
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
                    <p className="text-xs text-gray-500 mt-1">
                      Campaign will start as PENDING with $0 received
                    </p>
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

                {/* Status Info */}
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Campaign Status Flow</p>
                      <p className="text-xs text-yellow-700">
                        New campaigns start as <span className="font-semibold">PENDING</span>:
                      </p>
                      <ul className="text-xs text-yellow-700 mt-1 list-disc pl-4">
                        <li><span className="font-medium">PENDING</span>: No donations received yet</li>
                        <li><span className="font-medium">PROCESSING</span>: Partial donations received</li>
                        <li><span className="font-medium">ACTIVE</span>: Target amount reached (admin can mark as SUCCESS)</li>
                        <li><span className="font-medium">SUCCESS</span>: Campaign completed successfully (admin approved)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Hidden shelter fields */}
                <input type="hidden" name="shelterId" value={currentShelter?.id || ''} />
                <input type="hidden" name="shelterName" value={currentShelter?.name || ''} />

                <div className="flex justify-between gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRequestForm(false);
                      resetRequestForm();
                    }}
                    className="px-5 py-2.5 border rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    Cancel & Close
                  </button>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={resetRequestForm}
                      className="px-5 py-2.5 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 font-medium transition-colors"
                    >
                      Clear Form
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium transition-colors"
                    >
                      Create & Add Another
                    </button>
                  </div>
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
                <h2 className="text-xl font-bold">Update Campaign</h2>
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
                      No campaigns available for {currentShelter?.name}
                    </div>
                  ) : (
                    donationRequests.map(req => {
                      const statusInfo = getStatusInfo(req.status);
                      return (
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
                              ${formatCurrency(req.currentAmount)} / ${formatCurrency(req.targetAmount)}
                            </p>
                            <span className={`flex items-center text-xs px-2 py-1 rounded-full ${statusInfo.color}`}>
                              {statusInfo.icon}
                              {statusInfo.label}
                            </span>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              ) : (
                <form onSubmit={submitUpdate} className="space-y-4">
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
                        Current Amount *
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
                          required
                          className="w-full border p-2.5 pl-8 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Update this when donations are received
                      </p>
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
                        <option value="PENDING">PENDING</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="SUCCESS">SUCCESS</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        ACTIVE = Target reached, SUCCESS = Admin approved
                      </p>
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

                  {/* Status info box */}
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 mb-1">Status Rules:</p>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• <span className="font-medium">PENDING</span>: $0 received (default for new campaigns)</li>
                      <li>• <span className="font-medium">PROCESSING</span>: Some donations but below target</li>
                      <li>• <span className="font-medium">ACTIVE</span>: Target reached (admin must mark as SUCCESS)</li>
                      <li>• <span className="font-medium">SUCCESS</span>: Admin approved completed campaign</li>
                    </ul>
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
                      Update Campaign
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