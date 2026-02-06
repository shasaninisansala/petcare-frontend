import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { api } from '../utils/api';

export default function AddGrowthRecordModal({ isOpen, onClose, petId, petName = "Buddy", onSuccess }) {
  const [formData, setFormData] = useState({
    measurementDate: '',
    weight: '',
    height: '',
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Update pet's current weight and height
  const updatePetStats = async (weight, height) => {
    try {
      // Get current pet data
      const currentPet = await api.getPetById(petId);
      
      const updatedPetData = {
        petName: currentPet.petName,
        species: currentPet.species,
        breed: currentPet.breed || null,
        dateOfBirth: currentPet.dateOfBirth || null,
        weight: parseFloat(weight),  // Update with new weight
        height: parseFloat(height),  // Update with new height
        healthNotes: currentPet.healthNotes || null,
        imageUrl: currentPet.imageUrl || null
      };

      // Update pet with new weight/height
      const updateResult = await api.updatePet(petId, updatedPetData);
      
      if (updateResult.message) {
        console.log('Pet stats updated successfully');
      }
    } catch (error) {
      console.error('Error updating pet stats:', error);
      // Don't show error to user as this is secondary operation
    }
  };

  const handleSubmit = async () => {
    if (!formData.measurementDate || !formData.weight || !formData.height) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const growthData = {
        measurementDate: formData.measurementDate,
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        notes: formData.notes || null
      };

      const result = await api.addGrowthRecord(petId, growthData);
      
      if (result.message) {
        // Update pet's current weight and height
        await updatePetStats(formData.weight, formData.height);
        
        toast.success('Growth record added successfully!');
        if (onSuccess) onSuccess();
        onClose();
        // Reset form
        setFormData({
          measurementDate: '',
          weight: '',
          height: '',
          notes: ''
        });
      } else {
        toast.error(result.error || 'Failed to add growth record');
      }
    } catch (error) {
      console.error('Error adding growth record:', error);
      toast.error(error.message || 'Failed to add growth record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Add Growth Record for {petName}</h2>
          <button 
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          {/* Measurement Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Measurement Date *
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.measurementDate}
                onChange={(e) => setFormData({ ...formData, measurementDate: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white text-gray-900"
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Weight and Height */}
          <div className="grid grid-cols-2 gap-4">
            {/* Weight */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Weight (kg) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white text-gray-900"
                  placeholder="0.0"
                  disabled={loading}
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  kg
                </span>
              </div>
            </div>

            {/* Height */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Height (cm) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white text-gray-900"
                  placeholder="0.0"
                  disabled={loading}
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  cm
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows="2"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white text-gray-900 resize-none"
              placeholder="Any observations..."
              disabled={loading}
            />
          </div>

          {/* Info Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Note:</span> Adding this growth record will update {petName}'s current weight and height in the pet profile.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-4 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-8 py-2.5 text-gray-700 hover:text-gray-900 transition-colors font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.measurementDate || !formData.weight || !formData.height}
            className="px-8 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                Save Record
                <Save className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}