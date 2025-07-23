import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { itemsAPI, statsAPI } from '../services/api';
import Layout from '../components/Layout/Layout';
import SearchFilters from '../components/SearchFilters';
import ItemCard from '../components/ItemCard';
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: 'active' });
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [itemsResponse, statsResponse] = await Promise.all([
        itemsAPI.getItems(filters),
        statsAPI.getStats()
      ]);
      
      if (itemsResponse.success) {
        setItems(itemsResponse.data);
      } else {
        setError('Failed to load items');
      }
      
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (err) {
      setError('Failed to load data');
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleContactOwner = (item) => {
    // In a real app, this would open a contact modal or send a message
    const message = `Hi ${item.userName}, I saw your ${item.type} item "${item.title}" on KIIT Finder. I'd like to get in touch regarding this item.`;
    const whatsappUrl = `https://wa.me/${item.userPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleResolveItem = async (itemId) => {
    try {
      const response = await itemsAPI.resolveItem(itemId);
      if (response.success) {
        // Refresh the items list
        loadData();
      } else {
        setError('Failed to resolve item');
      }
    } catch (err) {
      setError('Failed to resolve item');
      console.error('Error resolving item:', err);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color = 'primary', description }) => (
    <div className="card">
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
    </div>
  );

  if (loading && !items.length) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl text-white p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-primary-100 text-lg">
                Help reunite lost items with their owners at KIIT University
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <Link
                to="/add-item"
                className="inline-flex items-center px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors duration-200"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Report Item
              </Link>
            </div>
          </div>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Items"
              value={stats.totalItems}
              icon={MagnifyingGlassIcon}
              color="primary"
              description="All reported items"
            />
            <StatCard
              title="Lost Items"
              value={stats.lostItems}
              icon={ExclamationTriangleIcon}
              color="error"
              description="Items waiting to be found"
            />
            <StatCard
              title="Found Items"
              value={stats.foundItems}
              icon={CheckCircleIcon}
              color="success"
              description="Items found by community"
            />
            <StatCard
              title="Recent Activity"
              value={stats.recentItems}
              icon={ClockIcon}
              color="warning"
              description="Items reported this week"
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Search and Filters */}
        <SearchFilters
          onFiltersChange={handleFiltersChange}
          initialFilters={filters}
        />

        {/* Items Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Recent Items
            </h2>
            <p className="text-gray-600">
              {items.length} item{items.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-12">
              <MagnifyingGlassIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No items found
              </h3>
              <p className="text-gray-600 mb-6">
                {filters.search || filters.type || filters.category || filters.location
                  ? 'Try adjusting your search filters'
                  : 'Be the first to report a lost or found item'}
              </p>
              <Link
                to="/add-item"
                className="btn-primary inline-flex items-center"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Report Item
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onContact={handleContactOwner}
                  onResolve={handleResolveItem}
                  currentUserId={user?.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/add-item"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <PlusIcon className="w-8 h-8 text-primary-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Report Item</p>
                <p className="text-sm text-gray-600">Lost or found something?</p>
              </div>
            </Link>
            
            <Link
              to="/my-items"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <ClockIcon className="w-8 h-8 text-success-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">My Items</p>
                <p className="text-sm text-gray-600">Manage your reports</p>
              </div>
            </Link>
            
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <UsersIcon className="w-8 h-8 text-warning-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Admin Panel</p>
                  <p className="text-sm text-gray-600">Manage all items</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;