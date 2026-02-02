import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

export default function AddGrowthRecordModal({ isOpen, onClose, petName = "Buddy" }) {
  const [formData, setFormData] = useState({
    measurementDate: '',
    weight: '',
    height: ''
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    console.log('Growth record:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Add Growth Record for {petName}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          {/* Measurement Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Measurement Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.measurementDate}
                onChange={(e) => setFormData({ ...formData, measurementDate: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white text-gray-900"
              />
              
            </div>
          </div>

          {/* Weight and Height */}
          <div className="grid grid-cols-2 gap-4">
            {/* Weight */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Weight
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white text-gray-900"
                  placeholder="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  kg
                </span>
              </div>
            </div>

            {/* Height */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Height
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white text-gray-900"
                  placeholder="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  cm
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-4 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-8 py-2.5 text-gray-700 hover:text-gray-900 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-8 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2"
          >
            Save Record
            <Save className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
