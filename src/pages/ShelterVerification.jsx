import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

const api = axios.create({
  baseURL: '/api'
});



export default function ShelterVerification() {
  const stats = [
    {
      label: 'Pending Verifications',
      value: '24',
      change: '+12%',
      icon: '📋',
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
      changeIcon: TrendingUp
    },
    {
      label: 'Approved Shelters',
      value: '142',
      change: '-6%',
      icon: '✓',
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
      changeIcon: TrendingDown,
      changeColor: 'text-red-600'
    },
    {
      label: 'Flagged Applications',
      value: '3',
      change: '21%',
      icon: '🚩',
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600',
      changeIcon: TrendingUp,
      changeColor: 'text-red-600'
    }
  ];

  const [shelters, setShelters] = useState([]);

useEffect(() => {
  api.get('/admin/pending')
    .then(res => setShelters(res.data))
    .catch(err => console.error(err));
}, []);


  return (
    <div className="flex-1 bg-gray-50">
      <div className="p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const ChangeIcon = stat.changeIcon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.iconBg} rounded-lg flex items-center justify-center text-2xl`}>
                    {stat.icon}
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${stat.changeColor || 'text-green-600'}`}>
                    <ChangeIcon className="w-4 h-4" />
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

        {/* Shelters Awaiting Verification */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Shelters Awaiting Verification</h3>
                <p className="text-sm text-gray-600 mt-1">Review submitted documents and licenses for registration approval.</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                <span>☰</span> Filter
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Shelter Name</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">License No.</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Submission Date</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Location</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {shelters.map((shelter, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-700 font-bold text-sm">{shelter.shelterName.substring(0,2)}</span>
                        </div>
                        <span className="font-medium text-gray-900">{shelter.sheltername}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{shelter.licenseNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{shelter.submissionDate}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{shelter.address}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${shelter.statusColor}`}>
                        {shelter.status} {shelter.status === 'Pending Review' ? '⏱' : '👁'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/admin/shelter-verification/${shelter.licenseNo}`}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                      >
                        Review Documents
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">Showing 1 to 5 of 24 results</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                Previous
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium">
                1
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
