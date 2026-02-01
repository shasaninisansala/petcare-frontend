import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ShelterSubmittedPopup({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    if (onClose) onClose();
    navigate('/');
  };

  const handleContactSupport = () => {
    // Add your contact support logic here
    window.location.href = 'mailto:support@petcare.com';
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop/Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 transition-opacity"></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative animate-fadeIn">
          {/* Close Button */}
          <button
            onClick={handleBackToHome}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          {/* Content */}
          <div className="p-8 text-center">
           
            <div className="mb-6 flex justify-center">
              <div className="relative">
    
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                  
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Text */}
            <p className="text-sm text-green-600 font-semibold mb-4">Registration Submitted</p>

            {/* Main Heading */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Shelter Registration Submitted!
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Your shelter registration has been submitted successfully. Admin verification usually takes up to 24 hours to ensure the safety of our animal community.
            </p>

            {/* Info Box - What happens next */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 text-left">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">What happens next?</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    You will receive an email notification once our team has verified your credentials and approved your profile.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleBackToHome}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
              >
                Back to Home
              </button>
              <button
                onClick={handleContactSupport}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition duration-200"
              >
                Contact Support
              </button>
            </div>

            {/* Footer Badge */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>PetCare Security Standard</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}