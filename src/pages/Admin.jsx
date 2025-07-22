import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { itemsAPI, usersAPI, statsAPI } from '../services/api';
import Layout from '../components/Layout/Layout';
import ItemCard from '../components/ItemCard';
import SearchFilters from '../components/SearchFilters';
import { 
  UsersIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon,
  TrashIcon,
  EyeIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin, filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [itemsResponse, usersResponse, statsResponse] = await Promise.all([
        itemsAPI.getItems(filters),
        usersAPI.getUsers(),
        statsAPI.getStats()
      ]);
      
      if (itemsResponse.success) {
        setItems(itemsResponse.data);
      }
      
      if (usersResponse.success) {
        setUsers(usersResponse.data);
      }
      
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (err) {
      setError('Failed to load admin data');
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await itemsAPI.deleteItem(itemId);
      if (response.success) {
        setItems(prevItems => prevItems.filter(item => item.id !== itemId));
      } else {
        setError('Failed to delete item');
      }
    } catch (err) {
      setError('Failed to delete item');
      console.error('Error deleting item:', err);
    }
  };

  const handleResolveItem = async (itemId) => {
    try {
      const response = await itemsAPI.resolveItem(itemId);
      if (response.success) {
        setItems(prevItems =>
          prevItems.map(item =>
            item.id === itemId ? { ...item, status: 'resolved' } : item
          )
        );
      } else {
        setError('Failed to resolve item');
      }
    } catch (err) {
      setError('Failed to resolve item');
      console.error('Error resolving item:', err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await usersAPI.deleteUser(userId);
      if (response.success) {
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      } else {
        setError('Failed to delete user');
      }
    } catch (err) {
      setError('Failed to delete user');
      console.error('Error deleting user:', err);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color = 'primary', description, trend }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg bg-${color}-100`}>
            <Icon className={`w-6 h-6 text-${color}-600`} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
          </div>
        </div>
        {trend && (
          <div className={`text-sm font-medium ${trend > 0 ? 'text-success-600' : 'text-error-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
    </div>
  );

  if (!isAdmin) {
    return (
      <Layout>
        <div className="text-center py-12">
          <ShieldCheckIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the admin panel.</p>
        </div>
      </Layout>
    );
  }

  if (loading && !items.length && !users.length) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading admin panel...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Panel
            </h1>
            <p className="text-gray-600">
              Manage users, items, and system overview
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ShieldCheckIcon className="w-5 h-5" />
            <span>Admin: {user?.name}</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'overview', label: 'Overview', icon: ChartBarIcon },
              { key: 'items', label: 'All Items', icon: MagnifyingGlassIcon },
              { key: 'users', label: 'Users', icon: UsersIcon }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === key
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Items"
                value={stats.totalItems}
                icon={MagnifyingGlassIcon}
                color="primary"
                description="All reported items"
              />
              <StatCard
                title="Active Items"
                value={stats.activeItems}
                icon={ClockIcon}
                color="warning"
                description="Items still being searched"
              />
              <StatCard
                title="Resolved Items"
                value={stats.resolvedItems}
                icon={CheckCircleIcon}
                color="success"
                description="Successfully reunited"
              />
              <StatCard
                title="Total Users"
                value={stats.totalUsers}
                icon={UsersIcon}
                color="primary"
                description="Registered community members"
              />
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Item Types</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Lost Items</span>
                    <span className="text-sm font-medium text-error-600">{stats.lostItems}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Found Items</span>
                    <span className="text-sm font-medium text-success-600">{stats.foundItems}</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resolution Rate</h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-success-600 mb-2">
                    {stats.resolutionRate}%
                  </div>
                  <p className="text-sm text-gray-600">Items successfully resolved</p>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">
                    {stats.recentItems}
                  </div>
                  <p className="text-sm text-gray-600">Items reported this week</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Items Tab */}
        {activeTab === 'items' && (
          <div className="space-y-6">
            <SearchFilters
              onFiltersChange={setFilters}
              initialFilters={filters}
            />

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                All Items ({items.length})
              </h2>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-12">
                <MagnifyingGlassIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-600">Try adjusting your search filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <div key={item.id} className="relative">
                    <ItemCard
                      item={item}
                      onResolve={handleResolveItem}
                      currentUserId={user?.id}
                      showActions={false}
                    />
                    
                    {/* Admin Actions */}
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <button
                        onClick={() => {
                          // In a real app, this would open a detailed view modal
                          alert(`Item Details:\n\nTitle: ${item.title}\nType: ${item.type}\nStatus: ${item.status}\nOwner: ${item.userName}\nEmail: ${item.userEmail}\nPhone: ${item.userPhone}`);
                        }}
                        className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-primary-50 hover:border-primary-200 transition-colors duration-200"
                        title="View details"
                      >
                        <EyeIcon className="w-4 h-4 text-primary-600" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-error-50 hover:border-error-200 transition-colors duration-200"
                        title="Delete item"
                      >
                        <TrashIcon className="w-4 h-4 text-error-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                All Users ({users.length})
              </h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((userData) => (
                      <tr key={userData.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {userData.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {userData.studentId}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{userData.email}</div>
                          <div className="text-sm text-gray-500">{userData.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            userData.role === 'admin'
                              ? 'bg-primary-100 text-primary-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {userData.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(userData.joinedDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            userData.status === 'active'
                              ? 'bg-success-100 text-success-800'
                              : 'bg-error-100 text-error-800'
                          }`}>
                            {userData.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => {
                                // In a real app, this would open a user details modal
                                alert(`User Details:\n\nName: ${userData.name}\nEmail: ${userData.email}\nStudent ID: ${userData.studentId}\nPhone: ${userData.phone}\nRole: ${userData.role}\nStatus: ${userData.status}`);
                              }}
                              className="text-primary-600 hover:text-primary-900"
                              title="View user details"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </button>
                            {userData.id !== user?.id && (
                              <button
                                onClick={() => handleDeleteUser(userData.id)}
                                className="text-error-600 hover:text-error-900"
                                title="Delete user"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Admin;