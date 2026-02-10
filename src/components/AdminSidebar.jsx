import React, { useState, useRef, useEffect } from 'react';
import { LayoutDashboard, ShieldCheck, DollarSign, FileText, PawPrint, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function AdminSidebar({ adminName = "Admin User", adminRole = "System Admin" }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: ShieldCheck, label: 'Shelter Verification', path: '/admin/shelter-verification' },
    { icon: DollarSign, label: 'Donations', path: '/admin/donations' },
    { icon: FileText, label: 'Reports', path: '/admin/reports' }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Function to get initials from full name
  const getInitials = (name) => {
    if (!name) return 'AU';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle logout
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    setIsDropdownOpen(false);
    navigate('/login'); 
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-8 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <PawPrint className="w-7 h-7 text-green-600" />
            <span className="text-2xl font-bold text-green-600">PetCare</span>
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

      {/* Admin Profile */}
      <div className="p-6 border-t border-gray-200 relative" ref={dropdownRef}>
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
            {getInitials(adminName)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{adminName}</p>
            <p className="text-sm text-gray-500">{adminRole}</p>
          </div>
          <button 
            className="text-gray-400 hover:text-gray-600 text-xl focus:outline-none"
            aria-label="More options"
          >
            ⋮
          </button>
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-700 hover:bg-gray-100 transition-colors"
            >
              <LogOut className="w-4 h-4 text-red-700" />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}