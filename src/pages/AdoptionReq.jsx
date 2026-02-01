import React, { useState } from 'react';
import { Download } from 'lucide-react';

export default function AdoptionRequests() {
  const [activeTab, setActiveTab] = useState('All');

  const tabs = [
    { label: 'All', count: null },
    { label: 'Pending', count: 12 },
    { label: 'Reviewed', count: null },
    { label: 'Approved', count: null },
    { label: 'Rejected', count: null }
  ];

  const requests = [
    {
      id: 1,
      applicant: 'Sarah Jenkins',
      initials: 'SJ',
      initialsColor: 'bg-green-100 text-green-700',
      pet: 'Buddy',
      breed: 'Golden Retriever',
      date: 'Oct 24, 2024',
      status: 'Pending',
      statusColor: 'bg-orange-100 text-orange-700'
    },
    {
      id: 2,
      applicant: 'Marcus Davis',
      initials: 'MD',
      initialsColor: 'bg-blue-100 text-blue-700',
      pet: 'Luna',
      breed: 'Calico Cat',
      date: 'Oct 23, 2024',
      status: 'Reviewed',
      statusColor: 'bg-blue-100 text-blue-700'
    },
    {
      id: 3,
      applicant: 'Emily Lawson',
      initials: 'EL',
      initialsColor: 'bg-purple-100 text-purple-700',
      pet: 'Max',
      breed: 'Beagle',
      date: 'Oct 22, 2024',
      status: 'Pending',
      statusColor: 'bg-orange-100 text-orange-700'
    },
    {
      id: 4,
      applicant: 'Robert Taylor',
      initials: 'RT',
      initialsColor: 'bg-pink-100 text-pink-700',
      pet: 'Buddy',
      breed: 'Golden Retriever',
      date: 'Oct 21, 2024',
      status: 'Approved',
      statusColor: 'bg-green-100 text-green-700'
    }
  ];

  return (
    <div className="flex-1 bg-gray-50">
      <div className="p-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Adoption Requests</h2>
            <p className="text-gray-600">Review and manage incoming adoption applications for your shelter.</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700">
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
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
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${request.initialsColor} flex items-center justify-center font-semibold text-sm`}>
                        {request.initials}
                      </div>
                      <span className="font-medium text-gray-900">{request.applicant}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{request.pet}</p>
                      <p className="text-sm text-gray-600">{request.breed}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{request.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${request.statusColor}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm">
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">Showing 1 to 4 of 42 entries</p>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                Previous
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg">
                1
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                2
              </button>
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
