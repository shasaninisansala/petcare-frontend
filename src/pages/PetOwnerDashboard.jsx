import React, { useState, useEffect } from 'react';
import { Users, Calendar, AlertCircle, Plus, Eye, Syringe, Heart } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

export default function PetOwnerDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState([
    {
      label: 'Total Pets',
      value: '0',
      description: 'No pets yet',
      icon: Users,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      label: 'Upcoming',
      value: '0',
      description: 'Due within 30 days',
      icon: Calendar,
      iconBg: 'bg-yellow-50',
      iconColor: 'text-yellow-600'
    },
    {
      label: 'Overdue',
      value: '0',
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
  ]);

  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      toast.error('Please login first');
      window.location.href = '/login';
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch pets and stats in parallel
      const [petsData, statsData] = await Promise.all([
        api.getPets(),
        api.getPetStats()
      ]);

      if (Array.isArray(petsData)) {
        setPets(petsData.slice(0, 2)); // Show only first 2 pets on dashboard
      }

      if (statsData) {
        const newStats = [...stats];
        newStats[0].value = statsData.totalPets ? statsData.totalPets.toString() : '0';
        newStats[0].description = petsData && petsData.length > 0 
          ? petsData.map(pet => pet.petName).join(' & ') 
          : 'No pets yet';
        newStats[1].value = statsData.upcomingVaccinations ? statsData.upcomingVaccinations.toString() : '0';
        newStats[2].value = statsData.overdueVaccinations ? statsData.overdueVaccinations.toString() : '0';
        setStats(newStats);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'Unknown';
    
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const years = today.getFullYear() - birthDate.getFullYear();
    
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}`;
    } else {
      const months = today.getMonth() - birthDate.getMonth();
      return `${months} month${months !== 1 ? 's' : ''}`;
    }
  };

  const getPetImage = (pet) => {
    // If pet has uploaded image (stored as URL), use it
    if (pet.imageUrl && pet.imageUrl.startsWith('/')) {
      // Make sure the URL is complete
      if (pet.imageUrl.startsWith('/petowner-app/')) {
        return `http://localhost:8080${pet.imageUrl}`;
      } else {
        return `http://localhost:8080/petowner-app${pet.imageUrl}`;
      }
    }
    
    // If it's already a full URL
    if (pet.imageUrl && (pet.imageUrl.startsWith('http://') || pet.imageUrl.startsWith('https://'))) {
      return pet.imageUrl;
    }
    
    // Otherwise use default based on species
    if (pet.species === 'dog') {
      return 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=300&h=300&fit=crop';
    } else if (pet.species === 'cat') {
      return 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=300&h=300&fit=crop';
    } else {
      return 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop';
    }
  };

  if (loading) {
    return (
      <div className="flex-1 bg-gray-50 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50">
      <div className="p-8">
        {/* Welcome Message */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your pets, track their health, and connect with other pet lovers.
          </p>
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
        {pets.length > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-8 border border-green-200">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                  <Syringe className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Keep your pets healthy!
                  </h3>
                  <p className="text-gray-700">
                    Stay on top of your pet's health with regular checkups and vaccination reminders.
                  </p>
                </div>
              </div>
              <Link 
                to="/pet-owner/mypets"
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2 whitespace-nowrap ml-4"
              >
                View All Pets
                <span>→</span>
              </Link>
            </div>
          </div>
        )}

        {/* My Pets Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Pets</h2>
            <Link 
              to="/pet-owner/mypets" 
              className="text-green-600 hover:text-green-700 font-medium text-sm"
            >
              View All
            </Link>
          </div>

          {pets.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No pets yet</h3>
              <p className="text-gray-600 mb-6">Add your first pet to start tracking their health and activities.</p>
              <Link 
                to="/pet-owner/addpet"
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                Add First Pet
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pets.map((pet) => (
                <div key={pet.petId} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="flex">
                    {/* Pet Image */}
                    <div className="w-48 h-48 flex-shrink-0">
                      <img
                        src={getPetImage(pet)}
                        alt={pet.petName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // If image fails to load, use default
                          if (pet.species === 'dog') {
                            e.target.src = 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=300&h=300&fit=crop';
                          } else if (pet.species === 'cat') {
                            e.target.src = 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=300&h=300&fit=crop';
                          } else {
                            e.target.src = 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop';
                          }
                        }}
                      />
                    </div>

                    {/* Pet Details */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{pet.petName}</h3>
                          <p className="text-gray-600">
                            {pet.breed || 'Unknown breed'} • {calculateAge(pet.dateOfBirth)}
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                          {pet.status || 'Active'}
                        </span>
                      </div>

                      <div className="space-y-3 mb-4">
                        {pet.weight && (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-50 rounded flex items-center justify-center">
                              <span className="text-blue-600 text-xs">⚖</span>
                            </div>
                            <span className="text-sm text-gray-700">{pet.weight} kg</span>
                          </div>
                        )}
                        {pet.height && (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-green-50 rounded flex items-center justify-center">
                              <span className="text-green-600 text-xs">📏</span>
                            </div>
                            <span className="text-sm text-gray-700">{pet.height} cm</span>
                          </div>
                        )}
                      </div>

                      <Link
                        to={`/pet-owner/petdetail?petId=${pet.petId}`}
                        className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700 flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}