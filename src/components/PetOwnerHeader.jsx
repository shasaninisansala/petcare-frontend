import React from 'react';
import { Bell } from 'lucide-react';

export default function PetOwnerHeader({ title = "Dashboard Overview", subtitle = "Welcome back, Alex!" }) {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-3">
      <div className="flex items-center justify-between">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{title}</h1>
          <p className="text-gray-600 text-sm">{subtitle}</p>
        </div>

        {/* Notification Bell */}
        <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
}
