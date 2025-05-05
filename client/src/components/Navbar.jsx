import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../authContext';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigateTo = (path) => {
    navigate(`/${path}`);
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  const handleSignOut = () => {
    logout();
    toast.info('Logged Out!');
    navigateTo('home');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
    setIsProfileDropdownOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen((prev) => !prev);
  };

  const navLinks = [
    { name: 'Home', path: 'home' },
    { name: 'My Flights', path: 'my_flights' },
    { name: 'Contact', path: 'contact' },
    { name: 'About', path: 'about' },
  ];

  return (
    <nav className="w-screen h-[90px] border-blue-700 border-b-2 flex items-center justify-between bg-gradient-to-r from-blue-300 to-slate-300 relative z-30">
      {/* Logo */}
      <Link to="/home" className="h-full flex items-center pl-4">
        <img
          src="/lucas icon 1.png"
          alt="Website Logo"
          style={{ height: "290px", width: "220px" }}
          className="h-12 ml-0 pl-0 pt-3   object-contain transition-transform duration-300 hover:scale-105"
        />
      </Link>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex flex-grow justify-center">
        <div className="flex gap-8">
          {navLinks.map((link) => (
            <button
              key={link.path}
              className="px-4 py-2 rounded-lg text-gray-800 font-medium hover:bg-blue-600 hover:text-white hover:bg-opacity-75 focus:outline-none transition-colors duration-300"
              onClick={() => navigateTo(link.path)}
              aria-label={`Navigate to ${link.name}`}
            >
              {link.name}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop User Actions */}
      <div className="hidden md:flex items-center pr-10" ref={profileDropdownRef}>
        {isAuthenticated ? (
          <div className="relative">
            <button
              className="px-4 py-2 rounded-lg text-xl text-gray-800 font-medium hover:bg-blue-600 hover:text-slate-200 focus:outline-none transition-colors duration-300"
              onClick={toggleProfileDropdown}
              aria-haspopup="true"
              aria-expanded={isProfileDropdownOpen}
            >
              User
            </button>
            {isProfileDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-10">
                <button
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 focus:outline-none transition-colors duration-200"
                  onClick={() => navigateTo('user_profile')}
                >
                  Profile
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 focus:outline-none transition-colors duration-200"
                  onClick={handleSignOut}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            className="px-4 py-2 rounded-lg text-gray-800 font-medium hover:bg-blue-600 hover:text-slate-200 focus:outline-none transition-colors duration-300"
            onClick={() => navigateTo('login')}
          >
            Login/Signup
          </button>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden p-4 text-gray-800 focus:outline-none"
        onClick={toggleMobileMenu}
        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isMobileMenuOpen}
      >
        <FontAwesomeIcon
          icon={isMobileMenuOpen ? faTimes : faBars}
          size="lg"
          className="transition-transform duration-200"
        />
      </button>

      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed top-0 right-0 h-screen w-64 bg-slate-700 shadow-lg z-20 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
      >
        <div className="flex flex-col items-center py-6 space-y-4">
          {navLinks.map((link) => (
            <button
              key={link.path}
              className="w-full text-center py-3 text-gray-900 hover:bg-gray-100 focus:outline-none transition-colors duration-200"
              onClick={() => navigateTo(link.path)}
            >
              {link.name}
            </button>
          ))}
          {isAuthenticated ? (
            <>
              <button
                className="w-full text-center py-3 text-gray-900 hover:bg-gray-100 focus:outline-none transition-colors duration-200"
                onClick={() => navigateTo('user_profile')}
              >
                Profile
              </button>
              <button
                className="w-full text-center py-3 text-gray-900 hover:bg-gray-100 focus:outline-none transition-colors duration-200"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              className="w-full text-center py-3 text-gray-800 hover:bg-gray-100 focus:outline-none transition-colors duration-200"
              onClick={() => navigateTo('login')}
            >
              Login/Signup
            </button>
          )}
        </div>
      </div>

      {/* Overlay for Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}
    </nav>
  );
}

export default Navbar;