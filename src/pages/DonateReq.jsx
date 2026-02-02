import React, { useState, useEffect } from 'react';
import { Search, Download, Calendar, DollarSign, PlusCircle } from 'lucide-react';
import axios from 'axios';

export default function Donations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [donations, setDonations] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);

  // Request Donation modal
  const [showRequestForm, setShowRequestForm] = useState(false);

  // Request form state
  const [requestForm, setRequestForm] = useState({
    purpose: '',
    amount: '',
    description: '',
    neededDate: ''
  });

  // Fetch donations
  useEffect(() => {
    axios.get('/api/donations')
      .then(res => setDonations(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleRequestChange = (e) => {
    setRequestForm({ ...requestForm, [e.target.name]: e.target.value });
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/donation-requests', requestForm);
      alert("Donation request submitted!");
      setShowRequestForm(false);
      setRequestForm({ purpose: '', amount: '', description: '', neededDate: '' });
    } catch (err) {
      console.error(err);
      alert("Failed to submit request");
    }
  };

  return (
    <div className="flex-1 bg-gray-50">
      <div className="p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Donations</h2>
            <p className="text-gray-600">Review and manage incoming donations for your shelter.</p>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-5 h-5" />
              Export
            </button>

            <button
              onClick={() => setShowRequestForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <PlusCircle className="w-5 h-5" />
              Request Donation
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl border">
            <p className="text-sm text-gray-600">Total Received</p>
            <p className="text-3xl font-bold">$48,290.00</p>
          </div>
          <div className="bg-white p-6 rounded-xl border">
            <p className="text-sm text-gray-600">This Month</p>
            <p className="text-3xl font-bold">$3,450.00</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-6 rounded-xl border mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                placeholder="search by donor name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Donor</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Purpose</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {donations
                .filter(d => d.donor.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(donation => (
                  <tr key={donation.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">{donation.donor}</td>
                    <td className="px-6 py-4">{donation.date}</td>
                    <td className="px-6 py-4 text-green-600 font-semibold">{donation.amount}</td>
                    <td className="px-6 py-4">{donation.purpose}</td>
                    <td className="px-6 py-4">{donation.status}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedDonation(donation)}
                        className="text-green-600 hover:text-green-700"
                      >
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Receipt Modal */}
        {selectedDonation && (
          <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl w-96">
              <h2 className="text-xl font-bold mb-3">Donation Receipt</h2>
              <p><b>Donor:</b> {selectedDonation.donor}</p>
              <p><b>Date:</b> {selectedDonation.date}</p>
              <p><b>Amount:</b> {selectedDonation.amount}</p>
              <p><b>Purpose:</b> {selectedDonation.purpose}</p>
              <p><b>Status:</b> {selectedDonation.status}</p>
              <button
                onClick={() => setSelectedDonation(null)}
                className="mt-4 w-full bg-green-500 text-white py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Request Donation Modal */}
        {showRequestForm && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Request Donation</h2>

              <form onSubmit={submitRequest} className="space-y-3">
                <input
                  name="purpose"
                  placeholder="Purpose (Medical, Food, Rescue)"
                  value={requestForm.purpose}
                  onChange={handleRequestChange}
                  required
                  className="w-full border p-2 rounded"
                />

                <input
                  type="number"
                  name="amount"
                  placeholder="Amount Needed"
                  value={requestForm.amount}
                  onChange={handleRequestChange}
                  required
                  className="w-full border p-2 rounded"
                />

                <input
                  type="date"
                  name="neededDate"
                  value={requestForm.neededDate}
                  onChange={handleRequestChange}
                  required
                  className="w-full border p-2 rounded"
                />

                <textarea
                  name="description"
                  placeholder="Description"
                  value={requestForm.description}
                  onChange={handleRequestChange}
                  required
                  className="w-full border p-2 rounded"
                />

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowRequestForm(false)}
                    className="px-4 py-2 border rounded"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Submit
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
