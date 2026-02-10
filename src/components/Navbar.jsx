import React, { useState, useEffect } from 'react';
import { PawPrint } from 'lucide-react';
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const linkClass = (path, isEmergency = false) =>
    `transition-colors font-medium ${
      isActive(path)
        ? isEmergency
          ? "text-red-600 border-b-2 border-red-600"
          : "text-primary border-b-2 border-primary"
        : isEmergency
        ? "text-red-500 hover:text-red-700"
        : "text-gray-700 hover:text-primary"
    }`;

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
          <Link to="/" className={linkClass("/")}>Home</Link>
          <Link to="/adopt" className={linkClass("/adopt")}>Adopt</Link>
          <Link to="/donate" className={linkClass("/donate")}>Donate</Link>
          <Link to="/emergency" className={linkClass("/emergency", true)}>Emergency</Link>
          <Link to="/breedinfo" className={linkClass("/breedinfo")}>Breed Info</Link>
          <Link to="/about" className={linkClass("/about")}>About Us</Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <Link to="/login" className={linkClass("/login")}>
            Login
          </Link>
          <Link to = "/register" className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-md font-medium transition-colors">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
