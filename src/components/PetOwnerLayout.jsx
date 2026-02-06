import React, { useState, useEffect } from 'react';
import PetOwnerSidebar from '../components/PetOwnerSidebar';
import PetOwnerHeader from '../components/PetOwnerHeader';
import { Outlet, useNavigate } from 'react-router-dom';

export default function PetOwnerLayout({ title, subtitle }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const getUserData = () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedData = JSON.parse(userData);
          // Check if the user is actually a pet owner
          if (parsedData.role === 'pet-owner') {
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
    if (!userData) {
      // If no valid pet owner data, redirect to login
      navigate('/login');
    } else {
      setUser(userData);
    }
  }, [navigate]);

  if (!user) {
    // Show loading or nothing while checking auth
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <PetOwnerSidebar 
        ownerName={user.fullName || "Pet Owner"} 
        ownerRole="Pet Owner" 
      />
      
      <div className="flex-1 flex flex-col">
        <PetOwnerHeader title={title} subtitle={subtitle} />
        
        {/* Page Content */}
        <main className="flex-1">
          <Outlet context={{ userData: user }} />
        </main>
      </div>
    </div>
  );
}