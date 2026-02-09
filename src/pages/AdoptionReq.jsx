import React, { useState } from 'react';
import { Download, ClipboardList, ArrowRight, AlertTriangle, X, Printer, Phone, Home, Activity, Clock, Check, Ban } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';

export default function AdoptionRequests() {
  const [activeTab, setActiveTab] = useState('All');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [shelterIdInput, setShelterIdInput] = useState('');
  const [activeShelterId, setActiveShelterId] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const tabs = [
    { label: 'All', count: null },
    { label: 'Pending', count: requests.filter(r => r.status === 'Pending').length || null },
    { label: 'Approved', count: null },
    { label: 'Rejected', count: null }
  ];

  const fetchRequests = async (id) => {
    setLoading(true);
    try {
      // Backend still expects the ID as part of the path/param
      const response = await axios.get(`http://localhost:8083/adoption-app/adoption-requests/shelter/${id}`);
      setRequests(response.data);
      setLoading(false);
    } catch (error) {
      setError("Could not find data for this License Number.");
      setActiveShelterId(null);
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (requestId, newStatus) => {
    setIsUpdating(true);
    try {
      await axios.put(`http://localhost:8083/adoption-app/adoption-requests/${requestId}/status`, {
        status: newStatus
      });

      setRequests(prev => 
        prev.map(req => req.request_id === requestId ? { ...req, status: newStatus } : req)
      );
      
      setSelectedRequest(null);
    } catch (err) {
      alert("Failed to update status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Removed REG-XXX Regex. Now we just check if it is not empty.
    if (!shelterIdInput.trim()) {
      setError('Please enter a valid License Number.');
      return;
    }

    setActiveShelterId(shelterIdInput);
    fetchRequests(shelterIdInput);
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

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Adoption Requests Report`, 14, 15);
    doc.setFontSize(12);
    doc.text(`License Number: ${activeShelterId}`, 14, 22);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 29);
    
    const tableData = requests.map(req => [
      req.request_id, 
      req.fullname, 
      req.pet_name, 
      new Date(req.request_date).toLocaleDateString(), 
      req.status
    ]);

    autoTable(doc, {
      startY: 35,
      head: [['ID', 'Applicant', 'Pet Name', 'Request Date', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [34, 197, 94] },
    });

    doc.save(`Adoption_Requests_${activeShelterId}.pdf`);
  };

  if (!activeShelterId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <ClipboardList className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Shelter Portal</h1>
            <p className="text-gray-500 text-center mt-2">Enter your License Number to manage requests</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              required
              placeholder="e.g. LNC-9923"
              value={shelterIdInput}
              onChange={(e) => { setShelterIdInput(e.target.value); if(error) setError(''); }}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-all ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-green-500'}`}
            />
            {error && <div className="flex items-center gap-2 mt-2 text-red-600 text-sm"><AlertTriangle className="w-4 h-4" /> {error}</div>}
            <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2">
              Access Requests <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 min-h-screen relative">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Adoption Requests</h2>
            <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded tracking-widest">{activeShelterId}</span>
                <button onClick={() => { setActiveShelterId(null); setRequests([]); }} className="text-sm text-blue-600 hover:underline ml-2">Change License</button>
            </div>
          </div>
          <button onClick={exportToPDF} className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700 bg-white shadow-sm">
            <Download className="w-5 h-5" /> Export PDF
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 mb-6 shadow-sm overflow-hidden">
          <div className="flex gap-8 px-6 border-b border-gray-200">
            {tabs.map((tab) => (
              <button key={tab.label} onClick={() => setActiveTab(tab.label)} className={`py-4 font-medium relative ${activeTab === tab.label ? 'text-green-600' : 'text-gray-600'}`}>
                {tab.label} {tab.count !== null && <span className="ml-1 text-xs opacity-60">({tab.count})</span>}
                {activeTab === tab.label && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600" />}
              </button>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Applicant</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Pet</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Date</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {requests.length > 0 ? requests.filter(req => activeTab === 'All' || req.status === activeTab).map((request) => (
                    <tr key={request.request_id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-semibold">{request.fullname}</td>
                        <td className="px-6 py-4">{request.pet_name}</td>
                        <td className="px-6 py-4">{new Date(request.request_date).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusStyle(request.status)}`}>
                                {request.status}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            <button onClick={() => setSelectedRequest(request)} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium">Review</button>
                        </td>
                    </tr>
                )) : (
                    <tr><td colSpan="5" className="text-center py-10 text-gray-400 font-medium">No requests found.</td></tr>
                )}
                </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- POPUP MODAL --- */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden">
            <div className="px-8 py-6 bg-gray-50 border-b flex justify-between items-center">
              <div><h3 className="text-xl font-bold">Application Details</h3><p className="text-sm text-gray-500">ID: {selectedRequest.request_id}</p></div>
              <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-gray-200 rounded-full"><X className="w-6 h-6 text-gray-500" /></button>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <DetailRow icon={<Printer />} label="Applicant" value={selectedRequest.fullname} color="bg-green-100 text-green-600" />
                <DetailRow icon={<Phone />} label="Contact" value={selectedRequest.contact_no} color="bg-blue-100 text-blue-600" />
                <DetailRow icon={<Home />} label="Home Type" value={selectedRequest.type_of_home} color="bg-purple-100 text-purple-600" />
              </div>
              <div className="space-y-4">
                <DetailRow icon={<Activity />} label="Activity" value={selectedRequest.activity_level} color="bg-orange-100 text-orange-600" />
                <DetailRow icon={<Clock />} label="Hours Alone" value={`${selectedRequest.hours_alone_per_day} hrs`} color="bg-pink-100 text-pink-600" />
                <DetailRow icon={<Check />} label="Yard" value={selectedRequest.fenced_yard} color="bg-green-100 text-green-600" />
              </div>
            </div>

            <div className="px-8 py-6 bg-gray-50 border-t flex gap-4">
              <button 
                disabled={isUpdating}
                onClick={() => handleUpdateStatus(selectedRequest.request_id, 'Approved')}
                className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" /> {isUpdating ? 'Updating...' : 'Approve'}
              </button>
              <button 
                disabled={isUpdating}
                onClick={() => handleUpdateStatus(selectedRequest.request_id, 'Rejected')}
                className="flex-1 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold hover:bg-red-100 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Ban className="w-5 h-5" /> {isUpdating ? 'Updating...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ icon, label, value, color }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>{React.cloneElement(icon, { className: 'w-5 h-5' })}</div>
      <div><p className="text-xs text-gray-500 uppercase font-bold">{label}</p><p className="font-semibold">{value}</p></div>
    </div>
  );
}