import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { itemsAPI } from '../services/api';
import Layout from '../components/Layout/Layout';
import ItemCard from '../components/ItemCard';
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const MyItems = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, resolved
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMyItems();
  }, [user?.id]);

  const loadMyItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await itemsAPI.getItems({ userId: user?.id });
      
      if (response.success) {
        setItems(response.data);
      } else {
        setError('Failed to load your items');
      }
    } catch (err) {
      setError('Failed to load your items');
      console.error('Error loading user items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveItem = async (itemId) => {
    try {
      const response = await itemsAPI.resolveItem(itemId);
      if (response.success) {
        // Update the item in the local state
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

  const filteredItems = items.filter(item => {
    if (filter === 'active') return item.status === 'active';
    if (filter === 'resolved') return item.status === 'resolved';
    return true; // all
  });

  const stats = {
    total: items.length,
    active: items.filter(item => item.status === 'active').length,
    resolved: items.filter(item => item.status === 'resolved').length,
    lost: items.filter(item => item.type === 'lost').length,
    found: items.filter(item => item.type === 'found').length
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your items...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Items
            </h1>
            <p className="text-gray-600">
              Manage all the items you've reported
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              to="/add-item"
              className="btn-primary inline-flex items-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Report New Item
            </Link>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="card text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Items</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-success-600">{stats.active}</div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.resolved}</div>
            <div className="text-sm text-gray-600">Resolved</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-error-600">{stats.lost}</div>
            <div className="text-sm text-gray-600">Lost</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-success-600">{stats.found}</div>
            <div className="text-sm text-gray-600">Found</div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-4">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filter by status:</span>
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'All Items', count: stats.total },
                { key: 'active', label: 'Active', count: stats.active },
                { key: 'resolved', label: 'Resolved', count: stats.resolved }
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    filter === key
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {label} ({count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div>
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <MagnifyingGlassIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'all' ? 'No items reported yet' : `No ${filter} items`}
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all' 
                  ? 'Start by reporting a lost or found item to help the community'
                  : `You don't have any ${filter} items at the moment`
                }
              </p>
              {filter === 'all' && (
                <Link
                  to="/add-item"
                  className="btn-primary inline-flex items-center"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Report Your First Item
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="relative">
                  <ItemCard
                    item={item}
                    onResolve={handleResolveItem}
                    currentUserId={user?.id}
                    showActions={false}
                  />
                  
                  {/* Owner Actions */}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      onClick={() => {
                        // In a real app, this would open an edit modal
                        alert('Edit functionality would be implemented here');
                      }}
                      className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                      title="Edit item"
                    >
                      <PencilIcon className="w-4 h-4 text-gray-600" />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-error-50 hover:border-error-200 transition-colors duration-200"
                      title="Delete item"
                    >
                      <TrashIcon className="w-4 h-4 text-error-600" />
                    </button>
                  </div>
                  
                  {/* Owner Actions at Bottom */}
                  {item.status === 'active' && (
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => handleResolveItem(item.id)}
                        className="flex-1 btn-success text-sm"
                      >
                        Mark as Resolved
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tips */}
        {items.length > 0 && (
          <div className="bg-primary-50 border border-primary-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-primary-900 mb-3">
              💡 Tips for Better Results
            </h3>
            <ul className="space-y-2 text-sm text-primary-800">
              <li>• Keep your item descriptions detailed and accurate</li>
              <li>• Add clear photos to help people identify your items</li>
              <li>• Update your contact information if it changes</li>
              <li>• Mark items as resolved once they're found/returned</li>
              <li>• Check back regularly for messages from potential finders</li>
            </ul>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyItems;