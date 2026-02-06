import React, { useState } from 'react';
import { X, Lock, Calendar, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { api } from '../utils/api';

export default function AddVaccinationModal({ isOpen, onClose, petId, petName = "Buddy", petType = "Dog", petBreed = "Golden Retriever", onSuccess }) {
  const [formData, setFormData] = useState({
    vaccineName: '',
    vaccinationDate: '',
    clinicName: '',
    veterinarianName: '',
    notes: '',
    reminderSet: true,
    status: 'Planned'
  });
  
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!formData.vaccineName || !formData.vaccinationDate) {
      toast.error('Please fill in Vaccine Name and Vaccination Date');
      return;
    }

    setLoading(true);

    try {
      const vaccinationData = {
        vaccineName: formData.vaccineName,
        vaccinationDate: formData.vaccinationDate,
        clinicName: formData.clinicName || null,
        veterinarianName: formData.veterinarianName || null,
        notes: formData.notes || null,
        nextDueDate: calculateNextDueDate(formData.vaccinationDate, formData.vaccineName),
        reminderSet: formData.reminderSet,
        status: formData.status
      };

      const result = await api.addVaccination(petId, vaccinationData);
      
      if (result.message) {
        toast.success('Vaccination added successfully!');
        if (onSuccess) onSuccess();
        onClose();
        // Reset form
        setFormData({
          vaccineName: '',
          vaccinationDate: '',
          clinicName: '',
          veterinarianName: '',
          notes: '',
          reminderSet: true,
          status: 'Planned'
        });
      } else {
        toast.error(result.error || 'Failed to add vaccination');
      }
    } catch (error) {
      console.error('Error adding vaccination:', error);
      toast.error(error.message || 'Failed to add vaccination. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateNextDueDate = (vaccinationDate, vaccineName) => {
    const date = new Date(vaccinationDate);
    
    // Calculate next due date based on vaccine type
    if (vaccineName.toLowerCase().includes('rabies')) {
      date.setFullYear(date.getFullYear() + 3); // Rabies every 3 years
    } else if (vaccineName.toLowerCase().includes('dhpp')) {
      date.setFullYear(date.getFullYear() + 1); // DHPP yearly
    } else {
      date.setFullYear(date.getFullYear() + 1); // Default yearly
    }
    
    return date.toISOString().split('T')[0];
  };

  const getSuggestedDate = () => {
    if (!formData.vaccinationDate || !formData.vaccineName) {
      return 'Select date & vaccine';
    }
    return calculateNextDueDate(formData.vaccinationDate, formData.vaccineName);
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
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
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
                Vaccine Name *
              </label>
              <input
                type="text"
                value={formData.vaccineName}
                onChange={(e) => setFormData({ ...formData, vaccineName: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                placeholder="Enter vaccine name"
                disabled={loading}
              />
              <div className="flex gap-2 mt-2">
                <span className="text-xs text-gray-500">Quick select:</span>
                <button 
                  type="button"
                  onClick={() => setFormData({ ...formData, vaccineName: 'DHPP' })}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium hover:bg-green-200 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  DHPP
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({ ...formData, vaccineName: 'Rabies' })}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  Rabies
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({ ...formData, vaccineName: 'Bordetella' })}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  Bordetella
                </button>
              </div>
            </div>

            {/* Vaccination Date and Clinic */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vaccination Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.vaccinationDate}
                    onChange={(e) => setFormData({ ...formData, vaccinationDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                    disabled={loading}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clinic / Veterinarian
                </label>
                <input
                  type="text"
                  value={formData.clinicName}
                  onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                  placeholder="Clinic name"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Status */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                disabled={loading}
              >
                <option value="Planned">Planned</option>
                <option value="Completed">Completed</option>
                <option value="Due Soon">Due Soon</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows="3"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white resize-none"
                placeholder="Add any additional notes..."
                disabled={loading}
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
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {getSuggestedDate()}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  {formData.vaccineName 
                    ? `Calculated based on ${petName}'s age and ${formData.vaccineName} vaccination cycle.`
                    : 'Select a vaccine to see calculation'}
                </p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.reminderSet}
                      onChange={(e) => setFormData({ ...formData, reminderSet: e.target.checked })}
                      className="sr-only peer"
                      disabled={loading}
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
            disabled={loading}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.vaccineName || !formData.vaccinationDate}
            className="px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                Save Vaccination
                <Save className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}