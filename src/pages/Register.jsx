import React, { useState } from 'react';
import { PawPrint } from 'lucide-react';
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [passwordStrength, setPasswordStrength] = useState('');

  const calculatePasswordStrength = (password) => {
    if (password.length === 0) return '';
    if (password.length < 6) return 'WEAK';
    if (password.length < 10) return 'MEDIUM';
    return 'GOOD';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log('Form submitted:', formData);
  };

  const getStrengthColor = () => {
    if (passwordStrength === 'WEAK') return '#ef4444';
    if (passwordStrength === 'MEDIUM') return '#f59e0b';
    if (passwordStrength === 'GOOD') return '#10b981';
    return '#e5e7eb';
  };

  const getStrengthWidth = () => {
    if (passwordStrength === 'WEAK') return '33%';
    if (passwordStrength === 'MEDIUM') return '66%';
    if (passwordStrength === 'GOOD') return '100%';
    return '0%';
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section */}
      <div className="lg:w-2/5 bg-green-500 text-white relative flex flex-col">

        <div className="p-7 sm:p-8 lg:p-12 flex-1 flex flex-col justify-start">
          <div className="flex items-center gap-2 p-4">
            <PawPrint className="w-7 h-7 text-white " />
            <span className="text-2xl font-bold text-white ">PetCare</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6 leading-tight">
            Join a community of pet lovers.
          </h1>
          
          <p className="text-base sm:text-lg leading-relaxed">
            Connect with local pet owners, find reliable walkers, or adopt your new best friend. Everything your pet needs in one place.
          </p>
        </div>

        {/* Bottom Image Section - No padding, reaches bottom edge */}
        <div className="relative w-full hidden sm:block">
          <div className="relative">
            <img 
              src="https://images.squarespace-cdn.com/content/v1/61cbf0294d196a2653ca7f64/494ffb75-e11d-40d1-947e-1ba7f40e74cc/Banner-7.jpg" 
              alt="Happy family with dog" 
              className="w-full h-64 lg:h-80 object-cover"
            />
            {/* Green overlay on image */}
            <div className="absolute inset-0 bg-green-600 opacity-40"></div>
            
            {/* Copyright text on image */}
            <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
              <p className="text-xs text-white opacity-90">© 2024 PetCare Inc. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="lg:w-3/5 bg-gray-50 p-6 sm:p-8 lg:p-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Create an Account</h2>
            <p className="text-sm sm:text-base text-gray-600">Join our platform to care, adopt, and protect pets.</p>
          </div>

          {/* Progress Indicator */}
          
          <div className="mb-6 sm:mb-8">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-green-600">Registration Progress</h3>
            <span className="text-xs sm:text-sm font-medium text-gray-700">Step 1 of 2</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-green-500 h-2.5 rounded-full transition-all duration-300" style={{ width: '50%' }}></div>
          </div>
           <p className="text-xs text-gray-500 mt-2">Personal Details</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition text-sm sm:text-base"
                required
              />
            </div>

            {/* Email Address */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition text-sm sm:text-base"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition text-sm sm:text-base"
                required
              />
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-600">
                      STRENGTH: {passwordStrength}
                    </span>
                    <span className="text-xs font-medium text-gray-600">
                      {passwordStrength === 'GOOD' ? 'Good' : passwordStrength === 'MEDIUM' ? 'Medium' : 'Weak'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="h-1.5 rounded-full transition-all duration-300"
                      style={{ 
                        width: getStrengthWidth(),
                        backgroundColor: getStrengthColor()
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-6 sm:mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition text-sm sm:text-base"
                required
              />
            </div>

            {/* Submit Button */}
            <Link
              to='/registerlast'
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition duration-200 text-sm sm:text-base"
            >
              Continue to Step 2
            </Link>
          </form>

          {/* Login Link */}
          <p className="text-center mt-4 sm:mt-6 text-xs sm:text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-green-600 hover:text-green-700 font-medium">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}