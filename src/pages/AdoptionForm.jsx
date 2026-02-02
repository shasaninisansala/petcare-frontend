import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function AdoptionForm({ petName = "Cooper", onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    homeType: '',
    hasFencedYard: '',
    activityLevel: 50,
    hoursAlone: '',
    contactNumber: '',
    agreeToTerms: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Adopt {petName}</h1>
          <p className="text-gray-600">Tell us about where {petName} would be living.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type of Home */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Type of Home
            </label>
            <select
              value={formData.homeType}
              onChange={(e) => setFormData({ ...formData, homeType: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
              required
            >
              <option value="">Select home type</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condo</option>
              <option value="farm">Farm</option>
            </select>
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Contact Number
            </label>
            <input
              type="tel"
              value={formData.contactNumber}
              onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              placeholder="(555) 123-4567"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
              required
            />
          </div>

          {/* Fenced Yard */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Do you have a fenced yard?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, hasFencedYard: 'yes' })}
                className={`py-3 px-4 rounded-lg border-2 transition-colors ${
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
                className={`py-3 px-4 rounded-lg border-2 transition-colors ${
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
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-gray-900">
                Activity Level
              </label>
              <span className="text-sm text-gray-600">Low to High energy</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.activityLevel}
              onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #10b981 0%, #10b981 ${formData.activityLevel}%, #e5e7eb ${formData.activityLevel}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Relaxed</span>
              <span>Moderate</span>
              <span>Very Active</span>
            </div>
          </div>

          {/* Hours Alone */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              How many hours will the pet be alone during the day?
            </label>
            <input
              type="text"
              value={formData.hoursAlone}
              onChange={(e) => setFormData({ ...formData, hoursAlone: e.target.value })}
              placeholder="e.g., 4-6 hours"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
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
                I agree to the Adoption Terms and consent to a home check if required.{' '}
                <button type="button" className="text-green-600 hover:text-green-700 font-medium">
                  Read Full Agreement
                </button>
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.agreeToTerms}
              className="flex-1 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Application
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
