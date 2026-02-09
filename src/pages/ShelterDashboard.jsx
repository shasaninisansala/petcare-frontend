import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Heart, DollarSign, FileText, HandHeart, PlusCircle } from 'lucide-react';
import axios from 'axios';

export default function ShelterDashboard() {
  // State for real data
  const [counts, setCounts] = useState({
    adoptions: 0,
    requests: 0,
    successful: 0, // This will be the count of 'Approved' requests
    loading: true
  });

  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        // Fetch all adoptions and all requests
        const [adoptionsRes, requestsRes] = await Promise.all([
          axios.get('http://localhost:8083/adoption-app/adoptions'),
          axios.get('http://localhost:8083/adoption-app/adoption-requests')
        ]);

        const allRequests = Array.isArray(requestsRes.data) ? requestsRes.data : [];
        
        // Calculate successful adoptions (Status: Approved)
        const approvedCount = allRequests.filter(req => req.status === 'Approved').length;

        setCounts({
          adoptions: Array.isArray(adoptionsRes.data) ? adoptionsRes.data.length : 0,
          requests: allRequests.length,
          successful: approvedCount,
          loading: false
        });
      } catch (error) {
        console.error("Error fetching global stats:", error);
        setCounts(prev => ({ ...prev, loading: false }));
      }
    };

    fetchGlobalData();
  }, []);

  const stats = [
    {
      label: 'Total Adoption Listed',
      value: counts.loading ? '...' : counts.adoptions.toString(),
      change: 'Across all licenses',
      changeType: 'positive',
      icon: Users,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      label: 'Adoption Requests',
      value: counts.loading ? '...' : counts.requests.toString(),
      change: 'Total applications',
      changeType: 'warning',
      icon: FileText,
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    {
      label: 'Successful Adoptions',
      value: counts.loading ? '...' : counts.successful.toString(), // Real count of Approved requests
      change: 'Approved requests',
      changeType: 'positive',
      icon: Heart,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      label: 'Donations Received',
      value: '$12,450',
      change: '+12% from last month',
      changeType: 'positive',
      icon: DollarSign,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600'
    }
  ];

  const quickActions = [
    {
      icon: FileText,
      label: `Review ${counts.requests} Requests`,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      icon: HandHeart,
      label: 'Manage Donations',
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      icon: PlusCircle,
      label: 'Add Adoption',
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'adoption',
      title: 'New adoption request from',
      name: 'Sarah Jenkins',
      description: 'Buddy (Golden Retriever)',
      time: '2 mins ago',
      icon: Users,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      action: 'Review'
    },
    {
      id: 2,
      type: 'donation',
      title: 'Donation received from',
      name: 'Anonymous',
      description: 'Amount: $250.00',
      time: '1 hour ago',
      icon: DollarSign,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
      action: 'View'
    },
    {
      id: 3,
      type: 'finalized',
      title: 'Adoption Finalized!',
      name: null,
      description: 'Luna has found her forever home.',
      time: 'Yesterday',
      icon: Heart,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      action: 'Archive'
    }
  ];

  return (
    <div className="flex-1 bg-gray-50">
      <div className="p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
          <p className="text-gray-600">Welcome back, Administrator. Here is what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {stat.changeType === 'positive' && <TrendingUp className="w-4 h-4" />}
                  {stat.changeType === 'warning' && <span>⚠</span>}
                  <span>{stat.change}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xl">⚡</span>
              <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
            </div>
            <div className="space-y-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    className="w-full flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all group"
                  >
                    <div className={`w-12 h-12 ${action.iconBg} rounded-lg flex items-center justify-center group-hover:bg-green-100`}>
                      <Icon className={`w-6 h-6 ${action.iconColor} group-hover:text-green-600`} />
                    </div>
                    <span className="font-medium text-gray-900 group-hover:text-green-600">
                      {action.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔄</span>
                <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
              </div>
              <button className="text-green-600 font-medium hover:text-green-700 text-sm">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className={`w-10 h-10 ${activity.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${activity.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        {activity.title}
                        {activity.name && (
                          <span className="text-green-600 font-medium">{activity.name}</span>
                        )}
                      </p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-gray-500 mb-1">{activity.time}</p>
                      <button className="text-xs font-medium text-gray-900 hover:text-green-600">
                        {activity.action}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}