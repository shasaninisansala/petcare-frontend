import React, { useState, useEffect } from 'react';
import { PawPrint } from 'lucide-react';
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <PawPrint className="w-7 h-7 text-primary" />
          <span className="text-2xl font-bold text-primary">PetCare</span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#home" className="text-gray-700 hover:text-primary transition-colors font-medium">
            Home
          </a>
          <a href="#adopt" className="text-gray-700 hover:text-primary transition-colors font-medium">
            Adopt
          </a>
          <a href="#donate" className="text-gray-700 hover:text-primary transition-colors font-medium">
            Donate
          </a>
          <a href="#emergency" className="text-primary font-semibold hover:text-primary-dark transition-colors">
            Emergency
          </a>
          <a href="#breed-info" className="text-gray-700 hover:text-primary transition-colors font-medium">
            Breed Info
          </a>
          <a href="#about" className="text-gray-700 hover:text-primary transition-colors font-medium">
            About Us
          </a>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <Link to='/login' className="text-gray-700 hover:text-primary transition-colors font-medium">
            Login
          </Link>
          <button className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-md font-medium transition-colors">
            Register
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
