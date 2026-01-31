import React, { useState } from 'react';
import { PawPrint } from 'lucide-react';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted:', formData);
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section */}
      <div className="lg:w-2/5 bg-green-500 text-white relative flex flex-col">
        {/* Top Content with padding */}
        <div className="p-6 sm:p-8 lg:p-12 flex-1 flex flex-col justify-start">
          <div className="flex items-center gap-2 p-4">
            <PawPrint className="w-7 h-7 text-white " />
            <span className="text-2xl font-bold text-white ">PetCare</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6 leading-tight">
            Compassion for every life.
          </h1>
          
          <p className="text-base sm:text-lg leading-relaxed">
            Join our community animal lovers decided to providing best care and finding forever homes for our furry friends.
          </p>
        </div>

        {/* Bottom Image Section */}
        <div className="relative w-full hidden sm:block">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&auto=format&fit=crop" 
              alt="Happy dog" 
              className="w-full h-64 lg:h-80 object-cover"
            />
            {/* Green overlay on image */}
            <div className="absolute inset-0 bg-green-600 opacity-50"></div>
            
            {/* Copyright text on image */}
            <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
              <p className="text-xs text-white opacity-90">© 2024 PetCare Inc. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="lg:w-3/5 bg-gray-50 p-6 sm:p-8 lg:p-12 flex items-center justify-center relative">
        {/* Back to Home Button */}
        <button 
          onClick={() => window.location.href = '/'}
          className="absolute top-6 right-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          <span className="text-sm font-medium">Back to Home</span>
        </button>

        <div className="w-full max-w-md mt-12 lg:mt-0">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-sm sm:text-base text-gray-600">Login to manage your pets and support animal welfare</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email Address */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="rememberMe" className="text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <a href="/forgot-password" className="text-sm text-green-600 hover:text-green-700 font-medium">
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              <span>Login</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center mt-6 text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="text-green-600 hover:text-green-700 font-semibold">
              Register now
            </a>
          </p>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-50 text-gray-500">or continue with</span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Sign in with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}