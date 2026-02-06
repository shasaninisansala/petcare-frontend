import React, { useState } from 'react';
import { PawPrint } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'pet-owner', // Add role selection
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let apiEndpoint;
      
      // Determine which API endpoint to call based on role
      switch(formData.role) {
        case 'pet-owner':
          apiEndpoint = 'http://localhost:8080/petowner-app/api/petowners/login';
          break;
        case 'admin':
          apiEndpoint = 'http://localhost:8081/admin-app/api/admins/login';
          break;
        case 'shelter':
          apiEndpoint = 'http://localhost:8082/shelter-app/api/shelters/login'; // Assuming you'll create shelter-ms
          break;
        default:
          apiEndpoint = 'http://localhost:8080/petowner-app/api/petowners/login';
      }

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('Login successful!');
        
        // Store user data
        localStorage.setItem('user', JSON.stringify({
          userId: data.userId,
          fullName: data.fullName,
          email: data.email,
          role: data.role
        }));
        
        if (formData.rememberMe) {
          sessionStorage.setItem('user', JSON.stringify({
            userId: data.userId,
            fullName: data.fullName,
            email: data.email,
            role: data.role
          }));
        }
        
        // Redirect based on role
        switch(data.role) {
          case 'pet-owner':
            navigate('/pet-owner/dashboard');
            break;
          case 'shelter':
            navigate('/shelter/dashboard');
            break;
          case 'admin':
            navigate('/admin/dashboard');
            break;
          default:
            navigate('/');
        }
        
      } else {
        toast.error(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
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
            <div className="absolute inset-0 bg-green-600 opacity-50"></div>
            
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
          onClick={() => navigate('/')}
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
            {/* Role Selection */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Login As
              </label>
              <div className="flex space-x-4">
                <label className={`flex-1 p-3 border rounded-lg cursor-pointer text-center transition ${formData.role === 'pet-owner' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300 hover:border-gray-400'}`}>
                  <input
                    type="radio"
                    name="role"
                    value="pet-owner"
                    checked={formData.role === 'pet-owner'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  Pet Owner
                </label>
                <label className={`flex-1 p-3 border rounded-lg cursor-pointer text-center transition ${formData.role === 'admin' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300 hover:border-gray-400'}`}>
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={formData.role === 'admin'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  Admin
                </label>
                <label className={`flex-1 p-3 border rounded-lg cursor-pointer text-center transition ${formData.role === 'shelter' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300 hover:border-gray-400'}`}>
                  <input
                    type="radio"
                    name="role"
                    value="shelter"
                    checked={formData.role === 'shelter'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  Shelter
                </label>
              </div>
            </div>

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
                disabled={loading}
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
                disabled={loading}
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
                  disabled={loading}
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
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Register Link - Only show for pet-owner and shelter */}
          {formData.role !== 'admin' && (
            <p className="text-center mt-6 text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-green-600 hover:text-green-700 font-semibold">
                Register now
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}