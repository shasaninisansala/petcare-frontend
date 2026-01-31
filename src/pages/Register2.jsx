import React, { useState } from 'react';
import { PawPrint } from 'lucide-react';
import { Link } from "react-router-dom";

export default function RegisterPageStep2() {
  const [selectedRole, setSelectedRole] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedRole) {
      alert('Please select a role');
      return;
    }
    if (!agreedToTerms) {
      alert('Please agree to the Terms & Conditions');
      return;
    }
    // Add your form submission logic here
    console.log('Account created with role:', selectedRole);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
             <PawPrint className="w-7 h-7 text-primary" />
             <span className="text-2xl font-bold text-primary">PetCare</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Already a member?</span>
            <a href="/login" className="text-sm text-green-600 hover:text-green-700 font-medium border border-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition">
              Log in
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Progress Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-green-600">Registration Progress</h3>
            <span className="text-sm font-medium text-gray-700">Step 2 of 2</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-green-500 h-2.5 rounded-full transition-all duration-300" style={{ width: '100%' }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Finalizing your profile and account settings</p>
        </div>

        {/* Choose Role Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Choose Your Role</h1>
          <p className="text-gray-600">Select the option that best describes how you'll use PetCare</p>
        </div>

        {/* Role Cards */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Pet Owner Card */}
            <div
              onClick={() => handleRoleSelect('pet-owner')}
              className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${
                selectedRole === 'pet-owner'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 bg-white hover:border-green-300'
              }`}
            >
              {/* Checkmark */}
              {selectedRole === 'pet-owner' && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              )}

              {/* Icon */}
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C10.34 2 9 3.34 9 5c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3zm6 8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM6 10c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm6 8c-2 0-6 1-6 3v2h12v-2c0-2-4-3-6-3z"/>
                </svg>
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-gray-900 mb-2">Pet Owner</h3>
              <p className="text-sm text-gray-600">Track your pet's health, medical records, and daily habits.</p>
            </div>

            {/* Shelter Card */}
            <div
              onClick={() => handleRoleSelect('shelter')}
              className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${
                selectedRole === 'shelter'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 bg-white hover:border-green-300'
              }`}
            >
              {/* Checkmark */}
              {selectedRole === 'shelter' && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              )}

              {/* Icon */}
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
              </div>

              {/* Content */}
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold text-gray-900">Shelter</h3>
                <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded">Verified</span>
              </div>
              <p className="text-sm text-gray-600">Admin verification required for professional shelter access.</p>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start gap-3 mb-6">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              By continuing, I agree to PetCare's{' '}
              <a href="/terms" className="text-green-600 hover:text-green-700 font-medium">
                Terms & Conditions
              </a>
              {' '}and{' '}
              <a href="/privacy" className="text-green-600 hover:text-green-700 font-medium">
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Create Account Button */}
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 mb-4"
          >
            Create Account
          </button>

          {/* Back to Step 1 */}
          <button
            type="button"
            onClick={() => window.history.back()}
            className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 flex items-center justify-center gap-2 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to step 1
          </button>
        </form>
      </main>

      {/* Footer */}
      <footer className="text-center py-8">
        <p className="text-xs text-gray-500">© 2024 PetCare Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}