import React, { useState } from 'react';
import { X, Check, Utensils, Heart, Home, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe (replace with your publishable key)
const stripePromise = loadStripe('pk_test_YOUR_PUBLISHABLE_KEY');

export default function DonationModal({ isOpen, onClose, shelter }) {
  const [selectedPurpose, setSelectedPurpose] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState(''); // NEW
  const [isProcessing, setIsProcessing] = useState(false);

  const purposes = [
    {
      id: 'food',
      icon: Utensils,
      label: 'Food',
      description: 'Nutrition & Special Diets',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-500'
    },
    {
      id: 'medical',
      icon: Heart,
      label: 'Medical Care',
      description: 'Vaccines & Surgeries',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-500'
    },
    {
      id: 'shelter',
      icon: Home,
      label: 'Shelter & Care',
      description: 'Housing & Daily Maintenance',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500'
    }
  ];

  const amounts = [10, 25, 50];

  const handleDonate = async () => {
    if (!selectedPurpose) {
      alert('Please select a purpose for your donation');
      return;
    }

    if (!donorName) {
      alert('Please enter your name');
      return;
    }

    const donationAmount = customAmount || selectedAmount;
    if (!donationAmount || donationAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await axios.post(
        'http://localhost:8080/api/donations/create-checkout-session',
        {
          shelterId: shelter.id,
          shelterName: shelter.name,
          amount: donationAmount,
          purpose: selectedPurpose,
          donorName: donorName, // SEND TO BACKEND
          successUrl: `${window.location.origin}/donation-success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: window.location.href
        }
      );

      const { sessionId } = response.data;

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error('Stripe error:', error);
        alert('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Donation error:', error);
      alert('Failed to process donation. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-gray-900">Donate to Shelter</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Shelter Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="border-2 border-green-500 bg-green-50 rounded-lg p-4">
            <h3 className="font-bold text-gray-900">{shelter?.name}</h3>
            <p className="text-sm text-gray-600">📍 {shelter?.location}</p>
            <p className="text-sm text-gray-700">{shelter?.description}</p>
          </div>
        </div>

        {/* Donor Name */}
        <div className="p-6 border-b border-gray-200">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Your Name
          </label>
          <input
            type="text"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Purpose */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold mb-4">Select Purpose</h3>
          <div className="grid grid-cols-3 gap-3">
            {purposes.map((purpose) => {
              const Icon = purpose.icon;
              const isSelected = selectedPurpose === purpose.id;

              return (
                <button
                  key={purpose.id}
                  onClick={() => setSelectedPurpose(purpose.id)}
                  className={`p-4 rounded-lg border-2 ${
                    isSelected
                      ? `${purpose.borderColor} ${purpose.bgColor}`
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${isSelected ? purpose.color : 'text-gray-400'}`} />
                  <p className="text-sm font-semibold">{purpose.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Amount */}
        <div className="p-6">
          <h3 className="text-lg font-bold mb-4">Choose Amount</h3>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {amounts.map((amount) => (
              <button
                key={amount}
                onClick={() => {
                  setSelectedAmount(amount);
                  setCustomAmount('');
                }}
                className="py-3 rounded-lg border-2"
              >
                ${amount}
              </button>
            ))}
          </div>

          <input
            type="number"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setSelectedAmount(null);
            }}
            placeholder="Custom amount"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleDonate}
            disabled={isProcessing}
            className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            {isProcessing ? 'Processing...' : 'Proceed to Donate'}
            <ArrowRight className="inline w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
