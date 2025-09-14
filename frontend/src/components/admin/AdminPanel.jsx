// src/components/admin/AdminPanel.jsx - Admin Panel for User Management
import React, { useState, useEffect } from 'react';
import { usersAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { InlineSpinner } from '../ui/LoadingSpinner';

const AdminPanel = ({ onUpgradeClick }) => {
  const { user, isAdmin, isFreePlan } = useAuth();
  const [tenantUsers, setTenantUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [inviting, setInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState('');

  useEffect(() => {
    if (isAdmin()) {
      loadTenantUsers();
    }
  }, []);

  const loadTenantUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await usersAPI.getTenantUsers();
      setTenantUsers(response.users);
    } catch (error) {
      setError('Failed to load tenant users');
      console.error('Load tenant users error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteUser = async (e) => {
    e.preventDefault();
    
    if (!inviteEmail.trim()) {
      setError('Please enter an email address');
      return;
    }

    setInviting(true);
    setError('');
    setInviteSuccess('');

    try {
      const response = await usersAPI.inviteUser(inviteEmail.trim(), inviteRole);
      setInviteSuccess(
        `User invited successfully! Temporary password: ${response.temporaryPassword}`
      );
      setInviteEmail('');
      setInviteRole('member');
      
      // Refresh user list
      await loadTenantUsers();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to invite user';
      setError(errorMessage);
    } finally {
      setInviting(false);
    }
  };

  if (!isAdmin()) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          Admin Panel
        </h3>
        
        {/* Upgrade Button for Free Plan */}
        {isFreePlan() && (
          <button
            onClick={onUpgradeClick}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            Upgrade to Pro
          </button>
        )}
      </div>

      {/* Tenant Info */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-gray-900 mb-2">Tenant Information</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Name:</span>
            <span className="ml-2 font-medium">{user?.tenant?.name}</span>
          </div>
          <div>
            <span className="text-gray-600">Slug:</span>
            <span className="ml-2 font-medium">{user?.tenant?.slug}</span>
          </div>
          <div>
            <span className="text-gray-600">Plan:</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
              isFreePlan() 
                ? 'bg-gray-100 text-gray-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {user?.tenant?.plan?.toUpperCase()}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Users:</span>
            <span className="ml-2 font-medium">{tenantUsers.length}</span>
          </div>
        </div>
      </div>

      {/* Invite User Form */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Invite New User</h4>
        
        <form onSubmit={handleInviteUser} className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Enter email address"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                disabled={inviting}
                required
              />
            </div>
            <div>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                disabled={inviting}
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <button
                type="submit"
                disabled={inviting || !inviteEmail.trim()}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {inviting && <InlineSpinner />}
                <span className={inviting ? 'ml-2' : ''}>
                  {inviting ? 'Inviting...' : 'Invite'}
                </span>
              </button>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="rounded-md bg-red-50 p-3">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {inviteSuccess && (
            <div className="rounded-md bg-green-50 p-3">
              <div className="text-sm text-green-700">{inviteSuccess}</div>
            </div>
          )}
        </form>
      </div>

      {/* Users List */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Tenant Users</h4>
        
        {loading ? (
          <div className="text-center py-4">
            <InlineSpinner />
            <span className="ml-2 text-sm text-gray-500">Loading users...</span>
          </div>
        ) : tenantUsers.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">No users found</p>
          </div>
        ) : (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tenantUsers.map((tenantUser) => (
                  <tr key={tenantUser.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tenantUser.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        tenantUser.role === 'admin'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {tenantUser.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        ACTIVE
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;