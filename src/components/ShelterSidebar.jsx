import React from 'react';
import { Home, Users, Heart, DollarSign, User,PawPrint } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function ShelterSidebar() {
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/shelter/dashboard' },
    { icon: Users, label: 'Adoption Listings', path: '/shelter/adoption-listings' },
    { icon: Heart, label: 'Adoption Requests', path: '/shelter/adoption-requests' },
    { icon: DollarSign, label: 'Donation', path: '/shelter/donations' },
    { icon: User, label: 'Shelter Profile', path: '/shelter/profile' }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-8 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <PawPrint className="w-7 h-7 text-primary" />
            <span className="text-2xl font-bold text-primary">PetCare</span>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-green-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Emergency Help */}
      <div className="p-6 border-t border-gray-200">
        <button className="text-red-600 font-medium text-sm hover:text-red-700">
          Emergency Help
        </button>
      </div>
    </div>
  );
}
