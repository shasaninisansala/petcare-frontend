import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Utensils, Heart, Home, Target, TrendingUp, Users, Calendar, DollarSign, Building, MapPin } from 'lucide-react';

export default function DonationDetailsPage() {
  const { requestId: paramRequestId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Allow requestId from URL param OR navigation state
  const requestId = paramRequestId || location.state?.requestId;
  
  // Get additional data from location state
  const {
    requestTitle = '',
    requestDescription = '',
    shelterName = '',
    targetAmount = '',
    currentAmount = '',
    imageUrl = ''
  } = location.state || {};

  const [donationRequest, setDonationRequest] = useState(null);
  const [purpose, setPurpose] = useState(null);
  const [amount, setAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!requestId) {
      setLoading(false);
      return;
    }

    console.log('Fetching donation request with ID:', requestId);

    axios
      .get(`http://localhost:8084/api/donation-requests/${requestId}`)
      .then((res) => {
        console.log('Backend response:', res.data);
        setDonationRequest(res.data);
        
        // Calculate progress percentage
        if (res.data.targetAmount && res.data.currentAmount) {
          const target = parseFloat(res.data.targetAmount);
          const current = parseFloat(res.data.currentAmount);
          if (target > 0) {
            const progressCalc = (current / target) * 100;
            setProgress(Math.min(100, Math.round(progressCalc * 10) / 10));
          }
        }
      })
      .catch((err) => {
        console.error('Axios error:', err);
        // Create fallback data from location state
        setDonationRequest({
          id: requestId,
          title: requestTitle || 'Unknown Campaign',
          description: requestDescription || 'No description available',
          shelterName: shelterName || 'Unknown Shelter',
          shelterId: 1,
          targetAmount: targetAmount || '1000',
          currentAmount: currentAmount || '0',
          status: 'OPEN',
          imageUrl: imageUrl || '',
          createdAt: new Date().toISOString()
        });
      })
      .finally(() => setLoading(false));
  }, [requestId, requestTitle, requestDescription, shelterName, targetAmount, currentAmount, imageUrl]);

  const finalAmount = Number(customAmount || amount);

  const continueToPayment = () => {
    if (!purpose || finalAmount <= 0) {
      alert('Select purpose and enter a valid amount');
      return;
    }

    // Get the correct donation request ID
    const currentRequestId = donationRequest?.id || requestId;

    console.log('Navigating to payment with donationRequestId:', currentRequestId);

    navigate('/donate/payment', {
      state: {
        donationRequest, // Pass the entire donation request object
        purpose,
        amount: finalAmount,
        donationRequestId: currentRequestId, // This is the critical fix!
        shelter: {
          title: donationRequest?.shelterName || 'Animal Shelter',
          id: donationRequest?.shelterId || 1,
          name: donationRequest?.shelterName || 'Animal Shelter'
        }
      },
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return '0.00';
    try {
      return parseFloat(amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    } catch (error) {
      return '0.00';
    }
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

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading donation details...</p>
      </div>
    </div>
  );

  if (!requestId)
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white max-w-md w-full rounded-3xl shadow-xl p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Campaign Selected</h2>
          <p className="text-gray-600 mb-6">
            Please select a campaign to donate from the donations page.
          </p>
          <button
            onClick={() => navigate('/donate')}
            className="w-full bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition"
          >
            Browse Campaigns
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-4">
      <div className="max-w-lg mx-auto">
        {/* Campaign Details Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6">
          {/* Campaign Header with Status */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  donationRequest?.status === 'OPEN' ? 'bg-green-500 text-white' :
                  donationRequest?.status === 'COMPLETED' ? 'bg-blue-500 text-white' :
                  'bg-red-500 text-white'
                }`}>
                  {donationRequest?.status || 'OPEN'}
                </span>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-500">Campaign ID</p>
                <p className="font-mono text-sm font-bold text-gray-700">{donationRequest?.id || 'N/A'}</p>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{donationRequest?.title}</h1>
            
            <p className="text-gray-600 mb-4">{donationRequest?.description}</p>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>${formatCurrency(donationRequest?.currentAmount)} raised</span>
                <span>Goal: ${formatCurrency(donationRequest?.targetAmount)}</span>
              </div>
            </div>
            
            {/* Shelter Info */}
            <div className="flex items-center gap-2 text-gray-700 mb-4">
              <Building className="w-4 h-4 text-gray-500" />
              <span className="font-medium">{donationRequest?.shelterName || 'Unknown Shelter'}</span>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-500">Shelter ID: {donationRequest?.shelterId || 'N/A'}</span>
            </div>
            
            {/* Campaign ID & Date */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                <span>Created: {formatDate(donationRequest?.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Donation Purpose */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-green-500" />
              Donation Purpose
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'food', icon: Utensils, label: 'Food', description: 'For animal food supplies' },
                { id: 'medical', icon: Heart, label: 'Medical', description: 'For medical treatments' },
                { id: 'shelter', icon: Home, label: 'Shelter', description: 'For shelter maintenance' },
              ].map((p) => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPurpose(p.id)}
                    className={`p-4 rounded-xl text-center transition-all border-2 ${
                      purpose === p.id
                        ? 'border-green-500 bg-green-50 text-green-700 shadow-md scale-[1.03]'
                        : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`mx-auto mb-2 w-6 h-6 ${
                      purpose === p.id ? 'text-green-600' : 'text-gray-600'
                    }`} />
                    <p className="font-medium text-sm">{p.label}</p>
                    <p className="text-xs text-gray-500 mt-1">{p.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount Selection */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              Donation Amount
            </h2>
            
            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[10, 25, 50].map((a) => (
                <button
                  key={a}
                  onClick={() => {
                    setAmount(a);
                    setCustomAmount('');
                  }}
                  className={`py-4 rounded-xl font-bold text-lg border-2 transition-all ${
                    amount === a && !customAmount
                      ? 'border-green-500 bg-green-500 text-white shadow-md'
                      : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  ${a}
                </button>
              ))}
            </div>
            
            {/* Custom Amount Input */}
            <div className="relative">
              <DollarSign className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="number"
                placeholder="Enter custom amount"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  if (e.target.value) {
                    setAmount(0); // Clear preset amount when custom is entered
                  }
                }}
                min="1"
                step="1"
                className="w-full border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              />
            </div>
            
            {/* Selected Amount Display */}
            {finalAmount > 0 && (
              <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-200">
                <div className="flex justify-between items-center">
                  <span className="text-green-700 font-medium">Your Donation:</span>
                  <span className="text-xl font-bold text-green-700">${finalAmount.toFixed(2)}</span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  This will help {donationRequest?.shelterName} reach their goal!
                </p>
              </div>
            )}
          </div>

          {/* Continue Button */}
          <div className="p-6">
            <button
              onClick={continueToPayment}
              disabled={!purpose || finalAmount <= 0}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
                purpose && finalAmount > 0
                  ? 'bg-green-500 text-white hover:bg-green-600 hover:shadow-lg active:scale-[0.99]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {purpose && finalAmount > 0 
                ? `Donate $${finalAmount.toFixed(2)} →` 
                : 'Select Purpose & Amount'
              }
            </button>
            
            {!purpose && (
              <p className="text-center text-sm text-red-500 mt-3">
                Please select a donation purpose
              </p>
            )}
            {purpose && finalAmount <= 0 && (
              <p className="text-center text-sm text-red-500 mt-3">
                Please enter a valid donation amount
              </p>
            )}
          </div>
        </div>

        {/* Info Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="text-blue-500 mt-0.5">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Your donation goes directly to {donationRequest?.shelterName}. 
                All donations are securely processed and you'll receive a receipt via email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
