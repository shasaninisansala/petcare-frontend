import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Home, Heart } from 'lucide-react';

export default function DonationSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const donation = location.state || {};

  const handleDownloadReceipt = () => {
    // Generate PDF receipt
    console.log('Downloading receipt for:', donation);
    
    // Create receipt content
    const receiptContent = `
      PetCare Foundation - Donation Receipt
      ====================================
      
      Thank you for your generous donation!
      
      Donation Details:
      -----------------
      Amount: $${donation.amount || '50.00'}
      Date: ${donation.date ? new Date(donation.date).toLocaleDateString() : new Date().toLocaleDateString()}
      Transaction ID: ${donation.transactionId || 'Pending'}
      Purpose: ${donation.purpose === 'medical' ? 'Emergency Medical Fund' : 
                donation.purpose === 'food' ? 'Food & Nutrition' : 
                donation.purpose === 'shelter' ? 'Shelter & Care' : 'General Donation'}
      
      Donor Information:
      ------------------
      Name: ${donation.donorName || 'Anonymous Donor'}
      Email: ${donation.email || 'Not provided'}
      
      Shelter Information:
      --------------------
      Shelter: ${donation.shelterName || 'Animal Shelter'}
      
      Payment Method:
      ---------------
      ${donation.paymentMethod || 'Card'} ending in ${donation.last4 || '4242'}
      
      This receipt is issued by PetCare Foundation.
      Your donation is tax-deductible. Keep this receipt for your records.
      
      Thank you for supporting animal welfare!
    `;
    
    // Create and download text file (in real app, generate PDF)
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donation-receipt-${donation.transactionId || Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleContinueDonation = () => {
    navigate('/donate'); // Redirects to your donation page
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F6F8F6] flex items-center justify-center p-4">
      <div className="bg-[#F6F8F6] rounded-xl w-full max-w-[684px] min-h-[900px] flex flex-col items-center p-12">
        
        {/* Main Container */}
        <div className="flex flex-col items-center gap-8 w-full max-w-[640px]">
          
          {/* Success Header */}
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-20 h-20 bg-[#D0FBD3] rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-[#13EC25]" />
            </div>
            
            <h1 className="text-3xl font-bold text-[#0D1B0F]">
              Thank you for your generosity!
            </h1>
            
            <p className="text-[#4C9A52] text-base">
              Your contribution helps provide medical care, food, and shelter for pets in need.
            </p>
          </div>

          {/* Receipt Card */}
          <div className="w-full bg-white border border-[#CFE7D1] rounded-xl">
            
            {/* Receipt Header */}
            <div className="flex justify-between items-center p-6 bg-[#F3FEF4] border-b border-[#CFE7D1] rounded-t-xl">
              <h2 className="text-xs font-bold text-[#0D1B0F] uppercase tracking-wide">
                Donation Receipt
              </h2>
              <span className="text-lg font-bold text-[#13EC25]">
                ${donation?.amount || '50.00'}
              </span>
            </div>

            {/* Receipt Details */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Donor Name */}
                <div>
                  <p className="text-xs text-[#4C9A52] mb-1">Donor Name</p>
                  <p className="text-base font-medium text-[#0D1B0F]">
                    {donation?.donorName || 'Alex Johnson'}
                  </p>
                </div>

                {/* Shelter Name */}
                <div>
                  <p className="text-xs text-[#4C9A52] mb-1">Shelter Name</p>
                  <p className="text-base font-medium text-[#0D1B0F]">
                    {donation?.shelterName || 'Happy Paws Sanctuary'}
                  </p>
                </div>

                {/* Purpose */}
                <div className="border-t border-[#F0F0F0] pt-4">
                  <p className="text-xs text-[#4C9A52] mb-1">Purpose</p>
                  <p className="text-base font-medium text-[#0D1B0F]">
                    {donation?.purpose === 'medical' ? 'Emergency Medical Fund' :
                     donation?.purpose === 'food' ? 'Food & Nutrition' :
                     donation?.purpose === 'shelter' ? 'Shelter & Care' :
                     'General Donation'}
                  </p>
                </div>

                {/* Date */}
                <div className="border-t border-[#F0F0F0] pt-4">
                  <p className="text-xs text-[#4C9A52] mb-1">Date</p>
                  <p className="text-base font-medium text-[#0D1B0F]">
                    {donation?.date ? new Date(donation.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : new Date().toLocaleDateString()}
                  </p>
                </div>

                {/* Transaction ID */}
                <div className="border-t border-[#F0F0F0] pt-4">
                  <p className="text-xs text-[#4C9A52] mb-1">Transaction ID</p>
                  <p className="text-base font-medium text-[#0D1B0F] font-mono">
                    {donation?.transactionId || '#PC-9928341'}
                  </p>
                </div>

                {/* Payment Method */}
                <div className="border-t border-[#F0F0F0] pt-4">
                  <p className="text-xs text-[#4C9A52] mb-1">Payment Method</p>
                  <p className="text-base font-medium text-[#0D1B0F]">
                    Card ending in {donation?.last4 || '4242'}
                  </p>
                </div>
              </div>
            </div>

            {/* Receipt Footer */}
            <div className="flex items-center gap-2 p-4 bg-[#F9FAFB] border-t border-[#CFE7D1] rounded-b-xl">
              <CheckCircle className="w-4 h-4 text-[#13EC25]" />
              <span className="text-xs text-[#0D1B0F]">
                Official transaction receipt from PetCare Foundation
              </span>
            </div>
          </div>

          {/* Status Update Card */}
          <div className="w-full bg-white border border-[#CFE7D1] rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 flex items-center justify-center">
                <span className="text-[#13EC25] text-xl">ℹ️</span>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-[#0D1B0F] mb-1">
                  Status Update
                </h3>
                <p className="text-sm text-[#4C9A52]">
                  The shelter has been notified of your donation.
                </p>
              </div>
              <button className="text-sm font-bold text-[#0D1B0F] flex items-center gap-1 hover:opacity-80 transition">
                Learn more
                <span className="text-[#0D1B0F]">→</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col gap-4">
            {/* Download Receipt Button */}
            <button
              onClick={handleDownloadReceipt}
              className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-[#CFE7D1] rounded-lg hover:bg-[#F3FEF4] transition"
            >
              <span className="text-base font-bold text-[#0D1B0F]">
                Download Receipt (PDF)
              </span>
              <Download className="w-6 h-6 text-[#0D1B0F]" />
            </button>

            {/* Continue Donation Button */}
            <button
              onClick={handleContinueDonation}
              className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-[#CFE7D1] rounded-lg hover:bg-[#F3FEF4] transition"
            >
              <Heart className="w-5 h-5 text-[#4C9A52]" />
              <span className="text-sm font-medium text-[#4C9A52]">
                Continue Donation
              </span>
            </button>

            {/* Back to Home Link */}
            <button
              onClick={handleBackToHome}
              className="w-full flex items-center justify-center gap-1 py-2 text-[#4C9A52] hover:text-[#3d8a43] transition"
            >
              <Home className="w-4 h-4" />
              <span className="text-sm">
                Back to Home
              </span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Need help? Contact us at <span className="text-[#13EC25] font-medium">support@petcare.org</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            PetCare Foundation is a 501(c)(3) nonprofit organization
          </p>
        </div>
      </div>
    </div>
  );
}
