import React, { useState } from 'react';
import { DollarSign, Home, TrendingUp, Eye, Flag } from 'lucide-react';



export default function DonationMonitoring() {
  const [timeFilter, setTimeFilter] = useState('Last 30 Days');
  const [selectedShelter, setSelectedShelter] = useState(null);

  const stats = [
    {
      label: 'Total Platform Donations',
      value: '$1,240,500.00',
      change: '+12.5%',
      icon: DollarSign,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      label: 'Verified Shelters',
      value: '142',
      change: '+5.5%',
      icon: Home,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      label: 'Payment Success Rate',
      value: '98.4%',
      change: 'Optimal',
      icon: TrendingUp,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
      changeColor: 'text-gray-500'
    }
  ];

  const shelters = [
    {
      id: 'SV',
      name: 'Safe Valley Shelter',
      regNo: 'ID: #SH-4493',
      totalReceived: '$42,105.00',
      lastTransaction: 'Oct 24, 2023 - 14:32',
      status: 'Active',
      statusColor: 'bg-green-100 text-green-700'
    },
    {
      id: 'HA',
      name: 'Harbor Alliance',
      regNo: 'ID: #SH-8946',
      totalReceived: '$128,440.00',
      lastTransaction: 'Oct 24, 2023 - 09:11',
      status: 'Pending',
      statusColor: 'bg-yellow-100 text-yellow-700'
    },
    {
      id: 'NH',
      name: 'North Haven Refuge',
      regNo: 'ID: #SH-2561',
      totalReceived: '$12,900.50',
      lastTransaction: 'Oct 23, 2023 - 21:55',
      status: 'Failed',
      statusColor: 'bg-red-100 text-red-700'
    },
    {
      id: 'OR',
      name: 'Oak Ridge Care',
      regNo: 'ID: #SH-1129',
      totalReceived: '$76,220.00',
      lastTransaction: 'Oct 23, 2023 - 18:50',
      status: 'Active',
      statusColor: 'bg-green-100 text-green-700'
    }
  ];

  const systemLogs = [
    {
      type: 'success',
      icon: '✓',
      message: 'Payout Batch #4402 processed successfully',
      time: '2 minutes ago'
    },
    {
      type: 'info',
      icon: 'ℹ',
      message: 'New Shelter "Urban Hope" verification pending',
      time: '14 minutes ago'
    },
    {
      type: 'warning',
      icon: '⚠',
      message: 'Flagged transaction #TX-9021 from Safe Valley',
      time: '1 hour ago'
    }
  ];

  return (
    <div className="flex-1 bg-gray-50">
      <div className="p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Donation Monitoring</h2>
          <p className="text-gray-600">Real-time oversight of platform-wide financial activity and shelter distributions.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  <div className={`text-sm font-medium ${stat.changeColor || 'text-green-600'}`}>
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Shelter Distribution Table */}
        <div className="bg-white rounded-xl border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Shelter Distribution</h3>
              <select 
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option>Last 30 Days</option>
                <option>Last 60 Days</option>
                <option>Last 90 Days</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Shelter Name</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Total Received</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Last Transaction</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {shelters.map((shelter) => (
                  <tr key={shelter.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-green-700 font-semibold text-sm">{shelter.id}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{shelter.name}</p>
                          <p className="text-sm text-gray-500">{shelter.regNo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-semibold">{shelter.totalReceived}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{shelter.lastTransaction}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${shelter.statusColor}`}>
                        {shelter.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                        onClick={() => setSelectedShelter(shelter)}
                        className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm font-medium flex items-center gap-1"
                        >
                        <Eye className="w-4 h-4" />
                        View Logs
                        </button>

                        <button className="px-3 py-1 text-red-600 hover:bg-red-50 rounded text-sm font-medium flex items-center gap-1">
                          <Flag className="w-4 h-4" />
                          Flag
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">Showing 1-4 of 1,280 entries</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                Previous
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium">
                1
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                2
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent System Logs */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Recent System Logs</h3>
              <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                Full Log Report
              </button>
            </div>

            <div className="space-y-4">
              {systemLogs.map((log, index) => (
                <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    log.type === 'success' ? 'bg-green-100 text-green-600' :
                    log.type === 'info' ? 'bg-blue-100 text-blue-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    {log.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{log.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Trend Overview */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Monthly Trend Overview</h3>
              <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                Visual Summary
              </button>
            </div>

            <div className="h-64 bg-gray-50 rounded-lg flex items-end justify-around p-4 gap-2">
              {['August', 'September', 'October'].map((month, index) => (
                <div key={month} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-green-500 rounded-t-lg"
                    style={{ height: `${(index + 1) * 60}%` }}
                  ></div>
                  <p className="text-xs text-gray-600 mt-2">{month}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {selectedShelter && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded-xl shadow-lg">

            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
                <h2 className="text-lg font-bold">Shelter Log Details</h2>
                <button onClick={() => setSelectedShelter(null)}>✖</button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-3 text-sm">
                <p><b>Name:</b> {selectedShelter.name}</p>
                <p><b>Registration:</b> {selectedShelter.regNo}</p>
                <p><b>Total Received:</b> {selectedShelter.totalReceived}</p>
                <p><b>Last Transaction:</b> {selectedShelter.lastTransaction}</p>
                <p>
                <b>Status:</b>{" "}
                <span className={`px-2 py-1 rounded ${selectedShelter.statusColor}`}>
                    {selectedShelter.status}
                </span>
                </p>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t">
                <button
                onClick={() => setSelectedShelter(null)}
                className="px-4 py-2 border rounded-lg"
                >
                Close
                </button>

                <button
                onClick={() => {
                    alert("Marked as completed");
                    setSelectedShelter(null);
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                Mark as Completed
                </button>
            </div>
            </div>
        </div>
        )}

    </div>
  );
}
