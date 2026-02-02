import React, { useState, useEffect } from 'react';
import { Search, Download, PlusCircle, Upload } from 'lucide-react';
import axios from 'axios';

export default function Donations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [donations, setDonations] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);

  const [showRequestForm, setShowRequestForm] = useState(false);

  const [requestForm, setRequestForm] = useState({
    shelterId: '',
    purpose: '',
    amount: '',
    description: '',
    neededDate: '',
    image: null
  });

  useEffect(() => {
    axios.get('/api/donations')
      .then(res => setDonations(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleRequestChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setRequestForm({ ...requestForm, image: files[0] });
    } else {
      setRequestForm({ ...requestForm, [name]: value });
    }
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("shelterId", requestForm.shelterId);
      formData.append("purpose", requestForm.purpose);
      formData.append("amount", requestForm.amount);
      formData.append("description", requestForm.description);
      formData.append("neededDate", requestForm.neededDate);
      formData.append("image", requestForm.image);

      await axios.post('/api/donation-requests', formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Donation request submitted!");
      setShowRequestForm(false);
      setRequestForm({
        shelterId: '',
        purpose: '',
        amount: '',
        description: '',
        neededDate: '',
        image: null
      });
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

        {/* Request Donation Modal */}
        {showRequestForm && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Request Donation</h2>

              <form onSubmit={submitRequest} className="space-y-3">

                <input
                  name="shelterId"
                  placeholder="Shelter ID"
                  value={requestForm.shelterId}
                  onChange={handleRequestChange}
                  required
                  className="w-full border p-2 rounded"
                />

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

                {/* Styled Image Upload */}
                <div className="flex justify-center mb-4">
                  <label className="w-80 rounded-lg p-6 text-center hover:border-green-500 transition-colors cursor-pointer border border-gray-300">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-700 font-medium mb-1">Add</p>
                    <p className="text-sm text-gray-500">Images/jpeg,png,jpg,gif</p>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      className="hidden"
                      onChange={handleRequestChange}
                      required
                    />
                  </label>
                </div>

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
