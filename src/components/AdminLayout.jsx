import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { Outlet } from 'react-router-dom';

export default function AdminLayout({ children, title = "Admin Panel", showGenerateReport = false }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar adminName="Alex Morgan" adminRole="System Admin" />
    
      <div className="flex-1 flex flex-col">
        <AdminHeader title={title} showGenerateReport={showGenerateReport} />
        
        <main className="flex-1">
        <Outlet/>
        </main>
      </div>
    </div>
  );
}
