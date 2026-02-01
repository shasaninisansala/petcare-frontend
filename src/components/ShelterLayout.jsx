import React from 'react';
import ShelterSidebar from './ShelterSidebar';
import ShelterHeader from './ShelterHeader';
import { Outlet } from 'react-router-dom';

export default function ShelterLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <ShelterSidebar />

      <div className="flex-1 flex flex-col">
        <ShelterHeader shelterName="Happy Paws Shelter" verified={true} />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
