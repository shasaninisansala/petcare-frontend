import React from 'react';
import { Users, Calendar, AlertCircle, Plus, Eye, Syringe } from 'lucide-react';

export default function PetOwnerDashboard() {
  const stats = [
    {
      label: 'Total Pets',
      value: '2',
      description: 'Buddy & Luna',
      icon: Users,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      label: 'Upcoming',
      value: '3',
      description: 'Due within 30 days',
      icon: Calendar,
      iconBg: 'bg-yellow-50',
      iconColor: 'text-yellow-600'
    },
    {
      label: 'Overdue',
      value: '1',
      description: 'Requires attention',
      icon: AlertCircle,
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600'
    },
    {
      label: 'Emergency Access',
      value: 'ACTIVE',
      description: '24/7 Priority Support',
      icon: Plus,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      isText: true
    }
  ];

  const pets = [
    {
      id: 1,
      name: 'Buddy',
      breed: 'Golden Retriever',
      age: '3 years',
      image: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=300&h=300&fit=crop',
      status: 'Healthy',
      statusColor: 'bg-green-100 text-green-700',
      weight: '32 kg',
      nextVaccine: 'Booster: Oct 12'
    },
    {
      id: 2,
      name: 'Luna',
      breed: 'Siamese Cat',
      age: '5 years',
      image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=300&h=300&fit=crop',
      status: 'Overdue',
      statusColor: 'bg-red-100 text-red-700',
      weight: '4.5 kg',
      warning: 'Vaccination Overdue'
    }
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
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className={`text-3xl font-bold ${stat.isText ? 'text-blue-600' : 'text-gray-900'}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
                <p className="text-sm text-gray-600">{stat.description}</p>
              </div>
            );
          })}
        </div>

        {/* AI Reminder */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-8 border border-green-200">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                <Syringe className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  AI Reminder: Next vaccination for Buddy is due in 7 days
                </h3>
                <p className="text-gray-700">
                  Our smart schedule tracker analysis shows Buddy needs a Rabies booster. Stay on top of your pet's
                  health with automated reminders.
                </p>
              </div>
            </div>
            <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2 whitespace-nowrap ml-4">
              View Schedule
              <span>→</span>
            </button>
          </div>
        </div>

        {/* My Pets Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Pets</h2>
            <button className="text-green-600 hover:text-green-700 font-medium text-sm">
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pets.map((pet) => (
              <div key={pet.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex">
                  {/* Pet Image */}
                  <div className="w-48 h-48 flex-shrink-0">
                    <img
                      src={pet.image}
                      alt={pet.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Pet Details */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{pet.name}</h3>
                        <p className="text-gray-600">{pet.breed} • {pet.age}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${pet.statusColor}`}>
                        {pet.status}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-50 rounded flex items-center justify-center">
                          <span className="text-blue-600 text-xs">⚖</span>
                        </div>
                        <span className="text-sm text-gray-700">{pet.weight}</span>
                      </div>
                      {pet.nextVaccine && (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-green-50 rounded flex items-center justify-center">
                            <Syringe className="w-3 h-3 text-green-600" />
                          </div>
                          <span className="text-sm text-gray-700">{pet.nextVaccine}</span>
                        </div>
                      )}
                      {pet.warning && (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-red-50 rounded flex items-center justify-center">
                            <AlertCircle className="w-3 h-3 text-red-600" />
                          </div>
                          <span className="text-sm text-red-700 font-medium">{pet.warning}</span>
                        </div>
                      )}
                    </div>

                    <button className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700 flex items-center justify-center gap-2">
                      <Eye className="w-4 h-4" />
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
