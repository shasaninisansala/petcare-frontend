import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8085/api'
});


export default function ShelterVerification() {

  const [shelters, setShelters] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    flagged: 0
  });

  useEffect(() => {
    // Load pending shelters
    api.get('/admin/all')

      .then(res => setShelters(res.data))
      .catch(err => console.error(err));

    // Load stats
    api.get('/admin/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error(err));

  }, []);

  return (
    <div className="flex-1 bg-gray-50">
      <div className="p-8">

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Pending Verifications</p>
            <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Approved Shelters</p>
            <p className="text-3xl font-bold text-gray-900">{stats.approved}</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Rejected Applications</p>
            <p className="text-3xl font-bold text-gray-900">{stats.flagged}</p>
          </div>

        </div>

        {/* Shelters Awaiting Verification */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Shelters Awaiting Verification</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Review submitted documents and licenses for registration approval.
                </p>
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
                          <span className="text-blue-700 font-bold text-sm">
                            {shelter.shelterName?.substring(0, 2)}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {shelter.shelterName}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {shelter.licenseNumber}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {shelter.submissionDate}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {shelter.address}
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                        {shelter.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <Link
                        to={`/admin/shelter-verification/${shelter.id}`}
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

        </div>
      </div>
    </div>
  );
}
