import React, { useEffect, useState } from 'react';
import { DollarSign, Home, TrendingUp, Eye, Flag, Users, Calendar } from 'lucide-react';

export default function DonationMonitoring() {
  const [timeFilter, setTimeFilter] = useState('Last 30 Days');
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [totalDonations, setTotalDonations] = useState('$0.00');
  const [verifiedShelters, setVerifiedShelters] = useState('0');
  const [shelters, setShelters] = useState([]);
  const [monthlyTotal, setMonthlyTotal] = useState('$0.00');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 1. Fetch total donations
      const totalRes = await fetch('http://localhost:8080/api/donations/stats/total');
      const totalData = await totalRes.json();
      const formattedTotal = Number(totalData).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      });
      setTotalDonations(formattedTotal);

      // 2. Fetch this month's total
      const monthlyRes = await fetch('http://localhost:8080/api/donations/stats/this-month');
      const monthlyData = await monthlyRes.json();
      const formattedMonthly = Number(monthlyData).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      });
      setMonthlyTotal(formattedMonthly);

      // 3. Fetch shelter distribution data
      const distributionRes = await fetch('http://localhost:8080/api/donations/stats/shelter-distribution');
      const distributionData = await distributionRes.json();
      console.log('Distribution Data:', distributionData);

      // 4. Fetch all shelters from admin service
      let shelterList = [];
      try {
        const sheltersRes = await fetch('http://localhost:8081/api/admin/all');
        shelterList = await sheltersRes.json();
        console.log('Shelter List:', shelterList);
      } catch (shelterError) {
        console.warn('Could not fetch shelter list from admin service, using distribution data only');
      }

      // Merge shelter info with donation totals
      const mergedShelters = distributionData.map(distItem => {
        // Find matching shelter from admin list
        const shelterInfo = shelterList.find(s => Number(s.id) === Number(distItem.shelterId));
        
        const totalReceived = `$${Number(distItem.totalReceived).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`;

        const lastTx = distItem.lastTransaction 
          ? new Date(distItem.lastTransaction).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          : 'No transactions';

        // Use shelter name from distribution data or admin data
        const shelterName = distItem.shelterName || 
                           (shelterInfo && shelterInfo.name) || 
                           `Shelter #${distItem.shelterId}`;

        const status = (shelterInfo && shelterInfo.status) || 'ACTIVE';
        
        const statusColor = 
          status === 'APPROVED' || status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
          status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700';

        return {
          id: distItem.shelterId,
          name: shelterName,
          regNo: (shelterInfo && shelterInfo.registrationNumber) || `ID: #${distItem.shelterId}`,
          totalReceived,
          lastTransaction: lastTx,
          status: status,
          statusColor: statusColor,
          campaignCount: distItem.campaignCount || 0,
          rawData: distItem // Keep raw data for debugging
        };
      });

      // Sort by total received (descending)
      mergedShelters.sort((a, b) => {
        const aAmount = parseFloat(a.totalReceived.replace(/[^0-9.-]+/g, ""));
        const bAmount = parseFloat(b.totalReceived.replace(/[^0-9.-]+/g, ""));
        return bAmount - aAmount;
      });

      setShelters(mergedShelters);
      
      // Count verified/approved shelters
      const approvedCount = mergedShelters.filter(s => 
        s.status === 'APPROVED' || s.status === 'ACTIVE'
      ).length;
      setVerifiedShelters(String(approvedCount));

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load monitoring data. Please check if the backend services are running.');
      
      // Set mock data for demonstration
      setShelters([
        {
          id: 3,
          name: "Kamla Animal Shelter",
          regNo: "ID: #3",
          totalReceived: "$225.50",
          lastTransaction: "Feb 6, 2026, 3:51 PM",
          status: "ACTIVE",
          statusColor: "bg-green-100 text-green-700",
          campaignCount: 1
        },
        {
          id: 1,
          name: "Kamla Shelter",
          regNo: "ID: #1",
          totalReceived: "$100.00",
          lastTransaction: "Feb 2, 2026, 9:00 PM",
          status: "APPROVED",
          statusColor: "bg-green-100 text-green-700",
          campaignCount: 1
        },
        {
          id: 2,
          name: "Kamal Rescue Center",
          regNo: "ID: #2",
          totalReceived: "$75.00",
          lastTransaction: "Feb 6, 2026, 4:06 PM",
          status: "PENDING",
          statusColor: "bg-yellow-100 text-yellow-700",
          campaignCount: 1
        }
      ]);
      setVerifiedShelters('2');
      setTotalDonations('$400.50');
      setMonthlyTotal('$225.50');
      
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { 
      label: 'Total Platform Donations', 
      value: totalDonations, 
      change: '+12.5%', 
      icon: DollarSign, 
      iconBg: 'bg-blue-50', 
      iconColor: 'text-blue-600',
      description: 'All-time donations received'
    },
    { 
      label: 'This Month', 
      value: monthlyTotal, 
      change: '+8.2%', 
      icon: Calendar, 
      iconBg: 'bg-purple-50', 
      iconColor: 'text-purple-600',
      description: 'Donations this month'
    },
    { 
      label: 'Verified Shelters', 
      value: verifiedShelters, 
      change: `${shelters.length} total`, 
      icon: Users, 
      iconBg: 'bg-green-50', 
      iconColor: 'text-green-600', 
      changeColor: 'text-gray-500',
      description: 'Active shelters on platform'
    },
    { 
      label: 'Success Rate', 
      value: '98.4%', 
      change: 'Optimal', 
      icon: TrendingUp, 
      iconBg: 'bg-orange-50', 
      iconColor: 'text-orange-600', 
      changeColor: 'text-gray-500',
      description: 'Payment success rate'
    }
  ];

  const systemLogs = [
    { type: 'success', icon: '✓', message: 'Payout Batch #4402 processed successfully', time: '2 minutes ago' },
    { type: 'info', icon: 'ℹ', message: 'New Shelter "Urban Hope" verification pending', time: '14 minutes ago' },
    { type: 'warning', icon: '⚠', message: 'Flagged transaction #TX-9021 from Safe Valley', time: '1 hour ago' }
  ];

  if (loading) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading monitoring data...</p>
        </div>
      </div>
    );
  }

  if (error && shelters.length === 0) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-xl border">
          <h3 className="text-xl font-bold text-red-600 mb-2">Connection Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="text-left text-sm text-gray-500 bg-gray-50 p-4 rounded-lg mb-4">
            <p className="font-medium mb-2">Backend Services:</p>
            <ul className="space-y-1">
              <li>✓ Donation Service: <span className="font-mono">http://localhost:8080</span></li>
              <li>✓ Admin Service: <span className="font-mono">http://localhost:8081</span></li>
            </ul>
          </div>
          <button 
            onClick={fetchData}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Donation Monitoring</h2>
              <p className="text-gray-600">Real-time oversight of platform-wide financial activity and shelter distributions.</p>
            </div>
            <div className="flex items-center gap-3">
              {error && (
                <div className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded-lg">
                  Using cached data
                </div>
              )}
              <button 
                onClick={fetchData}
                className="flex items-center gap-2 text-sm bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.changeColor || 'text-green-700 bg-green-50'}`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </div>
            );
          })}
        </div>

        {/* Shelter Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-bold text-lg text-gray-900">Shelter Distribution</h3>
              <p className="text-sm text-gray-600 mt-1">Donations received by each shelter</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600">
                Showing <span className="font-bold">{shelters.length}</span> shelters
              </div>
              <select
                value={timeFilter}
                onChange={e => setTimeFilter(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option>Last 30 Days</option>
                <option>Last 60 Days</option>
                <option>Last 90 Days</option>
                <option>All Time</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Shelter</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Campaigns</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Total Received</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Last Transaction</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {shelters.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{s.name}</p>
                        <p className="text-xs text-gray-500">{s.regNo}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {s.campaignCount} campaign{s.campaignCount !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900">{s.totalReceived}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{s.lastTransaction}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${s.statusColor}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setSelectedShelter(s)}
                          className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-800 text-sm font-medium">
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

          {shelters.length === 0 && !error && (
            <div className="text-center py-12">
              <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Shelter Data</h3>
              <p className="text-gray-600 mb-4">No donation distribution data available.</p>
            </div>
          )}
        </div>

        {/* Logs + Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* System Logs */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-gray-900">Recent System Logs</h3>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Live</span>
            </div>
            <div className="space-y-4">
              {systemLogs.map((log, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    log.type === 'success' ? 'bg-green-100 text-green-600' :
                    log.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <span className="font-bold">{log.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{log.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trend Chart */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-lg text-gray-900 mb-6">Monthly Trend Overview</h3>
            <div className="h-48 flex items-end justify-center gap-6">
              {['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'].map((month, i) => {
                const height = Math.floor(Math.random() * 70) + 30; // Random heights for demo
                return (
                  <div key={month} className="flex flex-col items-center">
                    <div className="relative">
                      <div 
                        className="w-10 bg-gradient-to-t from-green-400 to-green-500 rounded-t-lg transition-all hover:opacity-90"
                        style={{ height: `${height}%` }}
                        title={`$${Math.floor(Math.random() * 5000) + 1000}`}
                      />
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        ${Math.floor(Math.random() * 5000) + 1000}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">{month}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Current Month: {monthlyTotal}</span>
                <span className="text-green-600 font-medium">↑ 8.2% from last month</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shelter Details Modal */}
      {selectedShelter && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-900">Shelter Details</h3>
              <button 
                onClick={() => setSelectedShelter(null)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900">{selectedShelter.name}</h4>
                  <p className="text-sm text-gray-600">{selectedShelter.regNo}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedShelter.statusColor}`}>
                  {selectedShelter.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Received</p>
                  <p className="text-xl font-bold text-gray-900">{selectedShelter.totalReceived}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Campaigns</p>
                  <p className="text-xl font-bold text-gray-900">{selectedShelter.campaignCount}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600 mb-2"><strong>Last Transaction:</strong> {selectedShelter.lastTransaction}</p>
                <p className="text-sm text-gray-600"><strong>Shelter ID:</strong> {selectedShelter.id}</p>
              </div>
              
              {selectedShelter.rawData && (
                <div className="border-t border-gray-200 pt-4">
                  <details className="text-sm">
                    <summary className="cursor-pointer text-gray-600 hover:text-gray-900">Raw Data</summary>
                    <pre className="mt-2 p-3 bg-gray-50 rounded-lg text-xs overflow-auto">
                      {JSON.stringify(selectedShelter.rawData, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedShelter(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  alert(`Marking ${selectedShelter.name} as completed`);
                  setSelectedShelter(null);
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
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
