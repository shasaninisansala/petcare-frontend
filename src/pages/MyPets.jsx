import React, { useState } from 'react';
import { Plus, Eye, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MyPets() {
  const [activeFilter, setActiveFilter] = useState('All Statuses');

  const pets = [
    {
      id: 1,
      name: 'Charlie',
      breed: 'Beagle',
      age: '3 years old',
      image: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=400&h=300&fit=crop',
      status: 'HEALTHY',
      statusColor: 'bg-green-100 text-green-700',
      lastCheckup: 'Oct 12, 2023',
      nextBooster: 'Jan 2024'
    },
    {
      id: 2,
      name: 'Cooper',
      breed: 'Golden Retriever',
      age: '1 year',
      image: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400&h=300&fit=crop',
      status: 'HEALTHY',
      statusColor: 'bg-green-100 text-green-700',
      lastCheckup: 'Dec 01, 2023',
      nextBooster: 'Jun 2024'
    },
    {
      id: 3,
      name: 'Luna',
      breed: 'Domestic Shorthair',
      age: '5 years',
      image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400&h=300&fit=crop',
      status: 'DUE SOON',
      statusColor: 'bg-orange-100 text-orange-700',
      lastCheckup: 'Aug 22, 2023',
      nextVaccine: 'IN 3 DAYS'
    }
  ];

  return (
    <div className="flex-1 bg-gray-50">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">My Pets</h2>
            <p className="text-green-600 text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              3 Pets Registered
            </p>
          </div>
          <Link to='/pet-owner/addpet' className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Record
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveFilter('All Statuses')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeFilter === 'All Statuses'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Statuses
            </button>
            <button
              onClick={() => setActiveFilter('All Species')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeFilter === 'All Species'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Species
            </button>
          </div>
        </div>

        {/* Pets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {pets.map((pet) => (
            <div key={pet.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Pet Image */}
              <div className="h-48 bg-gray-100">
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Pet Info */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{pet.name}</h3>
                    <p className="text-sm text-gray-600">{pet.breed} • {pet.age}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${pet.statusColor}`}>
                    {pet.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Checkup</span>
                    <span className="text-gray-900 font-medium">{pet.lastCheckup}</span>
                  </div>
                  {pet.nextBooster && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Next Booster</span>
                      <span className="text-gray-900 font-medium">{pet.nextBooster}</span>
                    </div>
                  )}
                  {pet.nextVaccine && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Next Vaccine</span>
                      <span className="text-orange-600 font-bold">{pet.nextVaccine}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    to="/pet-owner/petdetail"
                    className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link to="/pet-owner/petdetail" className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Pet Card */}
          <Link to="/pet-owner/addpet" className="block">
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 hover:border-green-500 transition-colors cursor-pointer">
                <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Register New Pet</h3>
                <p className="text-sm text-gray-600">
                    Easily manage your pet's medical history and appointments.
                </p>
                </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
