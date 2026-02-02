import React, { useState } from 'react';
import { X, Calendar, Save } from 'lucide-react';

export default function AddMedicalRecordModal({ isOpen, onClose, petName = "Buddy" }) {
  const [formData, setFormData] = useState({
    recordDate: '',
    condition: '',
    type: 'Routine', // Routine, Illness, Vaccine, Injury
    treatment: '',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    console.log('Medical Record:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Add Medical Record for {petName}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          {/* Record Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <div className="relative">
              <input
                type="date"
                value={formData.recordDate}
                onChange={(e) => setFormData({ ...formData, recordDate: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
              />
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Condition / Event */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Condition / Event</label>
            <input
              type="text"
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
              placeholder="E.g., Ear Infection, Annual Checkup"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
            >
              <option value="Routine">Routine</option>
              <option value="Illness">Illness</option>
              <option value="Vaccine">Vaccine</option>
              <option value="Injury">Injury</option>
            </select>
          </div>

          {/* Treatment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Treatment</label>
            <textarea
              value={formData.treatment}
              onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
              rows="3"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white resize-none"
              placeholder="Describe treatment, medications, procedures..."
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows="3"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white resize-none"
              placeholder="Additional notes or observations..."
            />
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
            Save Record
            <Save className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
