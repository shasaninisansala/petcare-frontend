import React from 'react';
import PetOwnerSidebar from './PetOwnerSidebar';
import PetOwnerHeader from './PetOwnerHeader';
import { Outlet } from 'react-router-dom';

export default function PetOwnerLayout({ children, title, subtitle }) {
  return (
    <div className="flex min-h-screen bg-gray-50">

      <PetOwnerSidebar ownerName="Alex Johnson" ownerRole="Pet Owner" />
      
      <div className="flex-1 flex flex-col">
        <PetOwnerHeader title={title} subtitle={subtitle} />
        
        {/* Page Content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
