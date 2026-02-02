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

    const donationAmount = customAmount || selectedAmount;
    if (!donationAmount || donationAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setIsProcessing(true);

    try {
      // Create Stripe Checkout Session
      const response = await axios.post('http://localhost:8080/api/donations/create-checkout-session', {
        shelterId: shelter.id,
        amount: donationAmount,
        purpose: selectedPurpose,
        shelterName: shelter.name,
        successUrl: `${window.location.origin}/donation-success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: window.location.href
      });

      const { sessionId } = response.data;
      
      // Redirect to Stripe Checkout
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
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">1</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Choose a Shelter</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Shelter Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="border-2 border-green-500 bg-green-50 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900">{shelter?.name}</h3>
                  {shelter?.verified && <Check className="w-5 h-5 text-green-500" />}
                </div>
                <p className="text-sm text-gray-600 mb-2">📍 {shelter?.location}</p>
                <p className="text-sm text-gray-700">
                  {shelter?.description || 'Providing second chances for urban strays since 2010.'}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-white text-green-700 text-xs font-medium rounded-full inline-block">
              Need: Food
            </span>
          </div>
        </div>

        {/* Purpose Selection */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">2</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Select Purpose</h3>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {purposes.map((purpose) => {
              const Icon = purpose.icon;
              const isSelected = selectedPurpose === purpose.id;
              
              return (
                <button
                  key={purpose.id}
                  onClick={() => setSelectedPurpose(purpose.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? `${purpose.borderColor} ${purpose.bgColor}`
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${isSelected ? purpose.color : 'text-gray-400'}`} />
                  <p className={`font-semibold text-sm mb-1 ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                    {purpose.label}
                  </p>
                  <p className="text-xs text-gray-500">{purpose.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Amount Selection */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">3</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Choose Amount</h3>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {amounts.map((amount) => (
              <button
                key={amount}
                onClick={() => {
                  setSelectedAmount(amount);
                  setCustomAmount('');
                }}
                className={`py-3 rounded-lg border-2 font-bold transition-all ${
                  selectedAmount === amount && !customAmount
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                ${amount}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Custom Amount</label>
            <input
              type="number"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedAmount(null);
              }}
              placeholder="Enter amount"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleDonate}
            disabled={isProcessing || !selectedPurpose}
            className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Proceed to Donate'}
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-xs text-gray-500 text-center mt-3">
            By clicking "Proceed to Donate", you agree to our Terms of Service and Privacy Policy. All transactions are securely encrypted.
          </p>
        </div>
      </div>
    </div>
  );
}