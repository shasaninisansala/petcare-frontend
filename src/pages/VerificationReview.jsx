import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ZoomIn, ZoomOut, RotateCw, Download, X, CheckCircle } from 'lucide-react';
import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:8085/api',
});




export default function VerificationReview() {
  const [adminFeedback, setAdminFeedback] = useState('');

  const { licenseNo } = useParams();
const [shelterInfo, setShelterInfo] = useState({});

useEffect(() => {
  api.get(`/admin/shelter/${licenseNo}`)
    .then(res => setShelterInfo(res.data))
    .catch(err => console.error(err));
}, [licenseNo]);


    const [checklist, setChecklist] = useState([
    { label: 'License extracted', checked: false },
    { label: 'Contact Verified', checked: false },
    { label: 'Address Checked', checked: false }
    ]);


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between max-w-7xl">
          <Link to="/admin/shelter-verification" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Shelter Applications</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-green-600 text-xl">🐾</span>
            <span className="font-semibold text-gray-900">Admin Panel</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Review: Happy Paws Shelter</h1>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-600">Application ID: #44401</span>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
                Pending Review
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            {/* Shelter Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                  <span className="text-green-600 text-xs">ℹ️</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Shelter Information</h3>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">shelterName</label>
                  <p className="text-gray-900 font-medium">{shelterInfo.legalName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">regId</label>
                  <p className="text-gray-900 font-medium">{shelterInfo.regNo}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">address</label>
                  <p className="text-gray-900 font-medium">{shelterInfo.address}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">email</label>
                  <p className="text-gray-900 font-medium">{shelterInfo.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">phone</label>
                  <p className="text-gray-900 font-medium">{shelterInfo.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">licenseNumber</label>
                  <p className="text-gray-900 font-medium">{shelterInfo.licenseNo}</p>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-600 mb-2">description</label>
                <p className="text-gray-700 leading-relaxed">{shelterInfo.mission}</p>
              </div>
            </div>

            {/* License Document Preview */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                    <span className="text-green-600 text-xs">📄</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">License Document Preview</h3>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <ZoomIn className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <ZoomOut className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <RotateCw className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Document Preview */}
              <div className="bg-gray-50 rounded-lg p-8 min-h-[500px] flex items-center justify-center border border-gray-200">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl text-gray-400">📄</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">STATE OPERATING LICENSE</h4>
                  <p className="text-gray-500 mb-4">Animal Shelter Division</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 text-sm">
                <p className="text-gray-600">State_License_3252.pdf (2.4 MB)</p>
                <button className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium">
                  <Download className="w-4 h-4" />
                  Download Original
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Verification Checklist & Actions */}
          <div className="space-y-6">
            {/* Verification Checklist */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Verification Checklist</h3>
              
            <div className="space-y-3 mb-6">
            {checklist.map((item, index) => (
                <label key={index} className="flex items-center gap-3 cursor-pointer">
                <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => {
                    const updated = [...checklist];
                    updated[index].checked = !updated[index].checked;
                    setChecklist(updated);
                    }}
                    className="w-5 h-5 rounded border-gray-300 text-green-500 focus:ring-green-500"
                />
                <span className="text-gray-700">{item.label}</span>
                </label>
            ))}
            </div>


              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Admin Feedback</label>
                <p className="text-xs text-gray-500 mb-2">Provide a brief approval or reason for rejection.</p>
                <textarea
                  value={adminFeedback}
                  onChange={(e) => setAdminFeedback(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-sm"
                  placeholder="Enter feedback..."
                />
              </div>

              <div className="mt-6 space-y-3">
                <button className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Approve Shelter
                </button>
                <button className="w-full py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-semibold flex items-center justify-center gap-2">
                  <X className="w-5 h-5" />
                  Reject Application
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
