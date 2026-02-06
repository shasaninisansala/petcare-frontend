import React from 'react';
import { Bell, Download } from 'lucide-react';

export default function AdminHeader({ title = "Admin Panel", showGenerateReport = false }) {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Page Title */}
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>

        {/* Right Side - Notifications & Generate Report */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Generate Report Button */}
          {showGenerateReport && (
            <button className="px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2">
              <Download className="w-5 h-5" />
              Generate Report
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
