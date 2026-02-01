import React from 'react';
import { LayoutDashboard, Users, Plus,PawPrint} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function PetOwnerSidebar({ ownerName = "Alex Johnson", ownerRole = "Pet Owner" }) {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/pet-owner/dashboard' },
    { icon: Users, label: 'My Pets', path: '/pet-owner/mypets' },
    { icon: Plus, label: 'Add Pet', path: '/pet-owner/addpet' }
  ];


  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-8 py-6 border-b border-gray-200">
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
                    isActive ? 'bg-green-500 text-white' : 'text-gray-700 hover:bg-gray-100'
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

      {/* User Profile */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
            {ownerName.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{ownerName}</p>
            <p className="text-sm text-gray-500">{ownerRole}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
