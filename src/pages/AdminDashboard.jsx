import React from 'react';
import { Users, PawPrint, FileText, Home, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    {
      label: 'Total Users',
      value: '1,240',
      change: '+12%',
      icon: Users,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      label: 'Registered Pets',
      value: '850',
      change: '+5%',
      icon: PawPrint,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      label: 'Adoption Requests',
      value: '45',
      change: '8 pending',
      icon: FileText,
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
      changeColor: 'text-orange-600'
    },
    {
      label: 'Verified Shelters',
      value: '12',
      change: 'Stable',
      icon: Home,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      changeColor: 'text-purple-600'
    }
  ];

  const pendingVerifications = [
    { name: 'Happy Paws Rescue', location: 'New York, NY' },
    { name: 'City Animal Center', location: 'Chicago, IL' },
    { name: 'Mountain Bark Haven', location: 'Denver, CO' }
  ];

  const recentActivity = [
    {
      icon: '👤',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      text: 'New User registered from Los Angeles',
      time: '2 minutes ago'
    },
    {
      icon: '💰',
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
      text: 'Donation Alert: Anonymous donated $60',
      time: '15 minutes ago'
    },
    {
      icon: '🏠',
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
      text: 'New Shelter: Blue Cross Shelter applied',
      time: '45 minutes ago'
    },
    {
      icon: '🐕',
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
      text: 'Pet Record: Golden Retriever "Buddy" added',
      time: '1 hour ago'
    }
  ];

  const recentPets = [
    { name: 'Buddy', breed: 'Golden Retriever', image: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=200&h=200&fit=crop' },
    { name: 'Luna', breed: 'Calico Cat' },
    { name: 'Snowy', breed: 'White Rabbit' },
    { name: 'Max', breed: 'French Bulldog' },
    { name: 'Oliver', breed: 'Ginger Cat' }
  ];

  return (
    <div className="flex-1 bg-gray-50">
      <div className="p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Shelter Verifications */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Pending Shelter Verifications</h3>
              <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                View All
              </button>
            </div>

            <div className="space-y-4">
              <table className="w-full">
                <thead className="text-left border-b border-gray-200">
                  <tr>
                    <th className="pb-3 text-sm font-semibold text-gray-700">Shelter Name</th>
                    <th className="pb-3 text-sm font-semibold text-gray-700">Location</th>
                    <th className="pb-3 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pendingVerifications.map((shelter, index) => (
                    <tr key={index}>
                      <td className="py-3 text-sm text-gray-900">{shelter.name}</td>
                      <td className="py-3 text-sm text-gray-600">{shelter.location}</td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <button className="px-3 py-1 bg-green-500 text-white rounded text-xs font-medium hover:bg-green-600">
                            Approve
                          </button>
                          <button className="px-3 py-1 bg-red-50 text-red-600 rounded text-xs font-medium hover:bg-red-100">
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Recent Activity Feed</h3>
            </div>

            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                  <div className={`w-10 h-10 ${activity.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <span className="text-lg">{activity.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
              <button className="w-full text-center text-sm text-gray-600 hover:text-gray-900 font-medium py-2">
                Load More Activity
              </button>
            </div>
          </div>
        </div>

        {/* Recent Registered Pets */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Registered Pets</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {recentPets.map((pet, index) => (
              <div key={index} className="text-center">
                <div className="w-full aspect-square bg-gray-100 rounded-xl mb-3 overflow-hidden">
                  {pet.image ? (
                    <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
                  )}
                </div>
                <p className="font-semibold text-gray-900 mb-1">{pet.name}</p>
                <p className="text-sm text-gray-600">{pet.breed}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
