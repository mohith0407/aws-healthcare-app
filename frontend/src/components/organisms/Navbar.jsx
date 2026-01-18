import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../atoms/Button';

const Navbar = () => {
  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="container-main flex justify-between items-center h-16">
        {/* Logo */}
        <div className="text-2xl font-bold text-primary flex items-center gap-2">
          <span>🩺</span> DocAppoint
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8 text-gray-600 font-medium">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <Link to="/about" className="hover:text-primary transition-colors">About Us</Link>
          <Link to="/doctors" className="hover:text-primary transition-colors">Find Doctors</Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex gap-4">
          <Link to="/login">
            <Button variant="outline" className="hidden sm:block">Login</Button>
          </Link>
          <Link to="/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;