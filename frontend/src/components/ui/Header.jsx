// src/components/ui/Header.jsx - Main Header Component
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user, logout, isAdmin, isFreePlan } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Notes App
            </h1>
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center space-x-4">
            {/* Tenant and Plan Info */}
            <div className="text-sm text-gray-600">
              <span className="font-medium">{user?.tenant?.name}</span>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                isFreePlan() 
                  ? 'bg-gray-100 text-gray-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {user?.tenant?.plan?.toUpperCase()}
              </span>
            </div>

            {/* User Info */}
            <div className="text-sm">
              <span className="text-gray-600">{user?.email}</span>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                isAdmin() 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {user?.role?.toUpperCase()}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;