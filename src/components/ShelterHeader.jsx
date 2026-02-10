import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ShelterHeader({
  shelterName = "Loading...",
  regId = "",
  profileImage = "",
  verified = true
}) {

  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Shelter Name */}
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold text-gray-900">
          {shelterName || "Loading..."}
        </h1>

        {verified && (
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>

  {/* Reg ID under name */}
  <p className="text-xs text-gray-500">
    Reg ID: {regId || "..."}
  </p>
</div>


        {/* Right Side -  Profile */}
        <div className="flex items-center gap-4 relative">

          {/* Profile Avatar */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-10 h-10 rounded-full overflow-hidden border"
            >
              {profileImage ? (
                <img
                  src={`data:image/jpeg;base64,${profileImage}`}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                  A
                </div>
              )}
            </button>


            {/* Dropdown Menu */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                <Link to='/shelter/profile'>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 font-medium">
                  View Profile
                </button>
                </Link>
                <Link to='/'>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-700 font-medium">
                  Logout
                </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
