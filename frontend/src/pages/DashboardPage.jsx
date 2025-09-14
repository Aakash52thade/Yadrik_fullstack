// src/pages/DashboardPage.jsx - Main Dashboard Page
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/ui/Header';
import NotesList from '../components/notes/NotesList';
import AdminPanel from '../components/admin/AdminPanel';
import UpgradeModal from '../components/ui/UpgradeModal';

const DashboardPage = () => {
  const { user, isAdmin, isFreePlan } = useAuth();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handlePlanLimitReached = () => {
    setShowUpgradeModal(true);
  };

  const handleUpgradeSuccess = () => {
    // Modal will close automatically, just need to refresh any data if needed
    console.log('Tenant upgraded successfully!');
  };

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.email}!
              </h1>
              <p className="text-gray-600">
                You're logged in as <span className="font-medium">{user?.role}</span> at{' '}
                <span className="font-medium">{user?.tenant?.name}</span>
                {isFreePlan() && (
                  <span className="ml-2 text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Free Plan
                    </span>
                    {isAdmin() && (
                      <button
                        onClick={handleUpgradeClick}
                        className="ml-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Upgrade to Pro
                      </button>
                    )}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Admin Panel - Only visible to admins */}
          {isAdmin() && (
            <AdminPanel onUpgradeClick={handleUpgradeClick} />
          )}

          {/* Notes Section */}
          <div>
            <NotesList onPlanLimitReached={handlePlanLimitReached} />
          </div>
        </div>
      </main>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgradeSuccess={handleUpgradeSuccess}
      />
    </div>
  );
};

export default DashboardPage;