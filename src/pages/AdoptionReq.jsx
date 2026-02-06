import React, { useState, useEffect } from 'react';
import { Download, ClipboardList, ArrowRight, User } from 'lucide-react';

export default function AdoptionRequests() {
  const [activeTab, setActiveTab] = useState('All');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Shelter Access State
  const [shelterIdInput, setShelterIdInput] = useState('');
  const [activeShelterId, setActiveShelterId] = useState(null);

  const tabs = [
    { label: 'All', count: null },
    { label: 'Pending', count: requests.filter(r => r.status === 'Pending').length || null },
    { label: 'Reviewed', count: null },
    { label: 'Approved', count: null },
    { label: 'Rejected', count: null }
  ];

  // Fetch Requests from Backend
  const fetchRequests = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8081/adoption-app/adoption-requests/shelter/${id}`);
      const data = await response.json();
      setRequests(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (shelterIdInput.trim()) {
      setActiveShelterId(shelterIdInput);
      fetchRequests(shelterIdInput);
    }
  };

  // Helper to get initials and random colors for UI consistency
  const getAvatarDetails = (name) => {
    const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '??';
    const colors = [
      'bg-green-100 text-green-700',
      'bg-blue-100 text-blue-700',
      'bg-purple-100 text-purple-700',
      'bg-pink-100 text-pink-700'
    ];
    // Simple hash to keep color consistent for same name
    const index = name ? name.length % colors.length : 0;
    return { initials, colorClass: colors[index] };
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending': return 'bg-orange-100 text-orange-700';
      case 'Approved': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      case 'Reviewed': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // --- LOGIN VIEW ---
  if (!activeShelterId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <ClipboardList className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Request Portal</h1>
            <p className="text-gray-500 text-center mt-2">Enter your Shelter ID to view adoption applications</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shelter ID</label>
              <input
                type="number"
                required
                placeholder="Enter ID (e.g. 1)"
                value={shelterIdInput}
                onChange={(e) => setShelterIdInput(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              View Requests <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- DASHBOARD VIEW ---
  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="p-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Adoption Requests</h2>
            <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">SHELTER #{activeShelterId}</span>
                <button onClick={() => setActiveShelterId(null)} className="text-sm text-blue-600 hover:underline">Switch Shelter</button>
            </div>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700 bg-white shadow-sm">
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 mb-6 shadow-sm overflow-hidden">
          <div className="flex gap-8 px-6 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`py-4 font-medium transition-colors relative ${
                  activeTab === tab.label
                    ? 'text-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
                {tab.count && (
                  <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.label && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
                )}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Applicant Name</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Requested Pet</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Request Date</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Action</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {loading ? (
                    <tr><td colSpan="5" className="text-center py-10 text-gray-500">Loading requests...</td></tr>
                ) : requests.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-10 text-gray-500">No requests found for this shelter.</td></tr>
                ) : (
                    requests
                    .filter(req => activeTab === 'All' || req.status === activeTab)
                    .map((request) => {
                        const { initials, colorClass } = getAvatarDetails(request.applicant_name);
                        return (
                            <tr key={request.request_id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full ${colorClass} flex items-center justify-center font-semibold text-sm`}>
                                    {initials}
                                </div>
                                <span className="font-medium text-gray-900">{request.applicant_name || 'Anonymous'}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div>
                                <p className="font-medium text-gray-900">{request.pet_name}</p>
                                <p className="text-sm text-gray-600">{request.breed}</p>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600">{new Date(request.request_date).toLocaleDateString()}</td>
                            <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(request.status)}`}>
                                {request.status}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm">
                                Review
                                </button>
                            </td>
                            </tr>
                        );
                    })
                )}
                </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">Showing {requests.length} entries</p>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                Previous
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg">1</button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}