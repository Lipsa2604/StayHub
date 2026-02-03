import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaBars, FaUser } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg">
            <FaHome className="text-white text-2xl" />
          </div>
          <span className="text-2xl font-bold text-primary">StayHub</span>
        </Link>

        {/* Search bar (static for now) */}
        <div className="hidden md:flex items-center gap-4 bg-gray-100 px-4 py-2 rounded-full border border-gray-300">
          <input
            type="text"
            placeholder="Anywhere"
            className="bg-transparent outline-none w-32"
          />
          <div className="h-6 w-px bg-gray-300" />
          <input
            type="text"
            placeholder="Any week"
            className="bg-transparent outline-none w-32"
          />
          <div className="h-6 w-px bg-gray-300" />
          <input
            type="text"
            placeholder="Add guests"
            className="bg-transparent outline-none w-32"
          />
          <button className="bg-primary text-white p-2 rounded-full">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          <Link
            to="/host-dashboard"
            className="hidden md:block text-sm font-semibold hover:bg-gray-100 px-4 py-2 rounded-full"
          >
            Become a Host
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 border border-gray-300 rounded-full px-3 py-2 hover:shadow-md transition"
              >
                <FaBars className="text-gray-600" />
                <div className="bg-primary text-white rounded-full p-2">
                  <FaUser />
                </div>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2">
                  <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">
                    My Dashboard
                  </Link>
                  <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">
                    My Bookings
                  </Link>
                  <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">
                    Favorites
                  </Link>
                  <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">
                    Payments
                  </Link>
                  <hr className="my-2" />
                  <Link to="/host-dashboard" className="block px-4 py-2 hover:bg-gray-100">
                    Host Dashboard
                  </Link>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="px-4 py-2 hover:bg-gray-100 rounded-full">
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
