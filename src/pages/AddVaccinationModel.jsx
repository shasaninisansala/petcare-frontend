import React, { useState } from 'react';
import { X, Lock, Calendar, Save } from 'lucide-react';

export default function AddVaccinationModal({ isOpen, onClose, petName = "Buddy", petType = "Dog", petBreed = "Golden Retriever" }) {
  const [formData, setFormData] = useState({
    vaccineName: '',
    vaccinationDate: '',
    clinic: '',
    notes: '',
    setReminder: true
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    console.log('Vaccination data:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add Vaccination for {petName}</h2>
            <p className="text-sm text-gray-500 mt-1">Pet Medical Record</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Pet Info Card */}
        <div className="mx-6 mt-6 bg-gray-50 rounded-lg p-4 flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-400 text-2xl">🐕</span>
          </div>
          <div className="flex-1 flex items-center gap-6 text-sm">
            <div>
              <span className="text-gray-600">Pet Name</span>
              <p className="font-semibold text-gray-900">{petName}</p>
            </div>
            <div>
              <span className="text-gray-600">Type</span>
              <p className="font-semibold text-gray-900">{petType}</p>
            </div>
            <div className="flex items-center gap-2">
              <div>
                <span className="text-gray-600">Breed</span>
                <p className="font-semibold text-gray-900">{petBreed}</p>
              </div>
              <Lock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-xs">Locked</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          {/* Vaccination Details Section */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Vaccination Details</h3>
            
            {/* Vaccine Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vaccine Name
              </label>
              <input
                type="text"
                value={formData.vaccineName}
                onChange={(e) => setFormData({ ...formData, vaccineName: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                placeholder="Enter vaccine name"
              />
              <div className="flex gap-2 mt-2">
                <span className="text-xs text-gray-500">Recommended:</span>
                <button className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium hover:bg-green-200 transition-colors">
                  DHPP
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors">
                  Rabies
                </button>
              </div>
            </div>

            {/* Vaccination Date and Clinic */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vaccination Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.vaccinationDate}
                    onChange={(e) => setFormData({ ...formData, vaccinationDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clinic / Veterinarian <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.clinic}
                  onChange={(e) => setFormData({ ...formData, clinic: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                  placeholder="Clinic name"
                />
              </div>
            </div>

            {/* Warning Message */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex gap-2 mb-4">
              <span className="text-orange-600 text-lg flex-shrink-0">⚠️</span>
              <p className="text-sm text-orange-900">
                <span className="font-medium">Note:</span> This record is past due based on standard schedules.
              </p>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows="3"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white resize-none"
                placeholder="Add any additional notes..."
              />
            </div>
          </div>

          {/* AI Suggestion Card */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white text-2xl">🤖</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-900">AI Suggested Next Due Date</p>
                  <button className="text-green-600 text-sm font-medium hover:text-green-700">
                    Set Reminder
                  </button>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">15 Aug 2026</p>
                <p className="text-sm text-gray-600 mb-3">
                  Calculated based on {petName}'s age and Rabies vaccination cycle.
                </p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.setReminder}
                      onChange={(e) => setFormData({ ...formData, setReminder: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </div>
                  <span className="text-sm text-gray-700 font-medium">Set reminder</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2"
          >
            Save Vaccination
            <Save className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
