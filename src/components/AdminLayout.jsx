import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { Outlet } from 'react-router-dom';

export default function AdminLayout({ title = "Admin Panel", showGenerateReport = false }) {
  // Get admin data from localStorage
  const getUserData = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedData = JSON.parse(userData);
        // Check if the user is actually an admin
        if (parsedData.role === 'admin') {
          return parsedData;
        }
      }
      return null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };
  
  const userData = getUserData();
  const adminName = userData?.fullName || 'Admin User';
  const adminRole = 'System Admin';

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar 
        adminName={adminName} 
        adminRole={adminRole} 
      />
    
      <div className="flex-1 flex flex-col">
        <AdminHeader 
          title={title} 
          showGenerateReport={showGenerateReport} 
        />
        
        <main className="flex-1">
          <Outlet context={{ userData }} />
        </main>
      </div>
    </div>
  );
}