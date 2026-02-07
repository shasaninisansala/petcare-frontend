import React, { useState } from 'react';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdoptionForm() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract data from state passed from AdoptionPage
  const petName = location.state?.petName;
  const shelterId = location.state?.shelterId;
  const adoptionId = location.state?.adoptionId;

  const [formData, setFormData] = useState({
    fullName: '',
    homeType: '',
    hasFencedYard: 'no',
    activityLevel: 50,
    hoursAlone: '',
    contactNumber: '',
    agreeToTerms: false
  });

  const [submitting, setSubmitting] = useState(false);

  // If no adoptionId is present, the user likely refreshed the page or navigated directly
  if (!adoptionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold">No Pet Selected</h2>
          <p className="text-gray-600 mb-4">Please select a pet from the adoption gallery first.</p>
          <button 
            onClick={() => navigate('/adoptions')}
            className="bg-green-500 text-white px-6 py-2 rounded-lg"
          >
            Go to Gallery
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const postData = {
      adoption_id: adoptionId,
      pet_name: petName,
      shelterId: shelterId,
      type_of_home: formData.homeType,
      fenced_yard: formData.hasFencedYard === 'yes' ? 'Yes' : 'No',
      activity_level:
        formData.activityLevel <= 33 ? 'Low' : formData.activityLevel <= 66 ? 'Medium' : 'High',
      hours_alone_per_day: parseInt(formData.hoursAlone),
      fullname: formData.fullName,
      contact_no: formData.contactNumber
    };

    try {
      await axios.post(
        'http://localhost:8083/adoption-app/adoption-requests',
        postData
      );
      alert(`Application submitted successfully for ${petName}!`);
      navigate('/adopt'); 
    } catch (error) {
      console.error('Submission error:', error.response?.data || error.message);
      alert('Failed to submit application: ' + (error.response?.data?.message || 'Server Error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 py-12">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Adopt {petName}</h1>
        <p className="text-gray-600 mb-6">Tell us about where {petName} would be living.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Type of Home */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Type of Home</label>
            <select
              value={formData.homeType}
              onChange={(e) => setFormData({ ...formData, homeType: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              required
            >
              <option value="">Select home type</option>
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Condo">Condo</option>
              <option value="Farm">Farm</option>
            </select>
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Contact Number</label>
            <input
              type="tel"
              value={formData.contactNumber}
              onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              placeholder="(555) 123-4567"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Fenced Yard */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Do you have a fenced yard?</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, hasFencedYard: 'yes' })}
                className={`py-3 px-4 rounded-lg border-2 transition-all ${
                  formData.hasFencedYard === 'yes'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                Yes, fully fenced
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, hasFencedYard: 'no' })}
                className={`py-3 px-4 rounded-lg border-2 transition-all ${
                  formData.hasFencedYard === 'no'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                No yard / Not fenced
              </button>
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Activity Level</label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.activityLevel}
              onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200"
              style={{
                background: `linear-gradient(to right, #10b981 0%, #10b981 ${formData.activityLevel}%, #e5e7eb ${formData.activityLevel}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Relaxed</span>
              <span>Moderate</span>
              <span>Very Active</span>
            </div>
          </div>

          {/* Hours Alone */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Hours alone per day
            </label>
            <input
              type="number"
              min="0"
              max="24"
              value={formData.hoursAlone}
              onChange={(e) => setFormData({ ...formData, hoursAlone: e.target.value })}
              placeholder="e.g., 4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Agreement */}
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                className="w-5 h-5 mt-0.5 rounded border-gray-300 text-green-500 focus:ring-green-500"
                required
              />
              <span className="text-sm text-gray-700">
                I agree to the Adoption Terms.{' '}
                <button type="button" className="text-green-600 hover:text-green-700 font-medium">
                  Read Full Agreement
                </button>
              </span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/adopt')}
              className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.agreeToTerms || submitting}
              className="flex-1 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
              {!submitting && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}