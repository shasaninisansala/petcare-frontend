import React from 'react';
import { CheckCircle, Download, Home, ArrowRight } from 'lucide-react';

export default function DonationSuccess({ donation, onBackToDonations }) {
  const handleDownloadReceipt = () => {
    // Generate PDF receipt
    console.log('Downloading receipt for:', donation);
    // Implementation would call backend API to generate PDF
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl p-8">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Thank you for your generosity!
          </h1>
          <p className="text-gray-600">
            Your contribution helps provide medical care, food, and shelter for pets
          </p>
        </div>

        {/* Receipt Details */}
        <div className="bg-green-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Donation Receipt</h3>
            <span className="text-2xl font-bold text-green-600">
              ${donation?.amount || '50.00'}
            </span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Donor Name</p>
                <p className="font-semibold text-gray-900">{donation?.donorName || 'Alex Johnson'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Shelter Name</p>
                <p className="font-semibold text-gray-900">{donation?.shelterName || 'Happy Paws Sanctuary'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Purpose</p>
                <p className="font-semibold text-gray-900">
                  {donation?.purpose === 'medical' ? 'Emergency Medical Fund' :
                   donation?.purpose === 'food' ? 'Food & Nutrition' :
                   'Shelter & Care'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Date</p>
                <p className="font-semibold text-gray-900">
                  {donation?.date || new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Transaction ID</p>
              <p className="font-semibold text-gray-900 font-mono">
                {donation?.transactionId || '#PC-9928341'}
              </p>
            </div>
          </div>

          {/* Official Receipt Badge */}
          <div className="mt-6 pt-6 border-t border-green-200">
            <div className="flex items-center gap-2 text-sm text-green-700">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
              <span className="font-medium">Official transaction receipt from PetCare Foundation</span>
            </div>
          </div>
        </div>

        {/* Status Update */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-lg">ℹ️</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">Status Update</h4>
              <p className="text-sm text-gray-600 mb-2">
                The shelter has been notified of your donation.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleDownloadReceipt}
            className="w-full bg-green-500 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download Receipt (PDF)
          </button>
          
          <button
            onClick={onBackToDonations}
            className="w-full bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Donations
          </button>
        </div>
      </div>
    </div>
  );
}