import React, { useState, useEffect } from 'react';
import { Search, Download, Calendar, DollarSign } from 'lucide-react';
import axios from 'axios'; // for backend calls

export default function Donations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [donations, setDonations] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);

  // Fetch donations from backend
  useEffect(() => {
    axios.get('/api/donations') // Replace with your backend endpoint
      .then(res => setDonations(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="flex-1 bg-gray-50">
      <div className="p-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Donations</h2>
            <p className="text-gray-600">Review and manage incoming donations for your shelter.</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700">
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Received</p>
                <p className="text-3xl font-bold text-gray-900">$48,290.00</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <span className="text-lg">↗</span>
              <span>+12.5% from last year</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">This Month</p>
                <p className="text-3xl font-bold text-gray-900">$3,450.00</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600">84 unique donors</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="search by donor name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700 flex items-center gap-2">
              Select type
              <span className="text-gray-400">▼</span>
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Calendar className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Donor Name</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Amount</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Purpose</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {donations
                .filter(d => d.donor.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((donation) => (
                  <tr key={donation.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${donation.initialsColor} flex items-center justify-center font-semibold text-sm`}>
                          {donation.initials}
                        </div>
                        <span className="font-medium text-gray-900">{donation.donor}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{donation.date}</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-green-600">{donation.amount}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${donation.purposeColor}`}>
                        {donation.purpose}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${donation.statusColor}`}>
                        ● {donation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedDonation(donation)}
                        className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1"
                      >
                        <Download className="w-4 h-4" />
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">Showing {donations.length} entries</p>
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

        {/* Receipt Modal */}
        {selectedDonation && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-96">
              <h2 className="text-xl font-bold mb-4">Donation Receipt</h2>
              <p><span className="font-medium">Donor:</span> {selectedDonation.donor}</p>
              <p><span className="font-medium">Date:</span> {selectedDonation.date}</p>
              <p><span className="font-medium">Amount:</span> {selectedDonation.amount}</p>
              <p><span className="font-medium">Purpose:</span> {selectedDonation.purpose}</p>
              <p><span className="font-medium">Status:</span> {selectedDonation.status}</p>
              <button
                onClick={() => setSelectedDonation(null)}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 w-full"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
