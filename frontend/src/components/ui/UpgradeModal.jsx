// src/components/ui/UpgradeModal.jsx - Plan Upgrade Modal
import React, { useState } from 'react';
import { tenantAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { InlineSpinner } from './LoadingSpinner';

const UpgradeModal = ({ isOpen, onClose, onUpgradeSuccess }) => {
  const { user, updateUser, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleUpgrade = async () => {
    if (!isAdmin()) {
      setError('Only administrators can upgrade the tenant plan.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await tenantAPI.upgradeTenant(user.tenant.slug);
      
      // Update user data with new plan
      const updatedUser = {
        ...user,
        tenant: {
          ...user.tenant,
          plan: 'pro'
        }
      };
      updateUser(updatedUser);

      setSuccess(true);
      
      // Call success callback after a short delay
      setTimeout(() => {
        if (onUpgradeSuccess) {
          onUpgradeSuccess();
        }
        handleClose();
      }, 2000);

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to upgrade tenant';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess(false);
    setLoading(false);
    if (onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Upgrade to Pro
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-blue-900 mb-2">Pro Plan Benefits</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li> Unlimited notes</li>
                <li>All current features</li>
                <li> Priority support</li>
              </ul>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Current Status</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Tenant: <span className="font-medium">{user?.tenant?.name}</span></div>
                <div>Current Plan: <span className="font-medium uppercase">{user?.tenant?.plan}</span></div>
                <div>Your Role: <span className="font-medium uppercase">{user?.role}</span></div>
              </div>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {success && (
            <div className="rounded-md bg-green-50 p-4 mb-4">
              <div className="text-sm text-green-700">
                🎉 Successfully upgraded to Pro! You now have unlimited notes.
              </div>
            </div>
          )}

          {/* Admin-only notice */}
          {!isAdmin() && (
            <div className="rounded-md bg-yellow-50 p-4 mb-4">
              <div className="text-sm text-yellow-700">
                 Only administrators can upgrade the tenant plan. Please contact your admin.
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 disabled:opacity-50"
              disabled={loading}
            >
              {success ? 'Close' : 'Cancel'}
            </button>
            
            {isAdmin() && !success && (
              <button
                onClick={handleUpgrade}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading && <InlineSpinner />}
                <span className={loading ? 'ml-2' : ''}>
                  {loading ? 'Upgrading...' : 'Upgrade to Pro'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;