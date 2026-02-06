import React, { useState } from 'react';
import { X, Calendar, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { api } from '../utils/api';

export default function AddMedicalRecordModal({ isOpen, onClose, petId, petName = "Buddy", onSuccess }) {
  const [formData, setFormData] = useState({
    recordDate: '',
    conditionName: '',
    recordType: 'Routine',
    treatment: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!formData.recordDate || !formData.conditionName) {
      toast.error('Please fill in Date and Condition/Event');
      return;
    }

    setLoading(true);

    try {
      const medicalData = {
        recordDate: formData.recordDate,
        conditionName: formData.conditionName,
        recordType: formData.recordType,
        treatment: formData.treatment || null,
        notes: formData.notes || null
      };

      const result = await api.addMedicalRecord(petId, medicalData);
      
      if (result.message) {
        toast.success('Medical record added successfully!');
        if (onSuccess) onSuccess();
        onClose();
        // Reset form
        setFormData({
          recordDate: '',
          conditionName: '',
          recordType: 'Routine',
          treatment: '',
          notes: ''
        });
      } else {
        toast.error(result.error || 'Failed to add medical record');
      }
    } catch (error) {
      console.error('Error adding medical record:', error);
      toast.error(error.message || 'Failed to add medical record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Add Medical Record for {petName}</h2>
          <button 
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          {/* Record Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.recordDate}
                onChange={(e) => setFormData({ ...formData, recordDate: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                disabled={loading}
              />
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Condition / Event */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condition / Event *
            </label>
            <input
              type="text"
              value={formData.conditionName}
              onChange={(e) => setFormData({ ...formData, conditionName: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
              placeholder="E.g., Ear Infection, Annual Checkup"
              disabled={loading}
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={formData.recordType}
              onChange={(e) => setFormData({ ...formData, recordType: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
              disabled={loading}
            >
              <option value="Routine">Routine</option>
              <option value="Illness">Illness</option>
              <option value="Vaccine">Vaccine</option>
              <option value="Injury">Injury</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Treatment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Treatment
            </label>
            <textarea
              value={formData.treatment}
              onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
              rows="3"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white resize-none"
              placeholder="Describe treatment, medications, procedures..."
              disabled={loading}
            />
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
              placeholder="Additional notes or observations..."
              disabled={loading}
            />
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
            disabled={loading || !formData.recordDate || !formData.conditionName}
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